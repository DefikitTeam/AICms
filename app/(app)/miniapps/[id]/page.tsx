"use client";
import { AgentDetail } from "@defikitdotnet/miniapps-module/frontend";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Maximize2, Minimize2 } from "lucide-react";

const getToken = async (getAccessToken: () => Promise<string | null>) => {
  try {
    const token = await getAccessToken();
    return token || "";
  } catch (error) {
    console.error("error:", error);
    return "";
  }
};

export default function PublicAgentDetail() {
  const { getAccessToken } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    getToken(getAccessToken).then(setAccessToken);
  }, [getAccessToken]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-3 right-3 z-50 p-2 rounded-md bg-white/80 hover:bg-white text-gray-800 shadow-sm transition-colors"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
      <AgentDetail agentId={id} accessToken={accessToken || ""} />
    </div>
  );
}