import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { CreateAgentData, UpdateAgentData } from "../interfaces/agent";
import { useCallback } from "react";

const useAgent = () => {
  const { getAccessToken } = usePrivy();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getAgents = async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.get(`${BACKEND_URL}/agents`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getDetailAgent = useCallback(async (id: string) => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.get(`${BACKEND_URL}/agents/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, [BACKEND_URL, getAccessToken]);

  const createAgent = async (agent: CreateAgentData) => {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${BACKEND_URL}/agents/create`, agent, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const updateAgent = async (id: string, agent: UpdateAgentData) => {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${BACKEND_URL}/agents/${id}/set`,
      agent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  };

  const toggleAgent = async (agentId: string) => {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${BACKEND_URL}/agents/toggle`,
      {
        agentId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  };

  return { getAgents, createAgent, getDetailAgent, updateAgent, toggleAgent };
};

export default useAgent;
