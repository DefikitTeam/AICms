'use client';
import React, { useEffect, useState } from 'react';
import { Button, Spinner } from '@radix-ui/themes';
import CardAgent, { CardAgentType } from './_components/CardAgent';
import Link from 'next/link';
import NotLoggedInAlert from '../chat/_components/not-logged-in-alert';
import useAgent from './_hooks/useAgent';

const ManageAI = () => {
	const { getAgents } = useAgent();
	const [agents, setAgents] = useState<CardAgentType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchAgents = async () => {
			setLoading(true);
			const data = await getAgents();
			setAgents(data.agents);
			setLoading(false);
		};
		fetchAgents();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full w-full">
				<Spinner size="3" />
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col justify-center items-center">
				<p className="text-3xl font-medium text-brand-600 text-center">
					Your Agents
				</p>
				<p className="text-center text-lg text-neutral-500 dark:text-neutral-400 mt-2">
					Keep tabs on your agents’ status and stay ahead on operations to
					keep them running strong!
				</p>
				<Link href="/manageAI/create">
					<Button
						color="gray"
						variant="solid"
						highContrast
						radius="large"
						className="mt-6"
						size="4"
						style={{ marginTop: '20px', cursor: 'pointer' }}
					>
						Create New Agent
					</Button>
				</Link>
				<div className="mt-6 w-full grid grid-cols-1 gap-4 lg:grid-cols-3">
					{agents.map((agent, index) => (
						<CardAgent
							id={agent.id}
							key={index}
							name={agent.name}
							clients={agent.clients}
							bio={agent.bio}
							modelProvider={agent.modelProvider}
							isRunning={agent.isRunning}
							email={agent.email}
						/>
					))}
				</div>
			</div>
			<NotLoggedInAlert />
		</>
	);
};

export default ManageAI;
