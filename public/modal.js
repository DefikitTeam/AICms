window.AIModalChat = {
  init: function(config) {
    this.config = config;

    // // Set theme on container
    // const container = document.createElement('div');
    // container.setAttribute('data-theme', config.theme);

    // Load styles if not already loaded
    if (!document.querySelector('link[href$="/styling.css"]')) {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = `${this.config.serverUrl}/styling.css`;
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
      <div class="flex flex-col">
        <div class="border-b p-4 flex justify-between items-center flex-shrink-0">
          <h3 class="text-xl font-semibold">AI Assistant</h3>
          <button class="modal-close-button text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4" id="modal-messages"></div>
        <div class="border-t p-4 flex-shrink-0">
          <form class="flex gap-2" id="modal-chat-form">
            <input 
              name="message" 
              class="flex-1 rounded-md border border-gray-300 p-2 text-sm focus:outline-none" 
              placeholder="Type a message..."
            />
            <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium">
              Send
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
    const form = modal.querySelector('#modal-chat-form');
    const messagesContainer = modal.querySelector('#modal-messages');
    
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const message = input?.value.trim();
      
      if (!message) return;
      input.value = '';

      // Add user message
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
        const response = await fetch(`${config.serverUrl}/api/agent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            agentId: config.agentId, 
            text: message 
          }),
        });

        const data = await response.json();
        const reply = Array.isArray(data) && data.length > 0 ? data[0].text : 'No reply from agent.';

        // Add agent response
        messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-sm">
                ${reply}
              </div>
            </div>
          </div>
        `;

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } catch (error) {
        console.error('Error sending message:', error);
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