import React from 'react';

type TextAreaProps = {
	name: string;
	placeholder?: string;
};

const TextArea = ({ name, placeholder }: TextAreaProps) => {
	return (
		<div>
			<label className="label">
				<span className="label-text font-medium">{name}</span>
			</label>
			<textarea
				rows={5}
				placeholder={placeholder}
				className="input block w-full mt-1 focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600"
			/>
		</div>
	);
};

export default TextArea;
