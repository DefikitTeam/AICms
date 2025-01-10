import React from 'react';

import { Button } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

import { useSwap } from '@/app/(app)/chat/_hooks/tools/use-swap';

import TokenDisplay from './token-display';

import type { SolanaTradeArgumentsType } from '@/ai';

interface SwapDisplayProps {
    toolCallId: string;
    args: SolanaTradeArgumentsType;
    userPublicKey: string;
}

const SwapDisplay = ({ toolCallId, args, userPublicKey }: SwapDisplayProps) => {
    const { 
        isSwapping, 
        onSwap, 
        swapData, 
        inputTokenData, 
        outputTokenData, 
        inputTokenDataLoading, 
        outputTokenDataLoading,
        onCancel
    } = useSwap(toolCallId, args, userPublicKey);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                    <TokenDisplay 
                        tokenData={inputTokenData ?? null}
                        isLoading={inputTokenDataLoading}
                        amount={args.inputAmount}
                    />
                    <ChevronRight className="size-4" />
                    <TokenDisplay 
                        tokenData={outputTokenData ?? null}
                        isLoading={outputTokenDataLoading}
                        amount={swapData?.outAmount}
                        decimals={outputTokenData?.decimals}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Button 
                    variant="brand"
                    onClick={onSwap} 
                    disabled={isSwapping || !swapData?.outAmount}
                    className="w-full"
                >
                    Swap
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

export default SwapDisplay; 