/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { Input } from "./_components/ui/input";
import { Label } from "./_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DisplayMode } from '@/lib/embed/types';
import { useSearchParams } from 'next/navigation';

// Helper function to extract agent ID from CMS URL
function extractAgentId(url: string): string {
  try {
    const matches = url.match(/\/manageAI\/update\/([^\/]+)$/);
    return matches?.[1] || '';
  } catch {
    return '';
  }
}

interface DashboardConfig {
  agentId: string;
  serverUrl: string;
  widgetUrl: string;
  theme: 'light' | 'dark';
  displayMode: DisplayMode;
  triggerSelector?: string;
  targetId?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const CodeSnippet = ({ 
  agentId, 
  position = 'bottom-right',
  widgetUrl
}: { 
  agentId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  widgetUrl?: string;
}) => {
  const code = `
    <!-- Add this to your <head> -->
    <link rel="stylesheet" href="${process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL}/styling.css" />
    <script src="${process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL}/widget.js"></script>

    <!-- Add this to your </body> -->
    <script
      dangerouslySetInnerHTML={{
        __html: \`AIChatWidget.init({
          agentId: '${agentId}',
          serverUrl: '${process.env.NEXT_PUBLIC_BACKEND_URL}',
          widgetUrl: '${widgetUrl || process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL}',
          position: '${position}'
        });\`
      }}
    />
  `;
  
  return (
    <div className="w-full max-w-full overflow-hidden">
      <pre className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg text-[0.6rem] sm:text-sm w-full max-w-full overflow-x-auto">
        <code className="whitespace-pre-wrap break-all overflow-wrap-anywhere w-full block">{code}</code>
      </pre>
    </div>
  );
};

// Separate the config part that uses useSearchParams
function ConfigContent() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<DashboardConfig>({
    agentId: searchParams.get('agentId') || '',
    serverUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://aiapi-internal.defikit.net',
    widgetUrl: process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL || 'http://localhost:3000',
    theme: 'light',
    displayMode: 'widget',
    position: 'bottom-right'
  });

  const [agentUrl, setAgentUrl] = useState('');

