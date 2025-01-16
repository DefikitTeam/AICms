'use client';
import { Button } from '@radix-ui/themes';
import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import {
	FieldArrayMethodProps,
	FieldArrayPath,
	FieldArrayWithId,
	FieldValues,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormRegister,
} from 'react-hook-form';

export type FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TFieldArrayName extends
		FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
	TKeyName extends string = 'id',
> = {
	label?: string;
	name: string;
	placeholder?: string;
	append: UseFieldArrayAppend<TFieldValues, TFieldArrayName>;
	remove: UseFieldArrayRemove;
	fields: FieldArrayWithId<TFieldValues, TFieldArrayName, TKeyName>[];
	register: UseFormRegister<TFieldValues>;
};
const FormFieldArray = ({
	label,
	name,
	placeholder,
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
		<>
			<label className="label mb-2">
				<span className="label-text font-medium">{label}</span>
			</label>
			<div className="flex flex-col gap-4 mb-2 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
				{fields.map((field, index) => (
					<div key={field.id} className="flex gap-2 items-center">
						<input
							type="text"
							{...register(`${name}.${index}` as const)}
							placeholder={placeholder}
							className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
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
						append('');
					}}
				>
					Add
				</Button>
			</div>
		</>
	);
};

export default FormFieldArray;
