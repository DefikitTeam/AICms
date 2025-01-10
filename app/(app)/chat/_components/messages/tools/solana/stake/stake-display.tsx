import React from 'react';

import { Button } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

import { useStake } from '@/app/(app)/chat/_hooks/tools/use-stake';

import type { StakeArgumentsType } from '@/ai';

import TokenDisplay from './token-display';

interface StakeDisplayProps {
    toolCallId: string;
    args: StakeArgumentsType;
    userPublicKey: string;
}

const StakeDisplay: React.FC<StakeDisplayProps> = ({ toolCallId, args, userPublicKey }) => {
    const { 
        isStaking, 
        onStake, 
        stakeData, 
        inputTokenData, 
        outputTokenData, 
        inputTokenDataLoading, 
        outputTokenDataLoading,
        onCancel
    } = useStake(toolCallId, args, userPublicKey);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                    <TokenDisplay 
                        tokenData={inputTokenData ?? null}
                        isLoading={inputTokenDataLoading}
                        amount={args.amount}
                    />
                    <ChevronRight className="size-4" />
                    <TokenDisplay 
                        tokenData={outputTokenData ?? null}
                        isLoading={outputTokenDataLoading}
                        amount={stakeData?.outAmount}
                        decimals={outputTokenData?.decimals}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Button 
                    variant="brand"
                    onClick={onStake} 
                    disabled={isStaking || !stakeData?.outAmount}
                    className="w-full"
                >
                    Stake
                </Button>
                <p className="text-sm text-muted-foreground">
                    or
                </p>
                <Button 
                    variant="ghost"
                    onClick={onCancel} 
                    className="w-full"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default StakeDisplay; 