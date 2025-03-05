'use client'

import React from 'react'
import { ChevronsUpDown, Coins, LogIn, LogOut, Wallet } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem,
    useSidebar,
    Skeleton,
} from '@/components/ui';

import { truncateAddress } from '@/lib/wallet';
import Balances from './balances';

const AuthButton: React.FC = () => {
    const { address, isConnecting } = useAccount();
    const { disconnect } = useDisconnect();
    const { openConnectModal } = useConnectModal();
    const { isMobile } = useSidebar();

    // Fund wallet function - implement according to your requirements
    const fundWallet = (walletAddress: string, options: { amount: string }) => {
        console.log(`Funding wallet ${walletAddress} with ${options.amount} ETH`);
        // Implement your funding logic here
    };

    if (isConnecting) return <Skeleton className="w-full h-8" />;

    if (!address) return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    variant="brandOutline"
                    onClick={() => openConnectModal?.()}
                    className="w-full justify-center gap-0"
                >
                    <LogIn className="h-4 w-4" />
                    <span className="ml-2">
                        Log in
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            variant="brandOutline"
                        >
                            <Wallet className="size-8" />
                            <span className="ml-2">
                                {truncateAddress(address)}
                            </span>
                        <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-80 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Wallet className="size-4" />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{truncateAddress(address)}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Balances address={address} />
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => fundWallet(address, { amount: "0.01" })}>
                                <Coins className="size-4" />
                                Fund Wallet
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => disconnect()}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default AuthButton;