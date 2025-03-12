import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import toast from "react-hot-toast";

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
      return { templateAgents: [] }; // Return empty array on error for more resilient code
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
      throw error;
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
      throw error;
    }
  };

  const importTemplate = async (templateId: string, options?: {
    redirectToCreate?: boolean;
    setValue?: any;
  }) => {
    try {
      const message = toast.loading("Loading template...");
      const template = await getTemplateAgent(templateId);
      
      if (!template) {
        toast.error("Template not found", { id: message });
        return null;
      }

      // Apply template data to form fields if setValue is provided
      if (options?.setValue) {
        // Use a more efficient approach to update form values
        if (template.clients) {
          options.setValue('clients', template.clients);
        }
        
        const fieldsToSet = [
          'name', 'adjectives', 'knowledge', 'topics', 
          'system', 'modelProvider', 'bio', 'lore', 'postExamples'
        ];
        
        fieldsToSet.forEach(field => {
          if (template[field] !== undefined) {
            options.setValue(field, template[field]);
          }
        });
        
        // Handle any nested fields
        if (template.style) {
          ['all', 'chat', 'post'].forEach(style => {
            if (template.style[style]) {
              options.setValue(style, template.style[style]);
            }
          });
        }
        
        if (template.messageExamples) {
          options.setValue('messageExamples', template.messageExamples.map((message: any) => ({
            user: message[0]?.content?.text || '',
            agent: message[1]?.content?.text || '',
          })));
        }
        
        toast.success("Template applied successfully", { id: message });
        return template;
      }

      // Handle localStorage and redirection
      localStorage.setItem("agentTemplate", JSON.stringify(template));
      
      if (options?.redirectToCreate !== false) {
        window.location.href = "/manageAI/create";
        toast.success("Template loaded successfully", { id: message });
      } else {
        toast.success("Template applied successfully", { id: message });
      }
      
      return template;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load template");
      return null;
    }
  };

  return {
    getListTemplate,
    exportTemplateAgent,
    getTemplateAgent,
    importTemplate,
  };
};

export default useTemplateAgent;
