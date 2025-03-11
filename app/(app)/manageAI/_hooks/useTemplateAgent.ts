import axios from "axios";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface DataBodyExportTemplate {
  agentId: string;
  isExportData: number;
}

const useTemplateAgent = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const redirectInProgress = useRef(false);
  
  // Function to get JWT token from localStorage and check if it's valid
  const getAccessToken = () => {
    const token = localStorage.getItem('jwt_access_token');
    const expirationTime = localStorage.getItem('jwt_expiration_time');
    
    // If we have both token and expiration time
    if (token && expirationTime) {
      // Check if token is expired
      if (parseInt(expirationTime) > Date.now()) {
        return token; // Token is still valid
      } else {
        // Token expired, clear it and redirect to login
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_expiration_time');
        
        // Prevent multiple redirects
        if (!redirectInProgress.current) {
          redirectInProgress.current = true;
          
          // Redirect to home page for login
          setTimeout(() => {
            router.push('/');
            // Reset after a delay to allow for future redirects if needed
            setTimeout(() => {
              redirectInProgress.current = false;
            }, 3000);
          }, 0);
        }
        
        return null;
      }
    }
    
    // If we only have token without expiration (backward compatibility)
    return token;
  };

  const getListTemplate = async () => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
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
      
      // Handle 401 Unauthorized (expired token)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_expiration_time');
        
        // Prevent multiple redirects
        if (!redirectInProgress.current) {
          redirectInProgress.current = true;
          setTimeout(() => {
            router.push('/');
            // Reset after a delay
            setTimeout(() => {
              redirectInProgress.current = false;
            }, 3000);
          }, 0);
        }
      }
      
      return { success: false, error };
    }
  };

  const exportTemplateAgent = async (data: DataBodyExportTemplate) => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
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
      
      // Handle 401 Unauthorized (expired token)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_expiration_time');
        
        // Prevent multiple redirects
        if (!redirectInProgress.current) {
          redirectInProgress.current = true;
          setTimeout(() => {
            router.push('/');
            // Reset after a delay
            setTimeout(() => {
              redirectInProgress.current = false;
            }, 3000);
          }, 0);
        }
      }
      
      return { success: false, error };
    }
  };

  const getTemplateAgent = async (agentId: string) => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
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
      
      // Handle 401 Unauthorized (expired token)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_expiration_time');
        
        // Prevent multiple redirects
        if (!redirectInProgress.current) {
          redirectInProgress.current = true;
          setTimeout(() => {
            router.push('/');
            // Reset after a delay
            setTimeout(() => {
              redirectInProgress.current = false;
            }, 3000);
          }, 0);
        }
      }
      
      return { success: false, error };
    }
  };

  return {
    getListTemplate,
    exportTemplateAgent,
    getTemplateAgent,
  };
};

export default useTemplateAgent;