  const handleAgentUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAgentUrl(url);
    const agentId = extractAgentId(url);
    if (agentId) {
      setConfig(prev => ({
        ...prev,
        agentId
      }));
    }
  };

  const [isConfigured, setIsConfigured] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigured(true);
  };

  useEffect(() => {
    if (isConfigured) {
      // Remove any existing instances
      const existingContainer = document.getElementById('ai-chat-widget-container');
      const existingModal = document.querySelector('.ai-chat-modal-wrapper');
      const existingIntegrated = document.getElementById('preview-area')?.firstChild;
      
      existingContainer?.remove();
      existingModal?.remove();
      if (existingIntegrated) {
        document.getElementById('preview-area')!.innerHTML = '';
      }

      // Add the appropriate script based on display mode
      const script = document.createElement('script');
      script.src = `${config.widgetUrl}/${config.displayMode}.js`;
      script.onload = () => {
        switch (config.displayMode) {
          case 'widget':
            window.AIChatWidget?.init(config);
            break;
          case 'modal':
            window.AIModalChat?.init(config);
            break;
          case 'integrated':
            window.AIIntegratedChat?.init({
              ...config,
              targetId: 'preview-area'
            });
            break;
        }
      };
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [isConfigured, config]);

  // Add theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : 'light'
  );

  // Update theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update theme handler
  const handleThemeChange = (value: 'light' | 'dark') => {
    setTheme(value);
    setConfig(prev => ({
      ...prev,
      theme: value
    }));
    document.documentElement.setAttribute('data-theme', value);
  };

  // Get auth token when component mounts and user is authenticated
  const { authenticated, getAccessToken } = usePrivy();
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      if (authenticated) {
        try {
          const token = await getAccessToken();
          if (token) {
            setAuthToken(token);
          }
        } catch (error) {
          console.error('Failed to get auth token:', error);
        }
      }
    };

    fetchToken();
  }, [authenticated, getAccessToken]);

  // Add cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Clean up widget on unmount
      const existingContainer = document.getElementById('ai-chat-widget-container');
      const existingModal = document.querySelector('.ai-chat-modal-wrapper');
      const existingIntegrated = document.getElementById('preview-area')?.firstChild;
      
      existingContainer?.remove();
      existingModal?.remove();
      if (existingIntegrated) {
        document.getElementById('preview-area')!.innerHTML = '';
      }

      // Remove widget scripts
      const widgetScripts = document.querySelectorAll(`script[src*="${config.widgetUrl}"]`);
      widgetScripts.forEach(script => script.remove());

      // Remove widget styles
      const widgetStyles = document.querySelectorAll(`link[href*="${config.widgetUrl}"]`);
      widgetStyles.forEach(style => style.remove());
    };
  }, []); // Empty dependency array to run only on unmount

  return (
    <div className="grid gap-8">
      {/* Form container - Apply consistent padding */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agentUrl" className="text-black dark:text-white">Agent ID</Label>
            <Input
              id="agentId"
              value={config.agentId}
              disabled
              className="bg-gray-50 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
              required
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="displayMode" className="text-black dark:text-white">Display Mode</Label>
            <Select<DisplayMode>
              id="displayMode"
              value={config.displayMode}
              onValueChange={(value) => setConfig(prev => ({
                ...prev,
                displayMode: value
              }))}
              className="dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
            >
              <option value="widget">Widget</option>
              <option value="modal">Modal</option>
              <option value="integrated">Integrated</option>
            </Select>
          </div>

          {config.displayMode === 'modal' && (
            <div className="space-y-2">
              <Label htmlFor="triggerSelector" className="text-black dark:text-white">
                Trigger Element Selector
              </Label>
              <Input
                id="triggerSelector"
                value={config.triggerSelector}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  triggerSelector: e.target.value
                }))}
                placeholder=".chat-button, #openChat"
                className="dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:placeholder-neutral-400"
                required
              />
            </div>
          )}

          {config.displayMode === 'integrated' && (
            <div className="space-y-2">
              <Label htmlFor="targetId">Target Container ID</Label>
              <Input
                id="targetId"
                value={config.targetId}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  targetId: e.target.value
                }))}
                placeholder="chat-container"
                required
              />
            </div>
          )} */}

          {config.displayMode === 'widget' && (
            <div className="space-y-2">
              <Label htmlFor="widget-position" className="text-black dark:text-white">Widget Position</Label>
              <Select
                value={config.position}
                onValueChange={(value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => 
                  setConfig(prev => ({
                    ...prev,
                    position: value
                  }))
                }
              >
                <SelectTrigger id="widget-position" className="dark:bg-neutral-700 dark:text-white dark:border-neutral-600">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                  position="popper"
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="top-left">Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full">Save Configuration</Button>
        </form>
      </div>

      {/* Preview and Integration Code - Make sure to use the same padding as the form container */}
      {isConfigured && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">Preview</h2>
            <div className="relative border dark:border-neutral-600 rounded-lg p-2 sm:p-4 text-xs sm:text-base">
              {config.displayMode === 'widget' && (
                <p className="text-black dark:text-white">Look at the right bottom corner of the screen</p>
              )}
              {config.displayMode === 'modal' && (
                <div>
                  <button className="chat-button px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    Open Chat Modal
                  </button>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Click the button above to test the modal chat
                  </p>
                </div>
              )}
              {config.displayMode === 'integrated' && (
                <div id="preview-area" className="h-[500px]" />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white w-full">Integration Code</h2>
            {authenticated ? (
              <div className="w-full max-w-full overflow-hidden">
                <CodeSnippet
                  agentId={config.agentId}
                  position={config.position}
                  widgetUrl={config.widgetUrl}
                />
              </div>
            ) : (
              <div className="text-red-500 dark:text-red-400 text-xs sm:text-base">
                Please login to get your authentication token
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl text-center font-bold mb-8 text-black dark:text-white">
          Agent Widget Configuration
        </h1>

        <Suspense 
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            </div>
          }
        >
          <ConfigContent />
        </Suspense>
      </div>
    </div>
  );
}
