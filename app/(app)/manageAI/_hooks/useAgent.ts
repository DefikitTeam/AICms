import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import { AgentSubmitForm } from '../interfaces/agent';

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
			const response = await axios.post(
				`${BACKEND_URL}/agents/create`,
				agent,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	return { getAgents, createAgent };
};

export default useAgent;
