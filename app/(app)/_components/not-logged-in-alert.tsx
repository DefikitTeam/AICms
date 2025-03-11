'use client';

import React, { useEffect, useState } from 'react';

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

const NotLoggedInAlert: React.FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { confirmed } = useExperimentalConfirmed();

	// Check if user has a valid JWT token
	useEffect(() => {
		// Initial check
		checkAuthentication();

		// Set up event listener for storage changes
		window.addEventListener('storage', handleStorageChange);

		// Check authentication every minute to handle token expiration
		const intervalId = setInterval(checkAuthentication, 60000);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			clearInterval(intervalId);
		};
	}, []);

	// Check if token exists and is not expired
	const checkAuthentication = () => {
		const token = localStorage.getItem('jwt_access_token');
		const expirationTime = localStorage.getItem('jwt_expiration_time');
		
		let isValid = false;
		
		if (token && expirationTime) {
			// If expiration time exists, check if token is still valid
			isValid = parseInt(expirationTime) > Date.now();
			
			// Clear expired tokens
			if (!isValid) {
				localStorage.removeItem('jwt_access_token');
				localStorage.removeItem('jwt_expiration_time');
			}
		} else if (token) {
			// For backward compatibility, if token exists but no expiration time
			isValid = true;
		}
		
		setIsAuthenticated(isValid);
	};

	// Handle localStorage changes
	const handleStorageChange = (event: StorageEvent) => {
		if (event.key === 'jwt_access_token' || event.key === 'jwt_expiration_time') {
			checkAuthentication();
		}
	};

	// Show alert when user is not authenticated (no token) and has confirmed experimental features
	return (
		<AlertDialog open={!isAuthenticated && confirmed}>
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
