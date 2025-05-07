'use client';

import { AgentList } from "@defikitdotnet/miniapps-module/frontend";
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export default function PublicAgent() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const setToken = async () => {
      const token = await getAccessToken();
      setAccessToken(token);
    };
    setToken();
  }, [ready, authenticated]);




  if (!ready || !authenticated || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AgentList
      accessToken={accessToken}
      authenticated={authenticated}
      ready={ready}
    />
  );
  
}
