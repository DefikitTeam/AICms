import React from 'react';
import { Button, Grid } from '@radix-ui/themes';
import CardAgent from './_components/CardAgent';
import Link from 'next/link';
import NotLoggedInAlert from '../chat/_components/not-logged-in-alert';

const page = () => {
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
				<Grid columns="3" gap="5" width="100%" className="mt-6">
					<CardAgent />
					<CardAgent />
					<CardAgent />
				</Grid>
			</div>
			<NotLoggedInAlert />
		</>
	);
};

export default page;
