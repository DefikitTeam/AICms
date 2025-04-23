'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	Logo,
} from '@/components/ui';

import LoginButton from '@/app/_components/login-button';
import { useExperimentalConfirmed } from '../_hooks';
import { isPublicRoute } from '@/app/config/public-routes';

const NotLoggedInAlert: React.FC = () => {
	const { ready, user } = usePrivy();
	const pathname = usePathname();
	const { confirmed } = useExperimentalConfirmed();

	// Check if current route is public
	const isPublic = isPublicRoute(pathname);

	return (
		<AlertDialog open={ready && !user && confirmed && !isPublic}>
			<AlertDialogHeader className="hidden">
				<AlertDialogTitle>You are not logged in</AlertDialogTitle>
				<AlertDialogDescription>
					Please login to continue
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogContent className="flex flex-col items-center justify-center">
				<Logo className="w-16 h-16" />
				<h1 className="text-2xl font-bold">You are not logged in</h1>
				<p className="text-sm text-gray-500">Please login to continue</p>
				<LoginButton />
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default NotLoggedInAlert;
