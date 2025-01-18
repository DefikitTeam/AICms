import React, { useRef, useState } from 'react';
import MultipleSelect from './MultipleSelect';
import { Button, TextArea } from '@radix-ui/themes';
import PostExample from './PostExample';
import MessageExample from './MessageExample';
import {
	FieldErrors,
	FieldValues,
	useFieldArray,
	UseFormRegister,
} from 'react-hook-form';
import FormFieldArray from './FormFieldArray';
import { Camera, Pencil, Trash2 } from 'lucide-react';

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

type ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> = {
	register: UseFormRegister<TFieldValues>;
	errors: FieldErrors<TFieldValues>;
	fieldArrays: Record<string, ReturnType<typeof useFieldArray>>;
};

const BasicInfo = ({ register, errors, fieldArrays }: ReactHookFormProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatar, setAvatar] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatar(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setAvatar(null);
	};

	return (
		<div className="mt-4 flex flex-col gap-4">
			<div className="col-span-1 flex items-center gap-4">
				{avatar ? (
					<div className="group relative w-fit">
						<img
							src={avatar}
							alt="Avatar"
							className="relative size-32 rounded-full cursor-pointer"
						/>
						<div className="group-hover:flex hidden gap-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700 rounded-sm p-1">
							<Button
								onClick={(e) => {
									e.preventDefault();
									fileInputRef.current?.click();
								}}
								color="gray"
								size="1"
							>
								<Pencil size={14} />
							</Button>
							<Button onClick={handleDeleteImage} color="gray" size="1">
								<Trash2 size={14} />
							</Button>
						</div>
					</div>
				) : (
					<div
						onClick={() => fileInputRef.current?.click()}
						className="size-32 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center"
					>
						<Camera color="#646464" size={20} />
					</div>
				)}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleImageChange}
				/>
				<div>
					<p>AI Agent</p>
					<p className="text-neutral-500">Profile Picture</p>
				</div>
			</div>

			{/* Basic Information */}
			<div className="form-control grid grid-cols-3 gap-4">
				<div className="col-span-1">
					<label className="label">
						<span className="label-text font-medium">AI Agent Name</span>
					</label>
					<input
						{...register('name', {
							required: 'This field is required',
						})}
						type="text"
						placeholder="Agent Name"
						className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
					/>
					<p>
						{errors.name && (
							<span className="text-red-500 text-xs">
								{errors.name?.message?.toString()}
							</span>
						)}
					</p>
				</div>
				<div className="col-span-1">
					<MultipleSelect
						name="clients"
						register={register}
						errors={errors}
					/>
				</div>
				<div className="col-span-1">
					<label className="label">
						<span className="label-text font-medium">
							Model provider to use
						</span>
					</label>
					<select
						{...register('modelProvider', {
							required: 'This field is required',
						})}
						className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option value="">Choose model AI</option>
						<option value="openAI">Open AI</option>
						<option value="gemini">Gemini</option>
						<option value="claude">Claude</option>
					</select>
					<p>
						{errors.modelProvider && (
							<span className="text-red-500 text-xs">
								{errors.modelProvider?.message?.toString()}
							</span>
						)}
					</p>
				</div>
			</div>

			{/* Bio and Lore */}
			<div className="form-control flex gap-4">
				<div className="w-full">
					<label className="label">
						<span className="label-text font-medium">
							AI Agent Biography
						</span>
					</label>
					<TextArea
						size="3"
						placeholder="Agent bio"
						{...register('bio', {
							required: 'This field is required',
						})}
					/>
					{errors.bio && (
						<span className="text-red-500 text-xs">
							{errors.bio?.message?.toString()}
						</span>
					)}
				</div>
				<div className="w-full">
					<label className="label">
						<span className="label-text font-medium">
							Agent background lore
						</span>
					</label>
					<TextArea
						size="3"
						placeholder="Agent lore"
						{...register('lore', {
							required: 'This field is required',
						})}
					/>
					{errors.lore && (
						<span className="text-red-500 text-xs">
							{errors.lore?.message?.toString()}
						</span>
					)}
				</div>
			</div>

			{/* Dynamic Field Arrays */}
			<div className="form-control flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-600 p-2 rounded-lg">
				<div className="grid grid-cols-3 gap-4">
					{fieldConfigs.slice(0, 3).map(({ name, label, placeholder }) => (
						<div className="col-span-1" key={name}>
							<FormFieldArray
								label={label}
								name={name}
								placeholder={placeholder}
								fields={fieldArrays[name].fields}
								append={fieldArrays[name].append}
								remove={fieldArrays[name].remove}
								register={register}
								errors={errors}
							/>
						</div>
					))}
				</div>

				<div className="grid grid-cols-3 gap-4">
					{fieldConfigs.slice(3, 6).map(({ name, label, placeholder }) => (
						<div className="col-span-1" key={name}>
							<FormFieldArray
								label={label}
								name={name}
								placeholder={placeholder}
								fields={fieldArrays[name].fields}
								append={fieldArrays[name].append}
								remove={fieldArrays[name].remove}
								register={register}
								errors={errors}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Examples */}
			<MessageExample
				name="messageExample"
				fields={fieldArrays.messageExample.fields}
				append={fieldArrays.messageExample.append}
				remove={fieldArrays.messageExample.remove}
				register={register}
				errors={errors}
			/>
			<PostExample
				label="Post Example"
				name="postExample"
				fields={fieldArrays.postExample.fields}
				append={fieldArrays.postExample.append}
				remove={fieldArrays.postExample.remove}
				register={register}
				errors={errors}
			/>
		</div>
	);
};

export default BasicInfo;
