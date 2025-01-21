import { Eye, EyeOff, CircleHelp } from 'lucide-react';
import React, { useState } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Tooltip } from '@radix-ui/themes';

type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
	label?: string;
	name: string;
	placeholder?: string;
	register: UseFormRegister<TFieldValues>;
	// errors: FieldErrors<TFieldValues>;
	isSecure?: boolean;
	description?: string;
	type?: string;
};

const InputField = ({
	label,
	name,
	placeholder,
	register,
	// errors,
	isSecure = false,
	description,
	type = 'text',
}: InputFieldProps) => {
	const [show, setShow] = useState(false);

	return (
		<div className="col-span-1 p-2 bg-neutral-100 dark:bg-neutral-600 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
			<label className="label flex items-center gap-1 mb-1">
				<span className="label-text text-sm font-medium">{label}</span>
				{description && (
					<Tooltip content={description}>
						<CircleHelp size={16} />
					</Tooltip>
				)}
			</label>
			{type === 'boolean' ? (
				<select
					{...register(name)}
					className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option value="false">Disable</option>
					<option value="true">Active</option>
				</select>
			) : (
				<input
					{...register(name)}
					placeholder={placeholder}
					type="text"
					className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
				/>
			)}
			{isSecure &&
				(show ? (
					<EyeOff onClick={() => setShow(false)} />
				) : (
					<Eye onClick={() => setShow(true)} />
				))}
		</div>
	);
};

export default InputField;
