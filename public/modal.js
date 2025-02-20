window.AIModalChat = {
  config: {},
  init: function(config) {
    this.config = config;

    // Store auth token in localStorage
    if (config.authToken) {
      localStorage.setItem('ai-chat-widget-token', config.authToken);
    }

    // Load styles if not already loaded
    if (!document.querySelector('link[href$="/styling.css"]')) {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = `${this.config.widgetUrl}/styling.css`;
      document.head.appendChild(styleLink);
    }

    // Create modal wrapper
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'ai-chat-modal-wrapper hidden';
    modalWrapper.style.zIndex = '9999';

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'ai-chat-modal';
    
    // Modal content - remove fixed height and use flex system
    modal.innerHTML = `
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
            <button 
              type="submit" 
              class="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10"
            >
              <span class="send-icon">
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
              </span>
              <span class="loading-spinner hidden">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    `;

    modalWrapper.appendChild(modal);
    document.body.appendChild(modalWrapper);

    // Add trigger click handlers
    const triggers = document.querySelectorAll(config.triggerSelector || '.chat-button');
    if (!triggers.length) {
      console.warn(`No elements found matching selector "${config.triggerSelector}"`);
    }
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        modalWrapper.classList.remove('hidden');
      });
    });

    // Handle close button
    const closeButton = modal.querySelector('.modal-close-button');
    closeButton.addEventListener('click', () => {
      modalWrapper.classList.add('hidden');
    });

    // Handle click outside
    modalWrapper.addEventListener('click', (e) => {
      if (e.target === modalWrapper) {
        modalWrapper.classList.add('hidden');
      }
    });

    // Handle chat form submission
    const form = modal.querySelector('#chat-form'); // Changed from #modal-chat-form to #chat-form
    const messagesContainer = modal.querySelector('#chat-messages'); // Changed from #modal-messages to #chat-messages

    form?.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent form submission
      const input = form.querySelector('input');
      const submitButton = form.querySelector('button[type="submit"]');
      const spinner = submitButton.querySelector('.loading-spinner');
      const sendIcon = submitButton.querySelector('.send-icon');
      const message = input?.value.trim();
      
      if (!message) return;

      // Disable input and button, show loading state
      input.disabled = true;
      submitButton.disabled = true;
      spinner.classList.remove('hidden');
      sendIcon.classList.add('hidden');

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

        const token = localStorage.getItem('ai-chat-widget-token');
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
          throw new Error('Failed to get response from agent');
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
            bubbleContent.style.minHeight = 'unset';
          }, 200);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        // Re-enable input and button, restore button state
        input.disabled = false;
        submitButton.disabled = false;
        spinner.classList.add('hidden');
        sendIcon.classList.remove('hidden');
        input.focus();
      }
    });

    // Handle escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalWrapper.classList.contains('hidden')) {
        modalWrapper.classList.add('hidden');
      }
    });
  }
};