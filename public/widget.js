window.AIChatWidget = {
  config: {},
  init: function(config) {
    this.config = config;
    
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
          userName: 'Widget User'
        })
      });
      // ... rest of send message logic
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  renderWidget: function(container) {
    // Create button and dialog
    const button = document.createElement('button');
    button.className = 'ai-chat-widget-button';
    
    const dialog = document.createElement('div');
    dialog.className = 'ai-chat-widget-modal';
    dialog.style.visibility = 'hidden';
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0)';
    
    dialog.innerHTML = `
      <div class="flex flex-col bg-white dark:bg-neutral-800 h-full">
        <div class="border-b p-4 flex justify-between items-center dark:border-neutral-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          <button class="close-button text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-100">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages"></div>
        <div class="border-t dark:border-neutral-700 dark:bg-neutral-700">
          <form class="flex flex-wrap gap-2" id="chat-form">
            <input 
              name="message" 
              class="flex-1 min-w-0 rounded-md border border-neutral-700 p-2 text-sm focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 text-black dark:text-white dark:placeholder-gray-400" 
              placeholder="Type a message..."
            />
            <button 
              type="submit" 
              class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    `;

    let isOpen = false;

    // Toggle button handler
    button.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Chat with Agent</span>
      </div>
    `;

    button.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        dialog.style.visibility = 'visible';
        requestAnimationFrame(() => {
          dialog.style.opacity = '1';
          dialog.style.transform = 'scale(1)';
        });
        button.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span>Close Chat</span>
          </div>
        `;

        // Add welcome message if messages container is empty
        const messagesContainer = dialog.querySelector('#chat-messages');
        if (messagesContainer && !messagesContainer.hasChildNodes()) {
          messagesContainer.innerHTML = `
            <div class="flex justify-start">
              <div class="max-w-[80%]">
                <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm">
                  Hello, how can I help you?
                </div>
              </div>
            </div>
          `;
        }
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
        // Add user message to UI
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
            userName: 'Widget User'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response from agent');
        }

        const data = await response.json();
        const reply = Array.isArray(data) && data.length > 0 ? data[0].text : 'No reply from agent.';

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
        messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-red-100 text-red-600 px-4 py-2 rounded-2xl rounded-tl-sm">
                Failed to get response from agent. Please try again.
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
  },

  closeWidget: function(dialog, button) {
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0)';
    setTimeout(() => {
      dialog.style.visibility = 'hidden';
    }, 200);
    
    button.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Chat with Agent</span>
      </div>
    `;
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

document.addEventListener('DOMContentLoaded', initializeWidget);