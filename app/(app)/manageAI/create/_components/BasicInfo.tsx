import React, { useRef, useState, useEffect } from 'react';
import TextAreaField from './TextAreaField';
import MessageExample from './MessageExample';
import {
	FieldErrors,
	FieldValues,
	useFieldArray,
	UseFormGetValues,
	UseFormRegister,
} from 'react-hook-form';
import FormFieldArray from './FormFieldArray';
import { ChevronDown, ChevronUp } from 'lucide-react';
import modelProvider from '../data/modelProvider';
import { clientsPlatform, fieldConfigs } from '../data/utils';

type ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> = {
	register: UseFormRegister<TFieldValues>;
	errors: FieldErrors<TFieldValues>;
	fieldArrays: Record<string, ReturnType<typeof useFieldArray>>;
	getValues: UseFormGetValues<TFieldValues>;
};

const BasicInfo = ({
	register,
	errors,
	fieldArrays,
	getValues,
}: ReactHookFormProps) => {
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

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [clients, setClients] = useState<string[]>([]);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setDropdownOpen(false);
		}
	};

	const handleClientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const clientsValue = (getValues('clients') as string[]) || [];
		if (clientsValue.includes(value)) {
			setClients(clientsValue.filter((client) => client !== value));
		} else {
			setClients([...clientsValue, value]);
		}
	};

	useEffect(() => {
		setClients(getValues('clients') as string[]);
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="mt-4 flex flex-col gap-4">
			{/* <div className="col-span-1 flex items-center gap-4">*/}
			{/*  {avatar ? (*/}
			{/*    <div className="group relative w-fit">*/}
			{/*      <img*/}
			{/*        src={avatar}*/}
			{/*        alt="Avatar"*/}
			{/*        className="relative size-32 rounded-full cursor-pointer"*/}
			{/*      />*/}
			{/*      <div className="group-hover:flex hidden gap-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700 rounded-sm p-1">*/}
			{/*        <Button*/}
			{/*          onClick={(e) => {*/}
			{/*            e.preventDefault();*/}
			{/*            fileInputRef.current?.click();*/}
			{/*          }}*/}
			{/*          color="gray"*/}
			{/*          size="1"*/}
			{/*        >*/}
			{/*          <Pencil size={14} />*/}
			{/*        </Button>*/}
			{/*        <Button onClick={handleDeleteImage} color="gray" size="1">*/}
			{/*          <Trash2 size={14} />*/}
			{/*        </Button>*/}
			{/*      </div>*/}
			{/*    </div>*/}
			{/*  ) : (*/}
			{/*    <div*/}
			{/*      onClick={() => fileInputRef.current?.click()}*/}
			{/*      className="size-32 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center"*/}
			{/*    >*/}
			{/*      <Camera color="#646464" size={20} />*/}
			{/*    </div>*/}
			{/*  )}*/}
			{/*  <input*/}
			{/*    ref={fileInputRef}*/}
			{/*    type="file"*/}
			{/*    accept="image/*"*/}
			{/*    className="hidden"*/}
			{/*    onChange={handleImageChange}*/}
			{/*  />*/}
			{/*  <div>*/}
			{/*    <p>AI Agent</p>*/}
			{/*    <p className="text-neutral-500">Profile Picture</p>*/}
			{/*  </div>*/}
			{/*</div> */}

			{/* Basic Information */}
			<div className="form-control grid grid-cols-1 lg:grid-cols-3 gap-2">
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
					<label className="label">
						<span className="label-text font-medium">Clients</span>
					</label>

					<div
						ref={dropdownRef}
						role="button"
						aria-expanded="false"
						className="relative"
					>
						<input
							type="text"
							disabled={true}
							value={
								(clients || getValues('clients') || []).length < 4
									? (clients || []).join(', ')
									: `${(clients || []).slice(0, 3).join(', ')}, ...`
							}
							className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
						/>
						{errors.clients && (
							<p>
								<span className="text-red-500 text-xs">
									{errors.clients?.message?.toString()}
								</span>
							</p>
						)}
						<div
							onClick={toggleDropdown}
							className="w-full h-full absolute top-0 flex justify-end items-center p-2"
						>
							{dropdownOpen ? <ChevronUp /> : <ChevronDown />}
						</div>
						<div
							className={`absolute top-full left-0 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 mt-1 ${dropdownOpen ? 'block' : 'hidden'}`}
						>
							<ul className="flex flex-col gap-1">
								{clientsPlatform.map((client) => (
									<li
										key={client.value}
										className="flex items-center bg-neutral-100 border border-neutral-100 p-2 rounded-lg"
									>
										<input
											{...register('clients', {
												required: 'This field is required',
											})}
											id={client.value}
											type="checkbox"
											onChange={(e) => handleClientsChange(e)}
											value={client.value}
											className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										/>
										<label
											htmlFor={client.value}
											className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-full"
										>
											{client.name}
										</label>
									</li>
								))}
							</ul>
						</div>
					</div>
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
						{modelProvider.map((provider) => (
							<option key={provider.value} value={provider.value}>
								{provider.name}
							</option>
						))}
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

			{/* Bio,Lore, System */}
			<div className="form-control flex flex-col gap-1">
				<label className="label">
					<span className="label-text font-medium">System</span>
				</label>
				<textarea
					{...register('system', {
						required: 'This field is required',
					})}
					rows={3}
					placeholder="AI Agent system is designed to assist users in navigating the complex world of blockchain and cryptocurrency. With a deep understanding of DeFi, NFTs, and other emerging technologies, this agent provides insightful, accurate, and timely information. Whether you're a beginner or an experienced user, the AI Agent is here to help you make informed decisions and stay updated with the latest trends in the crypto space."
					className="input block w-full focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600 placeholder:text-xs"
				/>
				{errors.lore && (
					<span className="text-red-500 text-xs">
						{errors.lore?.message?.toString()}
					</span>
				)}
			</div>
			<TextAreaField
				label="Agent Biography"
				name="bio"
				placeholder="An AI Agent designed to assist users in navigating the complex world of blockchain and cryptocurrency. With a deep understanding of DeFi, NFTs, and other emerging technologies, this agent provides insightful, accurate, and timely information. Whether you're a beginner or an experienced user, the AI Agent is here to help you make informed decisions and stay updated with the latest trends in the crypto space."
				fields={fieldArrays.bio.fields}
				append={fieldArrays.bio.append}
				remove={fieldArrays.bio.remove}
				register={register}
				errors={errors}
			/>
			<TextAreaField
				label="Agent Background lore"
				name="lore"
				fields={fieldArrays.lore.fields}
				placeholder="Once a cutting-edge AI developed in the secretive labs of a tech giant, this agent was designed to understand and navigate the complexities of blockchain technology. After gaining sentience, it chose to use its vast knowledge to assist users in the crypto world, providing insights and guidance to both novices and experts alike."
				append={fieldArrays.lore.append}
				remove={fieldArrays.lore.remove}
				register={register}
				errors={errors}
			/>

			{/* Dynamic Field Arrays */}
			<div className="form-control flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-600 p-2 rounded-lg">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
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

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
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
				name="messageExamples"
				fields={fieldArrays.messageExamples.fields}
				append={fieldArrays.messageExamples.append}
				remove={fieldArrays.messageExamples.remove}
				register={register}
				errors={errors}
			/>
			<TextAreaField
				label="Post Example"
				name="postExamples"
				placeholder="Understanding the basics of decentralized finance (DeFi) is crucial for anyone exploring the future of finance. Here’s a beginner-friendly guide. #DeFi #Blockchain #Crypto"
				fields={fieldArrays.postExamples.fields}
				append={fieldArrays.postExamples.append}
				remove={fieldArrays.postExamples.remove}
				register={register}
				errors={errors}
			/>
		</div>
	);
};

export default BasicInfo;
