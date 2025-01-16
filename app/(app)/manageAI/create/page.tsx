'use client';
import { Button } from '@radix-ui/themes';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import FormFieldArray from './_components/FormField';
import MessageExample from './_components/MessageExample';

const page = () => {
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
		<div className="flex flex-col">
			<div>
				<h1 className="text-2xl font-semibold">Create new AI Agent</h1>
				<form className="mt-4 flex flex-col gap-4">
					<div className="col-span-1 flex items-center gap-4">
						{avatar ? (
							<div className="group relative w-fit">
								<img
									src={avatar}
									alt="Avatar"
									className="relative size-32 rounded-full cursor-pointer"
								/>
								<div className="group-hover:flex hidden gap-1 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-neutral-200 dark:bg-neutral-700 rounded-sm p-1">
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
									<Button
										onClick={(e) => handleDeleteImage(e)}
										color="gray"
										size="1"
									>
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
					{/* Name */}
					<div className="form-control grid grid-cols-3 gap-4">
						<div className="col-span-1">
							<label className="label">
								<span className="label-text font-medium">
									AI Agent Name
								</span>
							</label>
							<input
								type="text"
								placeholder="Agent Name"
								className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
							/>
						</div>
						<div className="col-span-1">
							<label className="label">
								<span className="label-text font-medium">Clients</span>
							</label>
							<select className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
								<option value="openAI">Telegram</option>
								<option value="gemini">X</option>
								<option value="claude">Discord</option>
							</select>
						</div>
						<div className="col-span-1">
							<label className="label">
								<span className="label-text font-medium">
									Model provider to use
								</span>
							</label>
							<select
								id="countries"
								className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							>
								<option defaultChecked>Choose modal AI</option>
								<option value="openAI">Open AI</option>
								<option value="gemini">Gemini</option>
								<option value="claude">Claude</option>
							</select>
						</div>
					</div>

					{/* Bio */}
					<div className="form-control flex gap-4">
						<div className="w-full">
							<label className="label">
								<span className="label-text font-medium">
									AI Agent Biography
								</span>
							</label>
							<textarea
								rows={5}
								placeholder="Agent biography"
								className="input block w-full mt-1 focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600"
							/>
						</div>
						<div className="w-full">
							<label className="label">
								<span className="label-text font-medium">
									Agent background lore
								</span>
							</label>
							<textarea
								rows={5}
								placeholder="Agent lore"
								className="input block w-full mt-1 focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600"
							/>
						</div>
					</div>

					<div className="form-control flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-600 p-2 rounded-lg">
						<div className="grid grid-cols-3 gap-4">
							{/* Topics */}
							<div className="col-span-1">
								<label className="label mb-2">
									<span className="label-text font-medium">
										Topics
									</span>
								</label>
								<FormFieldArray
									name="Topic"
									placeholder="Blockchain, Cryptocurrency, NFTs"
								/>
							</div>

							{/* Knowledge */}
							<div className="col-span-1">
								<label className="label mb-3">
									<span className="label-text font-medium">
										Knowledges
									</span>
								</label>
								<FormFieldArray
									name="Knowledge"
									placeholder="Blockchain technology and its applications"
								/>
							</div>

							{/* Addjective */}
							<div className="col-span-1">
								<label className="label mb-3">
									<span className="label-text font-medium">
										Adjectives
									</span>
								</label>
								<FormFieldArray
									name="Adjective"
									placeholder="visionary, ambitious, innovative"
								/>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4">
							{/* Topics */}
							<div className="col-span-1">
								<label className="label mb-2">
									<span className="label-text font-medium">
										Style for all
									</span>
								</label>
								<FormFieldArray
									name="All"
									placeholder="Enthusiastic, friendly, professional"
								/>
							</div>

							{/* Knowledge */}
							<div className="col-span-1">
								<label className="label mb-3">
									<span className="label-text font-medium">
										Chat style
									</span>
								</label>
								<FormFieldArray
									name="Chat"
									placeholder="Devoted, Eager, Passionate"
								/>
							</div>

							{/* Addjective */}
							<div className="col-span-1">
								<label className="label mb-3">
									<span className="label-text font-medium">
										Post style
									</span>
								</label>
								<FormFieldArray
									name="Post"
									placeholder="Helpful, Knowledgeable, Supportive"
								/>
							</div>
						</div>

						<MessageExample />
					</div>
				</form>
			</div>
		</div>
	);
};

export default page;
