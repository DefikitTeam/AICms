window.AIChatWidget = {
  config: {},
  init: function(config) {
    // Validate required config parameters
    if (!config.widgetUrl) {
      console.error('Widget URL is required');
      return;
    }

    // Normalize the widget URL (remove trailing slash if present)
    config.widgetUrl = config.widgetUrl.replace(/\/$/, '');
    this.config = config;

    // Generate or use provided roomId
    this.config.roomId = config.roomId || this.generateRoomId();
    
    // Store roomId in localStorage for persistence
    localStorage.setItem('ai-chat-widget-roomId', this.config.roomId);

    // Verify the logo URL is accessible
    const logoUrl = `${this.config.widgetUrl}/logo.png`;
    this.verifyImageUrl(logoUrl).then(isValid => {
      if (!isValid) {
        console.warn(`Logo not found at ${logoUrl}, using fallback icon`);
      }
    });

    // Store auth token in localStorage for persistence
    if (config.authToken) {
      localStorage.setItem('ai-chat-widget-token', config.authToken);
    }
    
    // Create container and set theme and position
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'ai-chat-widget-container';
    widgetContainer.setAttribute('data-theme', config.theme || 'light');
    widgetContainer.setAttribute('data-position', config.position || 'bottom-right'); // Add position attribute
    
    // Load styles
    if (!document.querySelector('link[href$="/styling.css"]')) {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = `${this.config.widgetUrl}/styling.css`;
      document.head.appendChild(styleLink);

      // Initialize external triggers after styles are loaded
      styleLink.onload = () => initializeExternalTriggers();
    } else {
      initializeExternalTriggers();
    }

    this.renderWidget(widgetContainer);
  },

  // Save a message to localStorage history
  saveMessageToHistory: function(message, isUser) {
    const messageObj = {
      text: message,
      isUser,
      timestamp: new Date().toISOString()
    };
    
    // Load current messages
    const messages = this.loadMessageHistory();
    
    // Add new message
    messages.push(messageObj);
    
    // Limit to last 50 messages to prevent localStorage overflow
    const limitedMessages = messages.slice(-50);
    
    // Store back in localStorage
    localStorage.setItem(`ai-chat-widget-messages-${this.config.roomId}`, JSON.stringify(limitedMessages));
    
    return limitedMessages;
  },
  
  // Load message history from localStorage
  loadMessageHistory: function() {
    const savedMessages = localStorage.getItem(`ai-chat-widget-messages-${this.config.roomId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  },
  
  // Render message history to chat container
  renderMessageHistory: function(messagesContainer) {
    const messages = this.loadMessageHistory();
    
    if (messages.length === 0) return;
    
    // Clear existing messages
    messagesContainer.innerHTML = '';
    
    // Render each message
    messages.forEach(msg => {
      if (msg.isUser) {
        messagesContainer.innerHTML += `
          <div class="flex justify-end">
            <div class="max-w-[80%]">
              <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm">
                ${msg.text}
              </div>
            </div>
          </div>
        `;
      } else {
        messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm">
                ${msg.text}
              </div>
            </div>
          </div>
        `;
      }
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },

  generateRoomId: function() {
    // Get stored roomId or generate new one based on domain
    const storedRoomId = localStorage.getItem('ai-chat-widget-roomId');
    if (storedRoomId) {
      return storedRoomId;
    }
    
    // Generate roomId based on domain name
    const domain = window.location.hostname;
    return `room-${domain}-${Date.now()}`;
  },

  verifyImageUrl: function(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  },

  getStoredToken: function() {
    return localStorage.getItem('ai-chat-widget-token');
  },

  sendMessage: async function(message) {
    const token = this.config.authToken;
    
    try {
      const response = await fetch(`${this.config.serverUrl}/${this.config.agentId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.config.agentId,
          text: message,
          userId: 'widget-user',
          userName: 'Widget User',
          roomId: this.config.roomId
        })
      });
      // ... rest of send message logic
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  clearChat: function() {
    // Remove chat history
    localStorage.removeItem(`ai-chat-widget-messages-${this.config.roomId}`);
    
    // Remove roomId
    localStorage.removeItem('ai-chat-widget-roomId');
    
    // Generate new roomId
    this.config.roomId = this.generateRoomId();
    
    // Store new roomId in localStorage
    localStorage.setItem('ai-chat-widget-roomId', this.config.roomId);
    
    // Return empty message history
    return [];
  },

  renderWidget: function(container) {
    // Create button and dialog
    const button = document.createElement('button');
    button.className = 'ai-chat-widget-button';
    button.style.backgroundColor = '#334155'; // slate-700
    button.style.borderRadius = '50%'; // Make it circular
    button.style.padding = '10px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    
    const dialog = document.createElement('div');
    dialog.className = 'ai-chat-widget-modal';
    dialog.style.visibility = 'hidden';
    dialog.style.opacity = '0';
    
    // Set consistent transform state regardless of screen size
    dialog.style.transform = 'scale(0.95)';
    dialog.style.transformOrigin = 'bottom right';
    dialog.style.bottom = '70px'; // Space between button and dialog
    dialog.style.zIndex = '99999'; // Ensure highest z-index
    
    // Apply consistent styles for all screen sizes (mobile-like layout)
    dialog.style.width = 'calc(100% - 20px)'; // Add some margin on edges
    dialog.style.maxWidth = '400px'; // Set a reasonable max-width for desktop
    dialog.style.height = 'auto';
    dialog.style.maxHeight = 'calc(90vh - 80px)'; // Leave space for button
    dialog.style.borderRadius = '0.75rem';
    dialog.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
    dialog.style.position = 'fixed';
    
    // Set initial position based on container's data-position attribute
    const initialPosition = container.getAttribute('data-position') || 'bottom-right';
    this.adjustDialogPosition(dialog, initialPosition);
    
    // Handle resize events to maintain proportions only
    window.addEventListener('resize', () => {
      // Adjust max-width based on screen size
      if (window.matchMedia('(max-width: 480px)').matches) {
        dialog.style.maxWidth = '100%';
      } else {
        dialog.style.maxWidth = '400px';
      }
      
      // Reapply position styles based on container position attribute
      const position = container.getAttribute('data-position');
      this.adjustDialogPosition(dialog, position);
    });
    
    // Remove the individual margin styling since it's handled in CSS
    container.style.margin = '0';
    
    dialog.innerHTML = `
      <div class="flex flex-col bg-white dark:bg-neutral-800 h-full rounded-lg overflow-hidden">
        <div class="border-b p-4 flex justify-between items-center dark:border-neutral-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          <button class="close-button text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-100">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4 -webkit-overflow-scrolling-touch" id="chat-messages"></div>
        <div class="border-t dark:border-neutral-700 dark:bg-neutral-700">
          <div class="p-2" id="chat-form-container">
            <!-- Replace the form with a modified version that preserves button positions -->
            <form class="flex flex-row items-center gap-2" id="chat-form" style="display: flex !important; flex-wrap: nowrap !important;">
              <div style="flex: 0 0 auto;">
                <button 
                  type="button" 
                  id="clear-chat-button"
                  class="rounded-md bg-gray-200 dark:bg-neutral-600 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-500 text-sm font-medium transition-colors duration-200"
                  style="width: 36px; height: 36px; padding: 0; min-width: 36px;"
                  title="Clear chat history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <input 
                name="message" 
                class="flex-1 min-w-0 rounded-md border border-neutral-700 p-2 text-sm focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 text-black dark:text-white dark:placeholder-gray-400" 
                style="flex: 1 1 auto; min-width: 0;"
                placeholder="Type a message..."
              />
              <div style="flex: 0 0 auto;">
                <button 
                  type="submit" 
                  class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  style="white-space: nowrap; height: 36px;"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    let isOpen = false;

    // Toggle button handler
    button.innerHTML = `
      <div class="flex items-center">
        <img 
          src="${this.config.widgetUrl}/logo.png" 
          alt="Chat with Agent"
          class="h-10 w-10"
          onerror="this.onerror=null; this.parentElement.innerHTML='<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'h-6 w-6 text-white\'><path d=\'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\'></path></svg>';"
        />
      </div>
    `;

    button.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        dialog.style.visibility = 'visible';
        requestAnimationFrame(() => {
          dialog.style.opacity = '1';
          dialog.style.transform = 'scale(1)';
          
          // Ensure dialog is properly positioned on small screens when opened
          if (window.matchMedia('(max-width: 640px)').matches) {
            dialog.style.transform = 'translateY(0)';
          }
        });
        button.innerHTML = `
          <div class="flex items-center justify-center w-full h-full">
            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        `;
        // Update button style for close state
        button.style.backgroundColor = '#334155'; // slate-700
      } else {
        this.closeWidget(dialog, button);
      }
    });

    // Close button handler
    const closeButton = dialog.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      isOpen = false;
      this.closeWidget(dialog, button);
    });

    // Click outside handler
    document.addEventListener('mousedown', (event) => {
      if (!dialog.contains(event.target) && !button.contains(event.target)) {
        if (isOpen) {
          isOpen = false;
          this.closeWidget(dialog, button);
        }
      }
    });

    // Handle chat form submission
    const form = dialog.querySelector('#chat-form');
    const messagesContainer = dialog.querySelector('#chat-messages');
    
    // Add clear chat button handler
    const clearChatButton = dialog.querySelector('#clear-chat-button');
    clearChatButton.addEventListener('click', () => {
      this.clearChat();
      messagesContainer.innerHTML = '';
      
      // Show a system message that the chat has been cleared
      messagesContainer.innerHTML = `
        <div class="flex justify-center my-4">
          <div class="text-center bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">
            Chat history cleared. You are now in a new conversation.
          </div>
        </div>
      `;
    });
    
    // Load and render existing chat messages
    this.renderMessageHistory(messagesContainer);
    
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const submitButton = form.querySelector('button[type="submit"]');
      const message = input?.value.trim();
      
      if (!message) return;

      // Disable input and button
      input.disabled = true;
      submitButton.disabled = true;
      // Add visual feedback class
      submitButton.setAttribute('disabled', 'disabled');

      try {
        // Save user message to history and add to UI
        this.saveMessageToHistory(message, true);
        messagesContainer.innerHTML += `
          <div class="flex justify-end">
            <div class="max-w-[80%]">
              <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm">
                ${message}
              </div>
            </div>
          </div>
        `;

        // Add loading message bubble for agent
        const loadingBubbleId = `loading-${Date.now()}`;
        messagesContainer.innerHTML += `
          <div class="flex justify-start" id="${loadingBubbleId}">
            <div class="max-w-[80%]">
              <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm min-h-[2.5rem] flex items-center justify-center">
                <span class="typing-dots text-center">
                  <span class="dot animate-bounce" style="animation-delay: 0ms">.</span>
                  <span class="dot animate-bounce" style="animation-delay: 200ms">.</span>
                  <span class="dot animate-bounce" style="animation-delay: 400ms">.</span>
                </span>
              </div>
            </div>
          </div>
        `;

        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Send message to agent
        const token = this.getStoredToken();
        const response = await fetch(`${this.config.serverUrl}/${this.config.agentId}/message`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            agentId: this.config.agentId, 
            text: message,
            userId: 'widget-user',
            userName: 'Widget User',
            roomId: this.config.roomId
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response from agent');
        }

        const data = await response.json();
        const reply = Array.isArray(data) && data.length > 0 ? data[0].text : 'No reply from agent.';

        // Save agent reply to history
        this.saveMessageToHistory(reply, false);

        // Replace loading bubble with actual response
        const loadingBubble = document.getElementById(loadingBubbleId);
        if (loadingBubble) {
          const bubbleContent = loadingBubble.querySelector('.bg-gray-100, .dark\\:bg-neutral-700');
          
          // Fade out dots
          const dots = bubbleContent.querySelector('.typing-dots');
          dots.style.opacity = '0';
          dots.style.transition = 'opacity 0.2s ease-out';

          // After dots fade, update content
          setTimeout(() => {
            bubbleContent.innerHTML = reply;
            bubbleContent.style.minHeight = 'unset'; // Remove fixed height
          }, 200);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } catch (error) {
        console.error('Error sending message:', error);
        
        const errorMessage = 'Failed to get response from agent. Please try again.';
        // Save error message to history
        this.saveMessageToHistory(errorMessage, false);
        
        messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-red-100 text-red-600 px-4 py-2 rounded-2xl rounded-tl-sm">
                ${errorMessage}
              </div>
            </div>
          </div>
        `;
      } finally {
        // Re-enable input and button
        input.disabled = false;
        submitButton.disabled = false;
        // Remove visual feedback class
        submitButton.removeAttribute('disabled');
        input.focus();
      }
    });

    // Append elements to container and document
    container.appendChild(button);
    container.appendChild(dialog);
    document.body.appendChild(container);

    // Ensure the container itself has proper styling
    container.style.position = 'fixed';
    container.style.zIndex = '99998'; // Just below dialog
    
    // Position the container based on its data-position attribute
    const position = container.getAttribute('data-position') || 'bottom-right';
    if (position === 'bottom-left') {
      container.style.bottom = '20px';
      container.style.left = '20px';
      container.style.right = 'auto';
      container.style.top = 'auto';
    } else if (position === 'top-right') {
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.bottom = 'auto';
      container.style.left = 'auto';
    } else if (position === 'top-left') {
      container.style.top = '20px';
      container.style.left = '20px';
      container.style.bottom = 'auto';
      container.style.right = 'auto';
    } else { // default: bottom-right
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.top = 'auto';
      container.style.left = 'auto';
    }
    
    // Make the button more visible and accessible on mobile
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    button.style.zIndex = '99998';
    
    // Fix iOS Safari scrolling issues
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      messagesContainer.style.WebkitOverflowScrolling = 'touch';
    }
    
    // Apply specific fixes for top positions on mobile
    if (position === 'top-right' || position === 'top-left') {
      if (window.matchMedia('(max-width: 640px)').matches) {
        // Fix dialog positioning for top positions on mobile
        dialog.style.top = '70px'; // Position below the widget button
        dialog.style.bottom = 'auto';
        dialog.style.transformOrigin = position === 'top-right' ? 'top right' : 'top left';
        
        // Fix the gap below input field
        const formContainer = dialog.querySelector('#chat-form-container');
        if (formContainer) {
          formContainer.style.paddingBottom = '0';
          formContainer.style.marginBottom = '0';
        }
        
        const form = dialog.querySelector('#chat-form');
        if (form) {
          form.style.marginBottom = '0';
        }
        
        // Add a CSS class to help with targeting this specific layout
        dialog.classList.add(`${position}-mobile`);
      }
    }
  },

  // Add a new helper method for positioning the dialog
  adjustDialogPosition: function(dialog, position) {
    // Reset all positions first
    dialog.style.top = 'auto';
    dialog.style.bottom = 'auto';
    dialog.style.left = 'auto';
    dialog.style.right = 'auto';
    
    if (position === 'bottom-left') {
      dialog.style.bottom = '70px';
      dialog.style.left = '10px';
      dialog.style.transformOrigin = 'bottom left';
    } else if (position === 'top-right') {
      dialog.style.top = '70px';
      dialog.style.right = '10px';
      dialog.style.transformOrigin = 'top right';
    } else if (position === 'top-left') {
      dialog.style.top = '70px';
      dialog.style.left = '10px';
      dialog.style.transformOrigin = 'top left';
    } else { // default: bottom-right
      dialog.style.bottom = '70px';
      dialog.style.right = '10px';
      dialog.style.transformOrigin = 'bottom right';
    }
  },

  closeWidget: function(dialog, button) {
    // Use the same animation style for both desktop and mobile
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      dialog.style.visibility = 'hidden';
    }, 200);
    
    button.innerHTML = `
      <div class="flex items-center justify-center w-full h-full">
        <img 
          src="${this.config.widgetUrl}/logo.png" 
          alt="Chat with Agent"
          class="h-8 w-8"
          onerror="this.onerror=null; this.parentElement.innerHTML='<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'h-6 w-6 text-white\'><path d=\'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\'></path></svg>';"
        />
      </div>
    `;
    // Reset button style for open state
    button.style.backgroundColor = '#334155'; // slate-700
  }
};

function initializeExternalTriggers() {
  // Find all external trigger buttons
  const externalTriggers = document.querySelectorAll('[data-widget-trigger]');
  
  externalTriggers.forEach(trigger => {
    // Add necessary classes
    trigger.classList.add('ai-chat-widget-button');
    
    // Create send icon SVG
    const sendIcon = document.createElement('span');
    sendIcon.className = 'send-icon';
    sendIcon.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="h-5 w-5"
      >
        <path d="M22 2L11 13"></path>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
      </svg>
    `;
    
    // Create loading spinner
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner hidden';
    spinner.innerHTML = `
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;

    // Clear existing content and add new elements
    trigger.innerHTML = '';
    trigger.appendChild(sendIcon);
    trigger.appendChild(spinner);

    // Add styles directly to button
    trigger.style.display = 'inline-flex';
    trigger.style.alignItems = 'center';
    trigger.style.justifyContent = 'center';
    trigger.style.width = '40px';
    trigger.style.height = '40px';
    trigger.style.padding = '8px';
    trigger.style.borderRadius = '6px';
    trigger.style.color = '#2563eb'; // blue-600
    trigger.style.cursor = 'pointer';
  });
}

function initializeWidget() {
  const widget = document.getElementById('ai-cms-widget');
  if (!widget) return;

  // Force widget to use its own styles
  widget.setAttribute('data-theme-independent', 'true');
  
  // Ensure all inputs within widget use our styles
  const inputs = widget.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.style.setProperty('color', '#000000', 'important');
    input.style.setProperty('background-color', '#ffffff', 'important');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeWidget();
  // Add viewport adjustment check after initial load
  setTimeout(adjustWidgetForViewport, 500);
});

// Add a check for viewport size that adjusts styling on page load
function adjustWidgetForViewport() {
  const container = document.getElementById('ai-chat-widget-container');
  if (!container) return;
  
  const dialog = container.querySelector('.ai-chat-widget-modal');
  if (!dialog) return;
  
  const position = container.getAttribute('data-position') || 'bottom-right';
  
  // Apply consistent mobile-like layout regardless of screen size
  dialog.style.width = 'calc(100% - 20px)';
  dialog.style.maxWidth = window.matchMedia('(max-width: 480px)').matches ? '100%' : '400px';
  dialog.style.height = 'auto';
  dialog.style.maxHeight = 'calc(90vh - 80px)';
  dialog.style.borderRadius = '0.75rem';
  
  // Call the positioning helper from AIChatWidget
  if (window.AIChatWidget && typeof window.AIChatWidget.adjustDialogPosition === 'function') {
    window.AIChatWidget.adjustDialogPosition(dialog, position);
  }
  
  // Special handling for top positions
  if (position === 'top-right' || position === 'top-left') {
    // Fix the chat form container and input field gap
    const formContainer = dialog.querySelector('#chat-form-container');
    if (formContainer) {
      formContainer.style.paddingBottom = '0';
      formContainer.style.marginBottom = '0';
      formContainer.style.borderBottom = 'none';
    }
    
    // Fix any padding in the form itself
    const form = dialog.querySelector('#chat-form');
    if (form) {
      form.style.marginBottom = '0';
      form.style.paddingBottom = '8px';
    }
  }
  
  // Detect iOS Safari and add additional styles
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const messagesContainer = dialog.querySelector('#chat-messages');
    if (messagesContainer) {
      messagesContainer.style.WebkitOverflowScrolling = 'touch';
    }
  }

  // Form layout fixes that apply to all screen sizes
  const form = container.querySelector('#chat-form');
  if (!form) return;
  
  form.style.display = 'flex';
  form.style.flexDirection = 'row';
  form.style.flexWrap = 'nowrap';
  form.style.alignItems = 'center';
  form.style.width = '100%';
  
  const formContainer = container.querySelector('#chat-form-container');
  if (formContainer) {
    formContainer.style.padding = '8px';
  }
  
  const input = form.querySelector('input');
  if (input) {
    input.style.flex = '1 1 auto';
    input.style.minWidth = '0';
  }
  
  const buttonContainers = form.querySelectorAll('div');
  buttonContainers.forEach(div => {
    div.style.flex = '0 0 auto';
  });
}

// Listen for orientation changes on mobile
window.addEventListener('orientationchange', adjustWidgetForViewport);

// Attach event listener for load events
window.addEventListener('load', () => {
  setTimeout(adjustWidgetForViewport, 100);
});