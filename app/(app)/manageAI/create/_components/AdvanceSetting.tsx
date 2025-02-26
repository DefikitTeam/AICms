import React from 'react';
import InputField from './InputField';
import { FieldValues, UseFormRegister, UseFormWatch } from 'react-hook-form';
import envConfigs from '../data/envConfigs';

type ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> = {
    register: UseFormRegister<TFieldValues>;
    watch: UseFormWatch<TFieldValues>;
};

const clientSettingsMap = {
    'Discord Settings': 'discord',
    'Telegram Settings': 'telegram',
    'Twitter/X Settings': 'twitter',
		'Twitter Action Processing Settings': 'twitter',
    // Add other client-setting mappings as needed
};

const AdvanceSetting = ({ register, watch }: ReactHookFormProps) => {
    const selectedClients = watch('clients') || [];

    const shouldShowConfig = (configName: string) => {
        // Always show configs that aren't client-specific
        if (!clientSettingsMap[configName as keyof typeof clientSettingsMap]) {
            return true;
        }
        // Show client-specific configs only if the client is selected
        return selectedClients.includes(
            clientSettingsMap[configName as keyof typeof clientSettingsMap]
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {envConfigs.map((config, index) => 
                shouldShowConfig(config.name) ? (
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
                ) : null
            )}
        </div>
    );
};

export default AdvanceSetting;
