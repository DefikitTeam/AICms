'use client';
import { Button } from '@radix-ui/themes';
import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

type FormFieldProps = {
	name: string;
	placeholder?: string;
};
const FormFieldArray = ({ name, placeholder }: FormFieldProps) => {
	const { control } = useForm();
	const { fields, append, remove } = useFieldArray({
		control,
		name: name,
	});

	useEffect(() => {
		if (fields.length === 0) {
			append({ value: '' });
		}
	}, [fields, append]);

	return (
		<div className="flex flex-col gap-4 mb-2 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
			{fields.map((field, index) => (
				<div key={field.id} className="flex gap-2 items-center">
					<input
						{...field}
						type="text"
						placeholder={placeholder}
						className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
						defaultValue=""
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

export default FormFieldArray;
