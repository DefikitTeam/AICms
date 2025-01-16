import React, { useEffect } from 'react';
import { FormFieldProps } from './FormField';
import { Button } from '@radix-ui/themes';
import { Trash2 } from 'lucide-react';

const PostExample = ({
	label,
	name,
	fields,
	append,
	remove,
	register,
}: FormFieldProps) => {
	useEffect(() => {
		if (fields.length === 0) {
			append('');
		}
	}, []);

	return (
		<div className="flex flex-col gap-4 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
			<label className="label">
				<span className="label-text font-medium">{label}</span>
			</label>
			<div className="flex flex-col gap-4">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="flex gap-2 items-center bg-neutral-200 dark:bg-neutral-800 rounded-lg p-2"
					>
						<textarea
							{...register(`${name}.${index}` as const)}
							rows={5}
							placeholder="Understanding the basics of decentralized finance (DeFi) is crucial for anyone exploring the future of finance. Here’s a beginner-friendly guide. #DeFi #Blockchain #Crypto"
							className="input block w-full focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600"
						/>
						<Button
							size="3"
							color="tomato"
							onClick={() => remove(index)}
							disabled={fields.length === 1}
						>
							<Trash2 size={16} />
						</Button>
					</div>
				))}
			</div>
			<Button
				onClick={(e) => {
					e.preventDefault();
					append('');
				}}
			>
				Add
			</Button>
		</div>
	);
};

export default PostExample;
