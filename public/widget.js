window.AIChatWidget = {
  config: {},
  init: function(config) {
    this.config = config;
    
    // Store auth token in localStorage for persistence
    if (config.authToken) {
      localStorage.setItem('ai-chat-widget-token', config.authToken);
    }
    
    // Create container and set theme
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'ai-chat-widget-container';
    widgetContainer.setAttribute('data-theme', config.theme || 'light');
    
    // Load styles
    if (!document.querySelector('link[href$="/styling.css"]')) {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = `${this.config.widgetUrl}/styling.css`;
      document.head.appendChild(styleLink);
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
      <div class="h-[600px] flex flex-col bg-white dark:bg-neutral-800">
        <div class="border-b p-4 flex justify-between items-center dark:border-neutral-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          <button class="close-button text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-100">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages"></div>
        <div class="border-t p-4 dark:border-neutral-700 dark:bg-neutral-700">
          <form class="flex gap-2" id="chat-form">
            <input 
              name="message" 
              class="flex-1 rounded-md border border-neutral-700 p-2 text-sm focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder-gray-400" 
              placeholder="Type a message..."
            />
            <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium">
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
      const message = input?.value.trim();
      
      if (!message) return;
      input.value = '';

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

      try {
        // Use the existing sendMessage method that handles auth correctly
        const token = this.getStoredToken();
        const response = await fetch(`${this.config.serverUrl}/${this.config.agentId}/message`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Add auth token here
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

        messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm">
                ${reply}
              </div>
            </div>
          </div>
        `;

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