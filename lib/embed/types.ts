export type DisplayMode = 'modal' | 'integrated' | 'widget';

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface AgentConfig {
  id: string;
  name: string;
  serverUrl?: string;
  displayMode: DisplayMode;
  theme?: 'light' | 'dark';
  triggerSelector?: string; // For modal mode
  targetId?: string; // For integrated mode
  position?: WidgetPosition; // For widget mode
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface ChatWidgetProps {
  agentId: string;
  serverUrl?: string;
  theme?: 'light' | 'dark';
  displayMode: DisplayMode;
  triggerSelector?: string;
  targetId?: string;
  position?: string;
}

export interface ILoginRequest {
  wallet: {
    address: string;
    message: string;
    signature: string;
  }
}