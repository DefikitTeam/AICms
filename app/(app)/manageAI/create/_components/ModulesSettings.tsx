import React from 'react';
import { Box, Flex, Switch, Text } from '@radix-ui/themes';
import { Control, Controller, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';

interface ModulesSettingsProps {
  register: UseFormRegister<FieldValues>;
  watch: any;
  control: Control<FieldValues>;
  onModuleChange?: (value: boolean) => void;
  setValue?: UseFormSetValue<FieldValues>;
  agentId?: string; // Add agentId as an optional prop
}

const ModulesSettings = ({ control, watch, agentId }: ModulesSettingsProps) => {
  // Use watch to monitor changes to the modules.education value
  const educationModule = watch("modules.education");

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

      <Box className="border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg mb-4">
        <Flex justify="between" align="center">
          <Flex gap="4" align="center" style={{ marginRight: '16px' }}> {/* Increased gap and added margin */}
            <Box className={`size-8 rounded-full ${educationModule ? 'bg-blue-400' : 'bg-blue-100'} flex items-center justify-center`} style={{ minWidth: '32px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10M22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10M22 10H2M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Box>
            <Box style={{ flexGrow: 1 }}>
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