import React from 'react';

import ToolCard from '../../tool-card';

import SwapCard from './swap-result';
import SwapCallBody from './swap-call-body';

import type { ToolInvocation } from 'ai';
import type { SolanaTradeResultType, SolanaTradeArgumentsType } from '@/ai';

interface SwapProps {
    tool: ToolInvocation;
}

const Swap: React.FC<SwapProps> = ({ tool }) => {
    return (
        <ToolCard 
            tool={tool}
            icon="ArrowLeftRight"
            agentName="Trading Agent"
            loadingText="Completing Trade..."
            resultHeading={(result: SolanaTradeResultType) => result.body 
                ? "Trade Complete"
                : "Failed to complete trade"}
            resultBody={(result: SolanaTradeResultType) => result.body 
                ? <SwapCard tradeResult={result.body} />
                : result.message}
            callBody={(toolCallId: string, args: SolanaTradeArgumentsType) => (
                <SwapCallBody toolCallId={toolCallId} args={args} />
            )}
            defaultOpen={true}
        />
    );
};

export default Swap; 