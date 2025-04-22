import React, { useEffect } from 'react';
import { Box, Flex, Switch, Text } from '@radix-ui/themes';
import { Control, Controller, UseFormRegister, useWatch, UseFormSetValue } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import useAgent from '../../_hooks/useAgent';

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
  const combatModule = watch("modules.combat"); // Keep watching for UI updates

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

  // Removed the useEffect for combatModule update

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

      {/* Education Module Box */}
      <Box className="border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg mb-4">
        <Flex justify="between" align="center">
          <Flex gap="2" align="center">
            <Box className={`size-8 rounded-full ${educationModule ? 'bg-blue-400' : 'bg-blue-100'} flex items-center justify-center`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10M22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10M22 10H2M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Box>
            <Box>
              <Text weight="medium">Education Module</Text>
              <Text size="1" color="gray">
                Enables teaching capabilities for your agent
              </Text>
              {educationModule && (
                <Text size="1" color="blue" weight="bold" className="mt-1">
                  Module is active and will appear on your agent card
                </Text>
              )}
            </Box>
          </Flex>
          <Controller
            name="modules.education"
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch
                checked={value}
                onCheckedChange={(checked) => {
                  onChange(checked);
                  console.log("Education module toggled to:", checked);
                  // The existing useEffect handles localStorage and callback
                }}
                size="2"
              />
            )}
          />
        </Flex>
      </Box>

      {/* Combat Module Box */}
      <Box className="border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg mb-4">
        <Flex justify="between" align="center">
          <Flex gap="2" align="center">
            <Box className={`size-8 rounded-full ${combatModule ? 'bg-red-400' : 'bg-red-100'} flex items-center justify-center`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.9999 19.0001L10.9999 15.0001M10.9999 15.0001L6.99994 11.0001M10.9999 15.0001L14.9999 11.0001M10.9999 15.0001L6.99994 19.0001M21.9999 12.0001C21.9999 17.5229 17.5228 22.0001 11.9999 22.0001C6.47709 22.0001 1.99994 17.5229 1.99994 12.0001C1.99994 6.47721 6.47709 2.00006 11.9999 2.00006C17.5228 2.00006 21.9999 6.47721 21.9999 12.0001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>
            <Box>
              <Text weight="medium">X AI Combat Module</Text>
              <Text size="1" color="gray">
                Enables combat capabilities for your agent
              </Text>
              {combatModule && (
                <Text size="1" color="red" weight="bold" className="mt-1">
                  Module is active and will appear on your agent card
                </Text>
              )}
            </Box>
          </Flex>
          <Controller
            name="modules.combat" // Still controlled by react-hook-form
            control={control}
            defaultValue={false}
            render={({ field }) => ( // field.value gives the current state
              <Switch
                checked={field.value}
                onCheckedChange={async (checked) => {
                  // No need to call field.onChange as handleCombatToggle updates the form value
                  console.log("Combat module toggle clicked:", checked);
                  await handleCombatToggle(checked);
                }}
                size="2"
              />
            )}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ModulesSettings; 