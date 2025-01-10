import React from 'react';

import LogInButton from '@/app/(app)/_components/log-in-button';

import UnstakeDisplay from './unstake-display';

import { useLogin } from '@/hooks';

import type { UnstakeArgumentsType } from '@/ai';

interface UnstakeCallBodyProps {
    toolCallId: string;
    args: UnstakeArgumentsType;
}

const UnstakeCallBody = ({ toolCallId, args }: UnstakeCallBodyProps) => {
    const { wallets } = useLogin();

    return (
        <div>
            {
                wallets.length ? (
                    <UnstakeDisplay toolCallId={toolCallId} args={args} userPublicKey={wallets[0].address} />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-muted-foreground">Connect your wallet to unstake</p>
                        <LogInButton />
                    </div>
                )
            }
        </div>
    );
};

export default UnstakeCallBody; 