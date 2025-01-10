import React from 'react';

import LoginButton from '@/app/(app)/_components/log-in-button';

import StakeDisplay from './stake-display';

import { useLogin } from '@/hooks';

import type { StakeArgumentsType } from '@/ai';


interface StakeCallBodyProps {
    toolCallId: string;
    args: StakeArgumentsType;
}

const StakeCallBody = ({ toolCallId, args }: StakeCallBodyProps) => {
    
    const { wallets } = useLogin();

    return (
        <div>
            {
                wallets.length ? (
                    <StakeDisplay toolCallId={toolCallId} args={args} userPublicKey={wallets[0].address} />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-muted-foreground">Connect your wallet to stake tokens</p>
                        <LoginButton />
                    </div>
                )
            }
        </div>
    );
};

export default StakeCallBody; 