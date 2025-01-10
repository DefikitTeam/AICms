import React, { useEffect } from 'react'

import LoginButton from '@/app/(app)/_components/log-in-button';

import ToolCard from '../tool-card';

import { useSolanaWallets, Wallet } from '@privy-io/react-auth';

import { useChat } from '@/app/(app)/chat/_contexts/chat';

import type { ToolInvocation } from 'ai';
import type { GetWalletAddressResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const GetWalletAddress: React.FC<Props> = ({ tool }) => {

    return (
        <ToolCard 
            tool={tool}
            icon="Wallet"
            agentName="Wallet Agent"
            loadingText={`Getting Wallet Address...`}   
            resultHeading={() => `Fetched Wallet Address`}
            resultBody={(result: GetWalletAddressResultType) => result.body 
                ? `${result.body.address}` 
                :  "No wallet address found"}
            callBody={(toolCallId: string) => <GetWalletAddressAction toolCallId={toolCallId} />}
        />
    )
}

const GetWalletAddressAction = ({ toolCallId }: { toolCallId: string }) => {

    const { addToolResult } = useChat();

    const { wallets } = useSolanaWallets();

    useEffect(() => {
        if(wallets.length) {
            addToolResult(toolCallId, {
                message: "Wallet connected",
                body: {
                    address: wallets[0].address
                }
            });
        }
    }, [wallets]);

    const onComplete = (wallet: Wallet) => {
        addToolResult(toolCallId, {
            message: "Wallet connected",
            body: {
                address: wallet.address
            }
        });
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Connect your wallet to proceed</p>
            <LoginButton onComplete={onComplete} />
        </div>
    )
}

export default GetWalletAddress;