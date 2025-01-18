'use client';
import { Box, Button, Tabs, TextArea } from '@radix-ui/themes';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import FormFieldArray from './_components/FormFieldArray';
import MessageExample from './_components/MessageExample';
import PostExample from './_components/PostExample';
import MultipleSelect from './_components/MultipleSelect';
import BasicInfo from './_components/BasicInfo';
import AdvanceSetting from './_components/AdvanceSetting';

const fieldConfigs = [
	{
		name: 'topic',
		label: 'Topics',
		placeholder: 'Blockchain, Cryptocurrency, NFTs',
	},
	{
		name: 'knowledge',
		label: 'Knowledge',
		placeholder: 'DeFi, Staking, Decentralized',
	},
	{
		name: 'adjective',
		label: 'Adjective',
		placeholder: 'Innovative, Creative, Unique',
	},
	{
		name: 'styleAll',
		label: 'Style for All',
		placeholder: 'Friendly, Professional, Engaging',
	},
	{
		name: 'styleChat',
		label: 'Chat Style',
		placeholder: 'Helpful, Knowledgeable, Supportive',
	},
	{
		name: 'stylePost',
		label: 'Post Style',
		placeholder: 'Informative, Engaging, Fun',
	},
	{
		name: 'postExample',
		label: 'Post Example',
		placeholder: 'Example post content',
	},
	{
		name: 'messageExample',
		label: 'Message Example',
		placeholder: 'Example message content',
	},
];

type FormValues = {
	name: string;
	clients: string;
	modelProvider: string;
	bio: string;
	lore: string;
	avatar: string | null;
	[Key: string]: any;
};

const page = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			clients: '',
			modelProvider: '',
			bio: '',
			lore: '',
			avatar: null,
			messageExample: [
				{
					user: '',
					agent: '',
				},
			],
		},
	});

	const fieldArrays = fieldConfigs.reduce(
		(acc, field) => {
			acc[field.name] = useFieldArray({
				control,
				name: field.name,
			});
			return acc;
		},
		{} as Record<string, ReturnType<typeof useFieldArray>>
	);

	const onSubmit = (data: FieldValues) => {
		console.log(data);
	};

	// const fileInputRef = useRef<HTMLInputElement>(null);
	// const [avatar, setAvatar] = useState<string | null>(null);

	// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const file = e.target.files?.[0];
	// 	if (file) {
	// 		const reader = new FileReader();
	// 		reader.onloadend = () => {
	// 			setAvatar(reader.result as string);
	// 		};
	// 		reader.readAsDataURL(file);
	// 	}
	// };

	// const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
	// 	e.preventDefault();
	// 	setAvatar(null);
	// };

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
					<Button className="w-full" type="submit" color="orange" size="2">
						Create AI Agent
					</Button>
				</div>
			</form>
		</div>
	);
};

export default page;
