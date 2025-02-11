import React from 'react';

import { SidebarProvider } from '@/components/ui';

import Sidebar from './_components/sidebar';
import ExperimentalAlertDialog from './_components/experimental-alert-dialog';

import { ChatProvider } from './chat/_contexts/chat';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

interface Props {
	children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<Theme>
			<SidebarProvider>
				<ExperimentalAlertDialog />
				<ChatProvider>
					<Sidebar>{children}</Sidebar>
				</ChatProvider>
			</SidebarProvider>
		</Theme>
	);
};

export default Layout;
