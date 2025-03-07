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

function parseDescription(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
}

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
					<Tooltip content={
                        <div className="max-w-[300px]">
                            {parseDescription(description)}
                        </div>
                    }>
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
				<div className="relative">
					<input
						{...register(name)}
						placeholder={placeholder}
						type={isSecure ? (show ? 'text' : 'password') : 'text'}
						className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
					/>
					<div className="absolute top-[50%] right-2 transform -translate-y-1/2">
						{isSecure &&
							(show ? (
								<EyeOff size={16} onClick={() => setShow(false)} />
							) : (
								<Eye size={16} onClick={() => setShow(true)} />
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default InputField;
