'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import '@radix-ui/themes/styles.css';
import ExperimentalAlertDialog from './_components/experimental-alert-dialog';
import Sidebar from './_components/sidebar';
import { SidebarProvider } from '@/components/ui';
import { isPublicRoute } from '@/app/config/public-routes';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const isPublic = isPublicRoute(pathname);

  // Render without sidebar for public routes
  if (isPublic) {
    return <div className="w-full h-full">{children}</div>;
  }

  // Regular layout with sidebar for protected routes
  return (
    <SidebarProvider>
      <ExperimentalAlertDialog />
      <Sidebar>{children}</Sidebar>
    </SidebarProvider>
  );
};

export default Layout;
