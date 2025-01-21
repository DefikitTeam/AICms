import { Avatar, Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { Bot } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export type CardAgentType = {
	id: string;
	clients: string[];
	username: string;
	bio: string;
	isRunning: boolean;
	email: string;
	modelProvider: string;
};

const CardAgent = ({
	id,
	clients,
	username,
	bio,
	isRunning,
	modelProvider,
	email,
}: CardAgentType) => {
	return (
		<Box maxWidth="100%">
			<Card className="shadow-lg">
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
						<ul className="flex gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
							<li className="flex gap-1 items-center">
								<Bot size={16} />
								<span>{modelProvider}</span>
							</li>
							<li className="flex gap-1 items-center"></li>
						</ul>
					</Flex>
				</Flex>
				<Text size="2" className="mt-4 block" weight="medium">
					{bio}
				</Text>
				<Box className="mt-4 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg">
					<ul className="flex flex-col gap-4">
						{!clients.includes('twitter') && (
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
						)}
						{!clients.includes('discord') && (
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
						)}
						{!clients.includes('telegram') && (
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
						)}
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
									style={{ width: '80px' }}
									color="gray"
									variant="solid"
									highContrast
								>
									Edit
								</Button>
							</Link>
						</li>
						{/* <li className="flex justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./logos/token.png"
                  className="size-8 rounded-full"
                  alt=""
                />
                <Text size="2" weight="medium">
                  Add Token
                </Text>
              </div>
              <Button
                style={{ maxWidth: "80px", width: "100%" }}
                color="gray"
                variant="solid"
                highContrast
              >
                Add
              </Button>
            </li> */}
					</ul>
				</Box>
			</Card>
		</Box>
	);
};

export default CardAgent;
