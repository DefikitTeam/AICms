import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";

interface DataBodyExportTemplate {
  agentId: string;
  isExportData: number;
}

const useTemplateAgent = () => {
  const { getAccessToken } = usePrivy();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getListTemplate = async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/agents/get-list-template-data`,
        {},
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

  const exportTemplateAgent = async (data: DataBodyExportTemplate) => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/agents/export-template-data`,
        {
          agentId: data.agentId,
          isExportData: data.isExportData,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTemplateAgent = async (agentId: string) => {
    const accessToken = await getAccessToken();
    try {
      const response = await axios.get(
        `${BACKEND_URL}/agents/${agentId}/get-template-data`,
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

  return {
    getListTemplate,
    exportTemplateAgent,
    getTemplateAgent,
  };
};

export default useTemplateAgent;
