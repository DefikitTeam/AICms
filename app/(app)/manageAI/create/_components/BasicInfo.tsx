import useTemplateAgent from "@/app/(app)/manageAI/_hooks/useTemplateAgent";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';
import modelProvider from '../data/modelProvider';
import { fieldConfigs } from '../data/utils';
import FormFieldArray from './FormFieldArray';
import MessageExample from './MessageExample';
import TextAreaField from "./TextAreaField";

type ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> = {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  fieldArrays: Record<string, ReturnType<typeof useFieldArray>>;
  getValues?: UseFormGetValues<TFieldValues>;
  setValue?: UseFormSetValue<TFieldValues>;
};

interface Template {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isExportData: boolean;
}

const BasicInfo = ({
  register,
  errors,
  fieldArrays,
  getValues,
  setValue,
}: ReactHookFormProps) => {
  // Template dropdown state
  const searchParams = useSearchParams();
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [templatesCache, setTemplatesCache] = useState<{
    data: Template[] | null;
    timestamp: number | null;
  }>({
    data: null,
    timestamp: null,
  });
  const templatesDropdownRef = useRef<HTMLDivElement>(null);
  const { getListTemplate, importTemplate } =
    useTemplateAgent();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const fetchTemplates = async () => {
    try {
      // Check if we have cached data that's less than 5 minutes old
      const now = Date.now();
      if (
        templatesCache.data &&
        templatesCache.timestamp &&
        now - templatesCache.timestamp < 5 * 60 * 1000
      ) {
        setTemplates(templatesCache.data);
        return;
      }

      setLoading(true);
      const data = await getListTemplate();
      if (data?.templateAgents) {
        setTemplates(data.templateAgents);
        setTemplatesCache({
          data: data.templateAgents,
          timestamp: now,
        });
      }
      setLoading(false);
    } catch {
      toast.error("Failed to fetch templates");
      setLoading(false);
    }
  };

  const toggleTemplatesDropdown = () => {
    if (!templatesDropdownOpen) {
      fetchTemplates();
    }
    setTemplatesDropdownOpen(!templatesDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      templatesDropdownRef.current &&
      !templatesDropdownRef.current.contains(event.target as Node)
    ) {
      setTemplatesDropdownOpen(false);
    }
  };
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
   
    // Pre-fetch templates when component mounts
    fetchTemplates();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const templateId = searchParams.get("templateId");
    console.log("templateId", templateId);
    if (templateId) {
      setSelectedTemplate(templates.find((template) => template.id === templateId) || null);
      importTemplate(templateId, { redirectToCreate: true});
    }
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = useMemo(
    () => (
      <>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse flex p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 mb-2"
          >
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-500 rounded self-center"></div>
          </div>
        ))}
      </>
    ),
    []
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* Template Selector */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Choose a template</span>
        </label>
        <div
          ref={templatesDropdownRef}
          role="button"
          aria-expanded={templatesDropdownOpen}
          className="relative"
        >
          <input
            type="text"
            disabled={true}
            value={selectedTemplate ? selectedTemplate.name : ""}
            placeholder="Select a template to pre-populate fields"
            className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
          />
          <div
            onClick={toggleTemplatesDropdown}
            className="w-full h-full absolute top-0 flex justify-end items-center p-2"
          >
            {templatesDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
          <div
            className={`absolute top-full left-0 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 mt-1 z-10 ${templatesDropdownOpen ? "block" : "hidden"}`}
          >
            {loading ? (
              <div className="p-2">{LoadingSkeleton}</div>
            ) : templates.length > 0 ? (
              <ul className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {templates.map((template) => (
                  <li
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template);
                      importTemplate(template.id);
                      setTemplatesDropdownOpen(false);
                    }}
                    className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-700 border border-neutral-100 dark:border-neutral-600 p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{template.name}</p>
                      {template.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {template.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 text-center">No templates available</div>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="form-control grid grid-cols-1 lg:grid-cols-2 gap-2">
				<div className="col-span-1">
					<label className="label">
						<span className="label-text font-medium">AI Agent Name</span>
					</label>
					<input
						{...register('name', {
							required: 'This field is required',
						})}
						type="text"
						placeholder="Agent Name"
						className="input block w-full mt-1 focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg"
					/>
					<p>
						{errors.name && (
							<span className="text-red-500 text-xs">
								{errors.name?.message?.toString()}
							</span>
						)}
					</p>
				</div>
				<div className="col-span-1">
					<label className="label flex items-center gap-1">
						<span className="label-text font-medium">
							Model provider to use
						</span>
						<div className="relative group">
							<Info size={16} className=" cursor-pointer" />
							<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 w-64 bg-black dark:bg-neutral-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
								Currently, our system only supports Google Model. Other model providers will be available in the future.
								<div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-black dark:border-t-neutral-900"></div>
							</div>
						</div>
					</label>
					<select
						{...register('modelProvider', {
							required: 'This field is required',
						})}
						className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						disabled={true}
					>
						{modelProvider.map((provider) => (
							<option key={provider.value} value={provider.value}>
								{provider.name}
							</option>
						))}
					</select>
					<p>
						{errors.modelProvider && (
							<span className="text-red-500 text-xs">
								{errors.modelProvider?.message?.toString()}
							</span>
						)}
					</p>
				</div>
			</div>

      {/* Bio,Lore, System */}
      <div className="form-control flex flex-col gap-1">
        <label className="label">
          <span className="label-text font-medium">System</span>
        </label>
        <textarea
          {...register("system", {
            required: "This field is required",
          })}
          rows={3}
          placeholder="AI Agent system is designed to assist users in navigating the complex world of blockchain and cryptocurrency. With a deep understanding of DeFi, NFTs, and other emerging technologies, this agent provides insightful, accurate, and timely information. Whether you're a beginner or an experienced user, the AI Agent is here to help you make informed decisions and stay updated with the latest trends in the crypto space."
          className="input block w-full focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600 placeholder:text-xs"
        />
        {errors.lore && (
          <span className="text-red-500 text-xs">
            {errors.lore?.message?.toString()}
          </span>
        )}
      </div>
      <TextAreaField
        label="Agent Biography"
        name="bio"
        placeholder="An AI Agent designed to assist users in navigating the complex world of blockchain and cryptocurrency. With a deep understanding of DeFi, NFTs, and other emerging technologies, this agent provides insightful, accurate, and timely information. Whether you're a beginner or an experienced user, the AI Agent is here to help you make informed decisions and stay updated with the latest trends in the crypto space."
        fields={fieldArrays.bio.fields}
        append={fieldArrays.bio.append}
        remove={fieldArrays.bio.remove}
        register={register}
        errors={errors}
      />
      <TextAreaField
        label="Agent Background lore"
        name="lore"
        fields={fieldArrays.lore.fields}
        placeholder="Once a cutting-edge AI developed in the secretive labs of a tech giant, this agent was designed to understand and navigate the complexities of blockchain technology. After gaining sentience, it chose to use its vast knowledge to assist users in the crypto world, providing insights and guidance to both novices and experts alike."
        append={fieldArrays.lore.append}
        remove={fieldArrays.lore.remove}
        register={register}
        errors={errors}
      />

      {/* Dynamic Field Arrays */}
      <div className="form-control flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-600 p-2 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {fieldConfigs.slice(0, 3).map(({ name, label, placeholder }) => (
            <div className="col-span-1" key={name}>
              <FormFieldArray
                label={label}
                name={name}
                placeholder={placeholder}
                fields={fieldArrays[name].fields}
                append={fieldArrays[name].append}
                remove={fieldArrays[name].remove}
                register={register}
                errors={errors}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {fieldConfigs.slice(3, 6).map(({ name, label, placeholder }) => (
            <div className="col-span-1" key={name}>
              <FormFieldArray
                label={label}
                name={name}
                placeholder={placeholder}
                fields={fieldArrays[name].fields}
                append={fieldArrays[name].append}
                remove={fieldArrays[name].remove}
                register={register}
                errors={errors}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <MessageExample
        name="messageExamples"
        fields={fieldArrays.messageExamples.fields}
        append={fieldArrays.messageExamples.append}
        remove={fieldArrays.messageExamples.remove}
        register={register}
        errors={errors}
      />
      <TextAreaField
        label="Post Example"
        name="postExamples"
        placeholder="Understanding the basics of decentralized finance (DeFi) is crucial for anyone exploring the future of finance. Here's a beginner-friendly guide. #DeFi #Blockchain #Crypto"
        fields={fieldArrays.postExamples.fields}
        append={fieldArrays.postExamples.append}
        remove={fieldArrays.postExamples.remove}
        register={register}
        errors={errors}
      />
    </div>
  );
};

export default BasicInfo;
