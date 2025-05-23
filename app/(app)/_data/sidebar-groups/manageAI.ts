import { SidebarGroup } from '../../_types/sidebar';

export const manageAIGroup: SidebarGroup = {
	label: 'Manage AI',
	items: [
		{
			icon: 'Bot',
			label: 'Manage Agents',
			href: '/manageAI',
		},
		{
			icon: 'BotMessageSquare',
			label: 'Public Agent',
			href: '/publicAgents',
		},
	],
};
