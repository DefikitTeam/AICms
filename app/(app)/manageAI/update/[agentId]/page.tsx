'use client';
import { Box, Spinner, Tabs } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAgent from '../../_hooks/useAgent';
import { formFields } from '../../create/data/utils';
import BasicInfo from '../../create/_components/BasicInfo';
import AdvanceSetting from '../../create/_components/AdvanceSetting';
import { useParams } from 'next/navigation';

const UpdateAgent = () => {
	const [agent, setAgent] = React.useState<any>(null);
	const { getDetailAgent } = useAgent();
	const { agentId } = useParams();
	const [loading, setLoading] = React.useState<boolean>(true);
	const [loadingUpdate, setLoadingUpdate] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FieldValues>();

	useEffect(() => {
		const fetchAgent = async () => {
			try {
				setLoading(true);
				const response = await getDetailAgent(agentId as string);
				const { character } = response;
				setAgent(response);
				console.log(character);

				const fieldsToSet = [
					'name',
					'adjectives',
					'knowledge',
					'topics',
					'system',
					'clients',
					'modelProvider',
					'bio',
					'lore',
					'postExamples',
				];

				fieldsToSet.forEach((field) => setValue(field, character[field]));

				['all', 'chat', 'post'].forEach((style) =>
					setValue(style, character.style[style])
				);

				for (const [key, value] of Object.entries(
					character.settings.secrets
				)) {
					setValue(`secrets.${key}`, value);
				}

				character.messageExamples.forEach((message: any) => {
					fieldArrays.messageExamples.append({
						user: message[0].content.text,
						agent: message[1].content.text,
					});
				});
			} catch (error) {
				console.error('Failed to fetch agent details', error);
				toast.error('Failed to fetch agent details');
			} finally {
				setLoading(false);
			}
		};
		fetchAgent();
	}, []);

	const { updateAgent, toggleAgent } = useAgent();

	const fieldArrays = formFields.reduce(
		(acc, field) => {
			acc[field.name] = useFieldArray({
				control,
				name: field.name,
			});
			return acc;
		},
		{} as Record<string, ReturnType<typeof useFieldArray>>
	);

	const toggleAgentStatus = async () => {
		try {
			setLoadingUpdate(true);
			const response = await toggleAgent(agentId as string);
			if (response.success) {
				setAgent((prev: any) => ({ ...prev, isRunning: !prev.isRunning }));
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to toggle AI Agent status');
		} finally {
			setLoadingUpdate(false);
		}
	};

	const onSubmit = async (data: FieldValues) => {
		const message = toast.loading('Updating AI Agent...');
		const dataSubmit = {
			name: data.name as string,
			plugins: [] as string[],
			adjectives: data.adjectives as string[],
			people: [] as string[],
			topics: data.topics as string[],
			style: {
				all: data.all as string[],
				chat: data.chat as string[],
				post: data.post as string[],
			},
			system: data.system as string,
			knowkedge: data.knowledge as string[],
			clients: data.clients as string[],
			modelProvider: data.modelProvider as string,
			bio: data.bio as string[],
			lore: data.lore as string[],
			postExamples: data.postExamples as string[],
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
		};
		try {
			const response = await updateAgent(agentId as string, dataSubmit);
			toast.dismiss(message);
			if (response.success) {
				toast.success('AI Agent updated successfully');
			}
		} catch (error) {
			toast.error('Failed to update AI Agent', {
				id: message,
			});
			console.error(error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full w-full">
				<Spinner size="3" />
			</div>
		);
	}

	return (
		<div className="flex flex-col overflow-hidden">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Tabs.Root defaultValue="basic">
					<div className="relative">
						<Tabs.List>
							<Tabs.Trigger value="basic">Basic info</Tabs.Trigger>
							<Tabs.Trigger value="advance">
								Advance setting
							</Tabs.Trigger>
						</Tabs.List>
						<button
							disabled={loadingUpdate}
							type="button"
							onClick={toggleAgentStatus}
							className={`absolute top-0 right-0 ${!agent?.isRunning ? 'bg-red-600' : 'bg-green-600'} text-white rounded-md py-1 px-2 flex items-center gap-1`}
						>
							{loadingUpdate && <Spinner size="1" />}
							{agent?.isRunning ? 'Running' : 'Stopped'}
						</button>
					</div>

					<Box pt="3">
						<Tabs.Content value="basic">
							<BasicInfo
								getValues={getValues}
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
						Update AI Agent
					</button>
				</div>
			</form>
		</div>
	);
};

export default UpdateAgent;
