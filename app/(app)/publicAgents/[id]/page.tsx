"use client";
import { AgentDetail } from "@defikitdotnet/public-agent-module/frontend";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    getToken(getAccessToken).then(setAccessToken);
  }, [getAccessToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <AgentDetail agentId={id} accessToken={accessToken || ""} />
      </div>
    </div>
  );
}
