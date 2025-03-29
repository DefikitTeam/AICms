import React from 'react';


import '@radix-ui/themes/styles.css';
import ExperimentalAlertDialog from './_components/experimental-alert-dialog';
import Sidebar from './_components/sidebar';
import { SidebarProvider } from '@/components/ui';

interface Props {
	children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <ExperimentalAlertDialog />
      <Sidebar>{children}</Sidebar>
    </SidebarProvider>
	);
};

export default Layout;
