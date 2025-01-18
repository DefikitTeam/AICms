import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

type FormFieldProps<TFieldValues extends FieldValues = FieldValues> = {
	name: string;
	placeholder?: string;
	register: UseFormRegister<TFieldValues>;
	errors: FieldErrors<TFieldValues>;
};

const MultipleSelect = ({ name, register, errors }: FormFieldProps) => {
	return (
		<div>
			<label className="label mb-1">
				<span className="label-text font-medium">Client</span>
			</label>
			<select
				{...register(name, {
					required: 'This field is required',
				})}
				multiple
				data-select='{
   "placeholder": "Select a client",
   "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
   "toggleClasses": "advance-select-toggle",
   "dropdownClasses": "advance-select-menu",
   "optionClasses": "advance-select-option selected:active",
   "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span><span className=\"icon-[tabler--check] flex-shrink-0 size-4 text-primary hidden selected:block \"></span></div>",
   "extraMarkup": "<span className=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
   }'
				className="hidden"
			>
				<option value="twitter">X</option>
				<option value="telegram">Telegram</option>
				<option value="discord">Discord</option>
			</select>
			{errors[name] && (
				<p className="text-red-500 text-xs mt-1">
					{errors[name]?.message?.toString()}
				</p>
			)}
		</div>
	);
};

export default MultipleSelect;
