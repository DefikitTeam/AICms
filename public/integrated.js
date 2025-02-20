window.AIIntegratedChat = {
  config: {},
  init: function(config) {
    this.config = config;
    
    // Store auth token in localStorage
    if (config.authToken) {
      localStorage.setItem('ai-chat-widget-token', config.authToken);
    }

    const targetElement = document.getElementById(config.targetId);
    if (!targetElement) {
      console.error(`Target element with ID "${config.targetId}" not found`);
      return;
    }

    targetElement.className = 'ai-chat-integrated rounded-lg border shadow-sm';
    targetElement.innerHTML = `
      <div class="h-[500px] flex flex-col bg-white">
        <div class="border-b p-4">
          <h3 class="text-xl font-semibold">AI Assistant</h3>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4" id="integrated-messages"></div>
        <div class="border-t p-4">
          <form class="flex gap-2" id="integrated-chat-form">
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

    // Add event listeners
    const form = targetElement.querySelector('#integrated-chat-form');
    const messagesContainer = targetElement.querySelector('#integrated-messages');
    
    form?.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent form submission
      const input = form.querySelector('input');
      const message = input?.value.trim();
      
      if (!message) return;

      // Clear input immediately
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
  }
};