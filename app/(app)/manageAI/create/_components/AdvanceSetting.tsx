import React, { useState, useRef, useEffect } from 'react';
import InputField from './InputField';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Control, FieldValues, UseFormRegister, UseFormWatch } from 'react-hook-form';
import envConfigs from '../data/envConfigs';
import { clientsPlatform } from '../data/utils';
import ReactDOM from 'react-dom';

type ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> = {
    register: UseFormRegister<TFieldValues>;
    watch: UseFormWatch<TFieldValues>;
    control: Control<any>;
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
    // 'AI Model Settings': 'openai',
    // 'Eternal AI Settings': 'eternali',
    // 'Grok Settings': 'grok',
    // 'Groq Settings': 'groq',
    // 'OpenRouter Settings': 'openrouter',
    'Google Generative AI Settings': 'google',
    // 'Ali Bailian Settings': 'ali_bailian',
    // 'NanoGPT Settings': 'nanogpt',
    // 'Hyperbolic AI Settings': 'hyperbolic',
    // 'Anthropic Settings': 'anthropic',
    // 'Ollama Settings': 'ollama',
    // 'Heurist Settings': 'heurist',
    // 'Venice Settings': 'venice',
}

const AdvanceSetting = ({ register, watch, control }: ReactHookFormProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const selectedClients = watch('clients') || [];
    const selectedProvider = watch('modelProvider');

    // For dropdown portal
    const [dropdownPortal, setDropdownPortal] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Create portal element when component mounts
        const portalEl = document.createElement('div');
        portalEl.id = 'clients-dropdown-portal';
        portalEl.style.position = 'absolute';
        portalEl.style.zIndex = '9999';
        document.body.appendChild(portalEl);
        setDropdownPortal(portalEl);

        return () => {
            // Clean up portal element when component unmounts
            if (portalEl && document.body.contains(portalEl)) {
                document.body.removeChild(portalEl);
            }
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Calculate and position the dropdown when it's opened
    useEffect(() => {
        if (dropdownOpen && dropdownRef.current && dropdownPortal) {
            const rect = dropdownRef.current.getBoundingClientRect();
            dropdownPortal.style.width = `${rect.width}px`;
            dropdownPortal.style.top = `${rect.bottom + window.scrollY}px`;
            dropdownPortal.style.left = `${rect.left}px`;
        }
    }, [dropdownOpen, dropdownPortal]);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownOpen) {
            const target = event.target as Node;
            const isOutsideDropdownRef = dropdownRef.current && !dropdownRef.current.contains(target);
            const isOutsidePortal = dropdownPortal && !dropdownPortal.contains(target);
            
            if (isOutsideDropdownRef && isOutsidePortal) {
                setDropdownOpen(false);
            }
        }
    };

    useEffect(() => {
        // Add event listener when component mounts or dependencies change
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen, dropdownPortal]); // Update when these dependencies change

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
            {/* Clients Selection Dropdown */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Clients</span>
                </label>
                <div
                    ref={dropdownRef}
                    role="button"
                    aria-expanded="false"
                    className="relative"
                >
                    <input
                        type="text"
                        disabled={true}
                        value={
                            selectedClients.length < 4
                                ? selectedClients.join(', ')
                                : `${selectedClients.slice(0, 3).join(', ')}, ...`
                        }
                        className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
                    />
                    <div
                        onClick={toggleDropdown}
                        className="w-full h-full absolute top-0 flex justify-end items-center p-2"
                    >
                        {dropdownOpen ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {dropdownOpen && dropdownPortal && ReactDOM.createPortal(
                        <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 shadow-lg">
                            <ul className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                                {clientsPlatform.map((client) => (
                                    <li
                                        key={client.value}
                                        className="flex items-center bg-neutral-100 dark:bg-neutral-700 border border-neutral-100 dark:border-neutral-600 p-2 rounded-lg"
                                    >
                                        <input
                                            {...register('clients')}
                                            id={`adv_${client.value}`}
                                            type="checkbox"
                                            value={client.value}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor={`adv_${client.value}`}
                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-full"
                                        >
                                            {client.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>,
                        dropdownPortal
                    )}
                </div>
            </div>

            {/* Client-specific configurations */}
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
                                        control={control}
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
