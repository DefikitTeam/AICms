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
			icon: 'Bot',
			label: 'Public Agent',
			href: '/publicAgents',
		},
	],
};
