import axios from "axios";
import { CreateAgentData, UpdateAgentData } from "../interfaces/agent";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const useAgent = () => {
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

  const getAgents = async () => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
    try {
      const response = await axios.get(`${BACKEND_URL}/agents`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
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

  const getDetailAgent = useCallback(async (id: string) => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
    try {
      const response = await axios.get(`${BACKEND_URL}/agents/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
  }, [BACKEND_URL, router, redirectInProgress]);

  const createAgent = async (agent: CreateAgentData) => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
    try {
      const response = await axios.post(`${BACKEND_URL}/agents/create`, agent, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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

  const updateAgent = async (id: string, agent: UpdateAgentData) => {
    const accessToken = getAccessToken();
    
    // If token is invalid or expired, return early
    if (!accessToken) {
      return { success: false, message: 'Authentication expired' };
    }
    
    try {
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

  const toggleAgent = async (agentId: string) => {
    const accessToken = getAccessToken();
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
