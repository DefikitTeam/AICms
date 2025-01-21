'use client';
import { Box, Tabs } from '@radix-ui/themes';
import React from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import BasicInfo from './_components/BasicInfo';
import AdvanceSetting from './_components/AdvanceSetting';
import toast from 'react-hot-toast';
import useAgent from '../_hooks/useAgent';

const fieldConfigs = [
	{
		name: 'topics',
		label: 'Topics',
		placeholder: 'Blockchain, Cryptocurrency, NFTs',
	},
	{
		name: 'knowledge',
		label: 'Knowledge',
		placeholder: 'DeFi, Staking, Decentralized',
	},
	{
		name: 'adjectives',
		label: 'Adjectives',
		placeholder: 'Innovative, Creative, Unique',
	},
	{
		name: 'all',
		label: 'Style for All',
		placeholder: 'Friendly, Professional, Engaging',
	},
	{
		name: 'chat',
		label: 'Chat Style',
		placeholder: 'Helpful, Knowledgeable, Supportive',
	},
	{
		name: 'post',
		label: 'Post Style',
		placeholder: 'Informative, Engaging, Fun',
	},
	{
		name: 'postExamples',
		label: 'Post Example',
		placeholder: 'Example post content',
	},
	{
		name: 'messageExamples',
		label: 'Message Examples',
		placeholder: 'Example message content',
	},
	{
		name: 'bio',
		label: 'Biography',
		placeholder: 'Short bio about the agent',
	},
	{
		name: 'lore',
		label: 'Agent background lore',
		placeholder: 'Agent lore',
	},
];

const CreateAgent = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			messageExamples: [
				{
					user: '',
					agent: '',
				},
			],
		},
	});

	const { createAgent } = useAgent();

	const fieldArrays: Record<string, ReturnType<typeof useFieldArray>> = {};

	fieldConfigs.forEach((field) => {
		fieldArrays[field.name] = useFieldArray({
			control,
			name: field.name,
		});
	});

	const onSubmit = async (data: FieldValues) => {
		const message = toast.loading('Creating AI Agent...');
		const dataSubmit = {
			config: {
				name: data.name as string,
				plugins: [] as string[],
				adjectives: [...data.adjectives] as string[],
				people: [] as string[],
				topics: [...data.topics] as string[],
				style: {
					all: [...data.all] as string[],
					chat: [...data.chat] as string[],
					post: [...data.post] as string[],
				},
				system: data.system as string,
				clients: [...data.clients] as string[],
				modelProvider: data.modelProvider as string,
				bio: data.bio as string[],
				lore: data.lore as string[],
				postExamples: [...data.postExamples] as string[],
				settings: {
					secrets: {
						...(data.secrets as Record<string, string>),
					},
					voice: {
						model: 'en_US-hfc_female-medium',
					},
					imageSettings: {
						steps: 10,
						width: 512,
						height: 512,
					},
				},
				messageExamples: data.messageExamples.map((message: any) => [
					{
						user: '{{user1}}',
						content: {
							text: message.user,
						},
					},
					{
						user: data.name as string,
						content: {
							text: message.agent,
						},
					},
				]),
			},
		};
		try {
			const response = await createAgent(dataSubmit);
			toast.dismiss(message);
			console.log(response);
			if (response.success) {
				toast.success('AI Agent created successfully');
			}
		} catch (error) {
			toast.error('Failed to create AI Agent', {
				id: message,
			});
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col overflow-hidden">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Tabs.Root defaultValue="basic">
					<Tabs.List>
						<Tabs.Trigger value="basic">Basic info</Tabs.Trigger>
						<Tabs.Trigger value="advance">Advance setting</Tabs.Trigger>
					</Tabs.List>

					<Box pt="3">
						<Tabs.Content value="basic">
							<BasicInfo
								register={register}
								errors={errors}
								fieldArrays={fieldArrays}
							/>
						</Tabs.Content>

						<Tabs.Content value="advance">
							<AdvanceSetting register={register} />
						</Tabs.Content>
					</Box>
				</Tabs.Root>
				<div className="flex justify-end mt-4">
					<button
						type="submit"
						className="w-full bg-orange-500 text-white rounded-md py-2"
					>
						Create AI Agent
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateAgent;
