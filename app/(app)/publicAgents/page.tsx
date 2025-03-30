'use client';

import { AgentList } from "@defikitdotnet/public-agent-module/frontend";
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export default function PublicAgent() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const NEXT_PUBLIC_WIDGET_SERVICE_URL= process.env.NEXT_PUBLIC_WIDGET_SERVICE_URL

  useEffect(() => {
    const setToken = async () => {
      const token = await getAccessToken();
      setAccessToken(token);
    };
    setToken();
  }, [ready, authenticated]);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${NEXT_PUBLIC_WIDGET_SERVICE_URL}/widget.js"]`);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `${NEXT_PUBLIC_WIDGET_SERVICE_URL}/widget.js`;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        console.log("Script loaded successfully");
      };
      script.onerror = () => {
        setScriptError("Failed to load the widget script. Please try again later.");
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${NEXT_PUBLIC_WIDGET_SERVICE_URL}/styling.css`;
    document.head.appendChild(link);
  }, []);

  if (!ready || !authenticated || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {scriptError ? (
        <div className="flex items-center justify-center min-h-screen text-red-500">
          {scriptError}
        </div>
      ) : scriptLoaded ? (
        <AgentList accessToken={accessToken} authenticated={authenticated} ready={ready} />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <span>Loading widget...</span>
        </div>
      )}
    </>
  );
}
