import { Button } from '@radix-ui/themes';
import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import {
	FieldArrayPath,
	FieldArrayWithId,
	FieldValues,
	useFieldArray,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	useForm,
	UseFormRegister,
} from 'react-hook-form';
import { FormFieldProps } from './FormFieldArray';

const MessageExample = ({
	name,
	fields,
	append,
	remove,
	register,
}: FormFieldProps) => {
	return (
		<div className="flex flex-col gap-4 mb-2 p-2 bg-neutral-100 dark:bg-neutral-600 rounded-lg">
			<label className="label">
				<span className="label-text font-medium">Message Example</span>
			</label>
			{fields.map((field, index) => (
				<div className="flex gap-2 items-center" key={field.id}>
					<div className="flex flex-col gap-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg p-2 w-full">
						<div className="flex justify-between items-center gap-2">
							<label className="label">
								<span className="label-text font-medium">User:</span>
							</label>
							<input
								{...register(`${name}.${index}.user` as const)}
								type="text"
								placeholder="Hello, I would like to know more about..."
								className="max-w-[90%] input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
							/>
						</div>
						<div className="flex justify-between items-center gap-2">
							<label className="label">
								<span className="label-text font-medium">Agent:</span>
							</label>
							<input
								{...register(`${name}.${index}.agent` as const)}
								type="text"
								placeholder="Okay, I can help you with..."
								className="max-w-[90%] input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
							/>
						</div>
					</div>
					<Button
						size="2"
						color="tomato"
						onClick={() => remove(index)}
						disabled={fields.length === 1}
						className="h-full"
					>
						<Trash2 size={16} />
					</Button>
				</div>
			))}
			<Button
				onClick={(e) => {
					e.preventDefault();
					append({ value: '' });
				}}
			>
				Add
			</Button>
		</div>
	);
};

export default MessageExample;
