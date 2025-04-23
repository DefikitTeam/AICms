import React, { useEffect } from 'react';
import { Box, Text, Flex } from '@radix-ui/themes';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import useAgent from '../../_hooks/useAgent';
import ModuleComponent, { ModuleFieldSetting } from './ModuleComponent';

interface ModulesSettingsProps {
  register: UseFormRegister<FieldValues>;
  watch: any;
  control: Control<FieldValues>;
  onModuleChange?: (value: boolean) => void;
  setValue?: UseFormSetValue<FieldValues>;
  agentId?: string;
}

const ModulesSettings = ({ control, watch, onModuleChange, setValue, agentId }: ModulesSettingsProps) => {
  const { updateAgent, getDetailAgent } = useAgent();
  // Use watch to monitor changes to the modules values
  const educationModule = watch("modules.education");
  const combatModule = watch("modules.combat");

  useEffect(() => {
    console.log("Education module state changed:", educationModule);

    // Save module status to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('educationModuleEnabled', educationModule ? 'true' : 'false');
      console.log("Saved education module status to localStorage:", educationModule);
    }

    // Call the callback if provided
    if (onModuleChange) {
      onModuleChange(!!educationModule);
    }
  }, [educationModule, onModuleChange]);

  // Initialization from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && setValue) {
      const savedEducationStatus = localStorage.getItem('educationModuleEnabled');
      const savedCombatStatus = localStorage.getItem('combatModuleEnabled');

      console.log("Retrieved education module status from localStorage:", savedEducationStatus);
      console.log("Retrieved combat module status from localStorage:", savedCombatStatus);

      if (savedEducationStatus !== null) {
        const parsedStatus = savedEducationStatus === 'true';
        setValue('modules.education', parsedStatus, { shouldValidate: true });
      }

      if (savedCombatStatus !== null) {
        const parsedStatus = savedCombatStatus === 'true';
        setValue('modules.combat', parsedStatus, { shouldValidate: true });
        setValue('secrets.ENABLE_XCOMBAT_MODULE', parsedStatus ? 'true' : 'false', { shouldValidate: true });
      }
    }
  }, [setValue]);

  const handleCombatToggle = async (checked: boolean) => {
    // Update the form field first
    if (setValue) {
      setValue('modules.combat', checked, { shouldValidate: true });
      setValue('secrets.ENABLE_XCOMBAT_MODULE', checked ? 'true' : 'false', { shouldValidate: true });
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('combatModuleEnabled', checked ? 'true' : 'false');
      console.log("Saved combat module status to localStorage:", checked);
    }

    // Update agent if we have an agentId
    if (agentId) {
      try {
        console.log("Updating agent via toggle...");
        const agentData = await getDetailAgent(agentId);
        const { character } = agentData;

        await updateAgent(agentId, {
          name: character.name,
          plugins: character.plugins || [],
          clients: character.clients,
          modelProvider: character.modelProvider,
          modules: {
            ...character.modules,
            combat: checked
          },
          settings: {
            ...character.settings,
            secrets: {
              ...character.settings.secrets,
              ENABLE_XCOMBAT_MODULE: checked ? 'true' : 'false'
            },
            voice: character.settings.voice,
            imageSettings: character.settings.imageSettings
          },
          system: character.system,
          bio: character.bio,
          lore: character.lore,
          messageExamples: character.messageExamples,
          postExamples: character.postExamples,
          adjectives: character.adjectives,
          people: character.people || [],
          topics: character.topics,
          style: character.style
        });

        console.log("Agent updated successfully via toggle.");
        console.log("Combat module set to:", checked);
        console.log("ENABLE_XCOMBAT_MODULE set to:", checked ? 'true' : 'false');

      } catch (error) {
        console.error("Failed to update agent via toggle:", error);
        // Optionally, revert the toggle state in UI if update fails
        if (setValue) {
          setValue('modules.combat', !checked, { shouldValidate: true });
          setValue('secrets.ENABLE_XCOMBAT_MODULE', !checked ? 'true' : 'false', { shouldValidate: true });
          localStorage.setItem('combatModuleEnabled', !checked ? 'true' : 'false');
        }
      }
    }

    // Call the callback if provided
    if (onModuleChange) {
      onModuleChange(checked);
    }
  };

  const handleEducationToggle = (checked: boolean) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('educationModuleEnabled', checked ? 'true' : 'false');
    }

    // Call the callback if provided
    if (onModuleChange) {
      onModuleChange(checked);
    }
  };

  const combatModuleFields: ModuleFieldSetting[] = [];

  const educationModuleFields: ModuleFieldSetting[] = [];

  // Icon cho Education Module
  const educationIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10M22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10M22 10H2M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Icon cho Combat Module
  const combatIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9999 19.0001L10.9999 15.0001M10.9999 15.0001L6.99994 11.0001M10.9999 15.0001L14.9999 11.0001M10.9999 15.0001L6.99994 19.0001M21.9999 12.0001C21.9999 17.5229 17.5228 22.0001 11.9999 22.0001C6.47709 22.0001 1.99994 17.5229 1.99994 12.0001C1.99994 6.47721 6.47709 2.00006 11.9999 2.00006C17.5228 2.00006 21.9999 6.47721 21.9999 12.0001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <Box>
      <Box className="mb-4">
        <Text size="5" weight="bold">
          Modules
        </Text>
        <Text size="2" color="gray">
          Enable additional modules to extend your agent's capabilities
        </Text>
      </Box>

      {/* Grid layout để hiển thị modules trên cùng một hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Education Module */}
        <div>
          <ModuleComponent
            name="Education Module"
            description="Enables teaching capabilities for your agent"
            iconColor="bg-blue"
            activeColor="bg-blue-400"
            icon={educationIcon}
            fields={educationModuleFields}
            isActive={educationModule}
            onToggle={handleEducationToggle}
            formPath="modules.education"
            control={control}
            setValue={setValue}
            agentId={agentId}
            linkPath="/education"
            hasLink={false}
          />
        </div>

        {/* Combat Module */}
        <div>
          <ModuleComponent
            name="X AI Combat Module"
            description="Enables combat capabilities for your agent"
            iconColor="bg-red"
            activeColor="bg-red-400"
            icon={combatIcon}
            fields={combatModuleFields}
            isActive={combatModule}
            onToggle={handleCombatToggle}
            formPath="modules.combat"
            control={control}
            setValue={setValue}
            agentId={agentId}
            linkPath="/xaicombat"
            hasLink={true}
          />
        </div>
      </div>
    </Box>
  );
};

export default ModulesSettings; 