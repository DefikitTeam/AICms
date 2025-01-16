import { Button } from '@radix-ui/themes';
import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

const MessageExample = () => {
	const { control } = useForm();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'message',
	});

	useEffect(() => {
		if (fields.length === 0) {
			append({ value: '' });
		}
	}, [fields, append]);

	return (
		<div className="flex flex-col gap-4 mb-2 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
			{fields.map((field, index) => (
				<div key={field.id} className="flex flex-col gap-2 items-center">
					<div>
						<label className="label">
							<span className="label-text font-medium">User</span>
						</label>
						<input
							type="text"
							placeholder=""
							className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
						/>
					</div>
					<div>
						<label className="label">
							<span className="label-text font-medium">Agent</span>
						</label>
						<input
							type="text"
							placeholder=""
							className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
						/>
					</div>
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
