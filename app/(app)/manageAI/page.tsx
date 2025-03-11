"use client";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@radix-ui/themes";
import CardAgent from "./_components/CardAgent";
import Link from "next/link";
import useAgent from "./_hooks/useAgent";
import NotLoggedInAlert from "../_components/not-logged-in-alert";

interface AgentResponse {
  id: string;
  name: string;
  username: string;
  status: string;
  type: string;
  isRunning: boolean;
  character?: {
    name: string;
    plugins: any[];
    adjectives: string[];
    people: string[];
    topics: string[];
    style: {
      all: string[];
      chat: string[];
      post: string[];
    };
    system: string;
    knowledge: string[];
    clients: string[];
    modelProvider: string;
    bio: string[];
    lore: string[];
    postExamples: string[];
  };
  email: string | null;
  runtime?: {
    clients: string[];
  };
}

const ManageAI = () => {
  const { getAgents } = useAgent();
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  console.log(agents);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
  }

  // Helper function to get and merge clients from different sources
  const getClientsFromAgent = (agent: AgentResponse): string[] => {
    const characterClients = agent.character?.clients || [];
    const runtimeClients = agent.runtime?.clients || [];
    
    // Merge both sources and remove duplicates
    return [...new Set([...characterClients, ...runtimeClients])];
  };

  // Helper function to extract first bio item as string
  const getBioFromAgent = (agent: AgentResponse): string => {
    const bioArray = agent.character?.bio || [];
    return bioArray.length > 0 ? bioArray[0] : '';
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <p className="text-3xl font-medium text-brand-600 text-center">
          Your Agents
        </p>
        <p className="text-center text-lg text-neutral-500 dark:text-neutral-400 mt-2">
          Keep tabs on your agents&apos; status and stay ahead on operations to
          keep them running strong!
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/manageAI/create">
            <Button
              color="gray"
              variant="solid"
              highContrast
              radius="large"
              size="4"
              style={{ cursor: "pointer" }}
            >
              Create New Agent
            </Button>
          </Link>
          <Link href="/manageAI/template">
            <Button
              color="orange"
              variant="soft"
              radius="large"
              size="4"
              style={{ cursor: "pointer" }}
            >
              Templates
            </Button>
          </Link>
        </div>
        <div className="mt-6 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
          {agents.map((agent, index) => (
            <CardAgent
              id={agent.id}
              key={index}
              name={agent.name}
              clients={getClientsFromAgent(agent)}
              bio={getBioFromAgent(agent)}
              modelProvider={agent.character?.modelProvider || ''}
              status={agent.isRunning}
            />
          ))}
        </div>
      </div>
      <NotLoggedInAlert />
    </>
  );
};

export default ManageAI;
