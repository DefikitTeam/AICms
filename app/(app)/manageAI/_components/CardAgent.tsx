import { Avatar, Badge, Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { Bot } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export type CardAgentType = {
	id: string;
	clients: string[];
	name: string;
	bio: string;
	status: boolean;
	modelProvider: string;
};

const CardAgent = ({
	id,
	clients,
	name,
	bio,
	status,
	modelProvider,
}: CardAgentType) => {
	return (
		<Box maxWidth="100%">
			<Card className="shadow-lg">
				<Flex gap="3" align="center">
					<Avatar
						size="6"
						src={`https://ui-avatars.com/api/?name=${name}&background=random`}
						radius="large"
						fallback="T"
					/>
					<Flex direction="column">
						<Link href={`/manageAI/update/${id}`}>
							<Text size="3" weight="medium">
								{name}
							</Text>
						</Link>
						<ul className="flex gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
							<li className="flex gap-1 items-center">
								<Bot size={16} />
								<span>{modelProvider}</span>
							</li>
							<li className="flex gap-1 items-center">
								<Badge color={status ? 'green' : 'red'}>
									{status ? 'Running' : 'Stopped'}
								</Badge>
							</li>
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
								<Link role="button" href={`/manageAI/update/${id}`}>
									<Button
										style={{ maxWidth: '80px', width: '100%' }}
										color="gray"
										variant="solid"
										highContrast
									>
										Connect
									</Button>
								</Link>
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
								<Link role="button" href={`/manageAI/update/${id}`}>
									<Button
										style={{ maxWidth: '80px', width: '100%' }}
										color="gray"
										variant="solid"
										highContrast
									>
										Connect
									</Button>
								</Link>
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
								<Link role="button" href={`/manageAI/update/${id}`}>
									<Button
										style={{ maxWidth: '80px', width: '100%' }}
										color="gray"
										variant="solid"
										highContrast
									>
										Connect
									</Button>
								</Link>
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
