import React from 'react';

import {
	Sidebar as SidebarUI,
	SidebarHeader,
	SidebarContent,
	SidebarInset,
	SidebarTrigger,
	Separator,
} from '@/components/ui';

import SidebarGroup from './group';

import { platformGroup, agentsGroup } from '../../_data';

import AuthButton from './auth-button';
import ColorModeToggle from './color-mode-toggle';
import Logo from './logo';
import ChatsGroup from './chats-group';
import { manageAIGroup } from '../../_data/sidebar-groups/manageAI';
import { Button } from '@radix-ui/themes';
import { BrainCog } from 'lucide-react';
import Link from 'next/link';

interface Props {
	children: React.ReactNode;
}

const Sidebar: React.FC<Props> = ({ children }) => {
	return (
		<>
			<SidebarUI variant="inset" collapsible="icon">
				<SidebarHeader>
					<Logo />
					<AuthButton />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup group={manageAIGroup} />
					<ChatsGroup />
					<SidebarGroup group={platformGroup} />
					<SidebarGroup group={agentsGroup} />
				</SidebarContent>
			</SidebarUI>
			<SidebarInset>
				<header className="flex items-center justify-between p-2 border-b border-neutral-200 dark:border-neutral-800">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<Separator orientation="vertical" className="h-4" />
					</div>
					<div className="flex gap-2">
						<Link href="/manageAI">
							<Button
								variant="surface"
								className="flex items-center gap-2"
								color="gray"
							>
								<BrainCog size={16} />
								Your Agent
								<div className="border-brand-600 rounded-full bg-brand-600 text-white size-5">
									3
								</div>
							</Button>
						</Link>
						<ColorModeToggle />
					</div>
				</header>
				<div className="p-4 flex-1 h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
					{children}
				</div>
			</SidebarInset>
		</>
	);
};

export default Sidebar;
