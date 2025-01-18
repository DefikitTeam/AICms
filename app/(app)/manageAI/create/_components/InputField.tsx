import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import {
	FieldArrayPath,
	FieldErrors,
	FieldValues,
	UseFieldArrayAppend,
	UseFormRegister,
} from 'react-hook-form';

type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
	label?: string;
	name: string;
	placeholder?: string;
	register: UseFormRegister<TFieldValues>;
	// errors: FieldErrors<TFieldValues>;
	isSecure?: boolean;
};

const InputField = ({
	label,
	name,
	placeholder,
	register,
	// errors,
	isSecure = false,
}: InputFieldProps) => {
	const [show, setShow] = useState(false);

	return (
		<div className="col-span-1 p-2 bg-neutral-100 dark:bg-neutral-600 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
			<label className="label">
				<span className="label-text font-medium">{label}</span>
			</label>
			<input
				{...register(name)}
				placeholder={placeholder}
				type="text"
				className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
			/>
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
