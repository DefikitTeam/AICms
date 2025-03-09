import React, { useState } from "react";
import { UseFormRegister, UseFormWatch, Control } from "react-hook-form";
import socialMediaConfig, { Feature } from "../data/groupData";
import InputField from "./InputField";

interface SocialConfigProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  control: Control<any>;
}

const FeatureSection: React.FC<{
  feature: Feature;
  register: UseFormRegister<any>;
  control: Control<any>;
}> = ({ feature, register, control }) => {
  return (
    <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 t-4">
      <h1 className="text-lg font-semibold mb-2">{feature.name}</h1>
      <p className="text-sm text-gray-600 dark:text-neutral-300">
        {feature.description}
      </p>
      <p className="text-xs text-gray-500 italic dark:text-neutral-400">
        {feature.configGuide}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
        {feature.settings.map((setting) => (
          <div className="col-span-1" key={setting.name}>
            <InputField
              label={setting.label}
              name={`secrets.${setting.name}`}
              placeholder={setting.placeholder}
              register={register}
              control={control}
              type={setting.type}
              description={setting.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialMediaConfigForm: React.FC<SocialConfigProps> = ({
  register,
  watch,
  control,
}) => {
  const selectedPlatforms = watch("clients") || [];
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  if (!selectedPlatforms.length) {
    return null;
  }

  return (
    <div className="w-full pt-4">
      {selectedPlatforms.map((platform: any) => {
        const platformConfig = socialMediaConfig.platforms[platform];
        if (!platformConfig) return null;
        const featureOptions = [
          { value: "", label: "Select a feature" },
          ...Object.entries(platformConfig.features).map(([key, feature]) => ({
            value: key,
            label: feature.name,
          })),
        ];

        return (
          <div
            key={platform}
            className="mb-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600"
          >
            {}
            <label className="text-lg font-semibold mb-2 block">
              {platformConfig.name}
            </label>
            <p className="text-gray-600 text-sm dark:text-gray-300">
              {platformConfig.description}
            </p>
            <p className="text-gray-500 text-xs dark:text-gray-400 mb-3">
              {platformConfig.configGuide}
            </p>

            {}
            <select
              name={`selectedFeature_${platform}`}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {featureOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {}
            {selectedFeature && platformConfig.features[selectedFeature] && (
              <FeatureSection
                feature={platformConfig.features[selectedFeature]}
                register={register}
                control={control} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SocialMediaConfigForm;