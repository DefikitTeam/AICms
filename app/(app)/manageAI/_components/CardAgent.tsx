import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, Badge, Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { BookOpen, Bot } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export type CardAgentType = {
	id: string;
	clients: string[];
	name: string;
	bio: string;
	status: boolean;
	modelProvider: string;
	modules?: {
		education?: boolean;
	};
};

const CardAgent = ({
	id,
	clients,
	name,
	bio,
	status,
	modelProvider,
	modules = {},
}: CardAgentType) => {
	// State to control whether to show education module
	const [showEducationModule, setShowEducationModule] = useState(false);
	
	// Read from localStorage on component mount
	useEffect(() => {
		if (typeof window !== 'undefined' && id) {
			const savedStatus = localStorage.getItem(`educationModuleEnabled_${id}`);
			console.log(`Reading education module status from localStorage for agent ${id} (${name}):`, savedStatus);
			
			// Only show if explicitly set to 'true'
			setShowEducationModule(savedStatus === 'true');
		}
	}, [id, name]);

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
								<div className="flex items-center gap-3">
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
								<div className="flex items-center gap-3">
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
						<li className="flex justify-between">
							<div className="flex items-center gap-3">
								<img
									src="/logo-light.png"
									className="size-8 rounded-full"
									alt=""
								/>
								<Text size="2" weight="medium">
									Embed Agent
								</Text>
							</div>
							{status ? (
								<Link role="button" href={`/plugins?agentId=${id}`}>
									<Button
										style={{ width: '80px' }}
										color="gray"
										variant="solid"
										highContrast
									>
										Embed
									</Button>
								</Link>
							) : (
								<TooltipProvider delayDuration={0}>
									<Tooltip>
										<TooltipTrigger>
											<Button
												style={{ width: '80px' }}
												color="gray"
												disabled
												highContrast
											>
												Embed
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											Your agent must be toggled on to use this feature
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</li>
						{!clients.includes('telegram') && (
							<li className="flex justify-between">
								<div className="flex items-center gap-3">
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
						
						{/* Education Module - only shown if enabled in localStorage */}
						{showEducationModule && (
							<li className="flex justify-between">
								<div className="flex items-center gap-3">
									<Box className="size-8 rounded-full bg-blue-400 flex items-center justify-center">
										<BookOpen size={16} color="currentColor" />
									</Box>
									<Text size="2" weight="medium">
										Education Module
									</Text>
								</div>
								<Link role="button" href={`/education?agentId=${id}`}>
									<Button
										style={{ width: '80px' }}
										color="gray"
										variant="solid"
										highContrast
									>
										Access
									</Button>
								</Link>
							</li>
						)}
						
						<li className="flex justify-between">
							<div className="flex items-center gap-3">
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
						<li className="flex justify-between">
							<div className="flex items-center gap-2">
								<img
									src="/icons/feed-data.svg"
									className="size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 p-1"
									alt=""
								/>
								<Text size="2" weight="medium">
									Feed Data
								</Text>
							</div>
							<Link role="button" href={`/manageAI/feed/${id}?name=${encodeURIComponent(name)}`}>
								<Button
									style={{ width: '80px' }}
									color="gray"
									variant="solid"
									highContrast
								>
									Feed
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
