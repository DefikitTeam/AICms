interface Window {
  AIChatWidget: {
    init: (config: AgentConfig) => void;
  };
  AIModalChat: {
    init: (config: AgentConfig) => void;
  };
  AIIntegratedChat: {
    init: (config: AgentConfig) => void;
  };
}