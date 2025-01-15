'use client';
import { Box } from '@radix-ui/themes';
import { Camera, SquarePen, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';

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

	return (
		<div className="flex flex-col">
			<div>
				<h1 className="text-2xl font-semibold">Create new AI Agent</h1>
				<form className="mt-4 flex flex-col gap-4">
					<div className="form-control flex items-center gap-4">
						{avatar ? (
							<div className="group relative w-fit">
								<img
									src={avatar}
									alt="Avatar"
									className="relative size-32 rounded-full"
								/>
								<div className="group-hover:flex hidden gap-2 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-neutral-200 dark:bg-neutral-700 rounded-sm p-1">
									<SquarePen size={14} />
									<Trash2 size={14} />
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
							<p className="text-neutral-500">Profile Pricture</p>
						</div>
					</div>
					<div className="form-control">
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
					<div className="form-control">
						<label className="label">
							<span className="label-text font-medium">
								AI Agent Biography
							</span>
						</label>
						<textarea
							rows={10}
							placeholder="Agent biography"
							className="input block w-full mt-1 focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default page;
