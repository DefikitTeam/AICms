import { Avatar, Box, Button, Card, Flex, Text, Switch } from '@radix-ui/themes';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import useAgent from "../_hooks/useAgent";
import toast from 'react-hot-toast';

export type CardAgentType = {
  id: string;
  clients: string[];
  username: string;
  isRunning?: boolean;
};

const CardAgent = ({ id, clients, username, isRunning = false }: CardAgentType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(isRunning);
  const { toggleAgent } = useAgent();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleAgent(id);
      setIsActive(!isActive); // Update local state after successful toggle
      toast.success(`Agent ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling agent:', error);
      toast.error('Failed to toggle agent');
    } finally {
      setIsLoading(false);
    }
  };

  // Update local state when prop changes
  useEffect(() => {
    setIsActive(isRunning);
  }, [isRunning]);

  return (
    <Box maxWidth="100%">
      <Card className="shadow-lg">
        <Flex gap="3" align="center" justify="between">
          {/* Existing avatar and username section */}
          <Flex gap="3" align="center">
            <Avatar
              size="6"
              src="https://www.google.com.vn/url?sa=i&url=https%3A%2F%2Fwww.nuvei.com%2Fsolutions%2Fcrypto-digital-assets&psig=AOvVaw3QXrDhAZnhIMM4PcZEmm1n&ust=1736924649583000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDSx93S9IoDFQAAAAAdAAAAABAE"
              radius="large"
              fallback="T"
            />
            <Flex direction="column">
              <Link href={`/manageAI/update/${id}`}>
                <Text size="3" weight="medium">
                  {username}
                </Text>
              </Link>
            </Flex>
          </Flex>

          {/* Add toggle switch */}
          <Switch
            checked={isActive} // Use local state instead of prop
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            size="3"
            color="orange"
            radius="full"
          />
        </Flex>

        {/* Rest of your existing card content */}
        <Box className="mt-4 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg">
          <ul className="flex flex-col gap-4">
            <li className="flex justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./logos/x.png"
                  className="size-8 bg-black rounded-full"
                  alt=""
                />
                <Text size="2" weight="medium">
                  Connect X
                </Text>
              </div>
              <Button
                style={{ maxWidth: '80px', width: '100%' }}
                color="gray"
                variant="solid"
                highContrast
              >
                Connect
              </Button>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./logos/discord.png"
                  className="size-8 rounded-full"
                  alt=""
                />
                <Text size="2" weight="medium">
                  Connect Discord
                </Text>
              </div>
              <Button
                style={{ maxWidth: '80px', width: '100%' }}
                color="gray"
                variant="solid"
                highContrast
              >
                Connect
              </Button>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./logos/telegram.png"
                  className="size-8 rounded-full"
                  alt=""
                />
                <Text size="2" weight="medium">
                  Connect Telegram
                </Text>
              </div>
              <Button
                style={{ maxWidth: '80px', width: '100%' }}
                color="gray"
                variant="solid"
                highContrast
              >
                Connect
              </Button>
            </li>
            <li className="flex justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://eternalai.org/images/abilities/edit-personality.svg"
                  className="size-8 rounded-full"
                  alt=""
                />
                <Text size="2" weight="medium">
                  Edit Personality
                </Text>
              </div>
              <Link role="button" href={`/manageAI/update/${id}`}>
                <Button
                  style={{ maxWidth: '80px', width: '100%' }}
                  color="gray"
                  variant="solid"
                  highContrast
                >
                  Edit
                </Button>
              </Link>
            </li>
          </ul>
        </Box>
      </Card>
    </Box>
  );
};

export default CardAgent;
