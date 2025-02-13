import React from 'react'

import { SidebarProvider } from '@/components/ui';

import Sidebar from './_components/sidebar';
import ExperimentalAlertDialog from './_components/experimental-alert-dialog';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

interface Props {
	children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<Theme>
			<SidebarProvider>
				<ExperimentalAlertDialog />
				<Sidebar>{children}</Sidebar>
			</SidebarProvider>
		</Theme>
	);
};

export default Layout;