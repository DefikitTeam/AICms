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
    'Twitter Post Interval Settings': 'twitter',
	'Twitter Action Processing Settings': 'twitter',
    // Add other client-setting mappings as needed
};

const providerSettingsMap = {
    'AI Model Settings': 'openai',
    'Eternal AI Settings': 'eternali',
    'Grok Settings': 'grok',
    'Groq Settings': 'groq',
    'OpenRouter Settings': 'openrouter',
    'Google Generative AI Settings': 'google',
    'Ali Bailian Settings': 'ali_bailian',
    'NanoGPT Settings': 'nanogpt',
    'Hyperbolic AI Settings': 'hyperbolic',
    'Anthropic Settings': 'anthropic',
    'Ollama Settings': 'ollama',
    'Heurist Settings': 'heurist',
    'Venice Settings': 'venice',
}

const AdvanceSetting = ({ register, watch }: ReactHookFormProps) => {
    const selectedClients = watch('clients') || [];
    const selectedProvider = watch('modelProvider');

    const shouldShowConfig = (configName: string) => {
        const isClientConfig = configName in clientSettingsMap;
        const isProviderConfig = configName in providerSettingsMap;
        
        // If it's a client-specific config, check if that client is selected
        if (isClientConfig) {
            const clientKey = configName as keyof typeof clientSettingsMap;
            return selectedClients.includes(clientSettingsMap[clientKey]);
        }
        
        // If it's a provider-specific config, check if that provider is selected
        if (isProviderConfig) {
            const providerKey = configName as keyof typeof providerSettingsMap;
            return providerSettingsMap[providerKey] === selectedProvider;
        }
        
        // If it's not specific to either client or provider, always show it
        return !isClientConfig && !isProviderConfig;
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
