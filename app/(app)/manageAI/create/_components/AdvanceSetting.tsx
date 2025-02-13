import React from 'react';
import InputField from './InputField';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import envConfigs from '../data/envConfigs';

type ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> = {
	register: UseFormRegister<TFieldValues>;
	// errors: FieldErrors<TFieldValues>;
};

const AdvanceSetting = ({ register }: ReactHookFormProps) => {
	return (
		<div className="flex flex-col gap-4">
			{envConfigs.map((config, index) => (
				<div
					className="bg-neutral-50 p-2 rounded-lg border border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600"
					key={index}
				>
					<h1 className="text-lg font-semibold mb-2">{config.name}</h1>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
						{config.value.map((field) => (
							<div className="col-span-1" key={field.name}>
								<InputField
									label={field.label}
									name={`secrets.${field.name}`}
									placeholder={field.placeholder}
									register={register}
									description={field.description}
									type={field.type}
									isSecure={field.isSecure}
								/>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default AdvanceSetting;
