import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { AgentSubmitForm } from "../interfaces/agent";

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

  const createAgent = async (agent: AgentSubmitForm) => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.post(`${BACKEND_URL}/agents/create`, agent, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getAgent = async (agentId: string) => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.get(`${BACKEND_URL}/agents/${agentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateAgent = async (agent: AgentSubmitForm, agentId: string) => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/agents/${agentId}update`,
        agent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAgent = async (agentId: string) => {
    const accessToken = await getAccessToken();
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  return { getAgents, createAgent, getAgent, toggleAgent, updateAgent };
};

export default useAgent;
