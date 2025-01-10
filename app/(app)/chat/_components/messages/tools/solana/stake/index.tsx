import React from 'react';


import ToolCard from '../../tool-card';

import StakeCallBody from './stake-call-body';
import StakeResult from './stake-result';

import type { StakeResultType, StakeArgumentsType } from '@/ai';
import type { ToolInvocation } from 'ai';

interface Props {
    tool: ToolInvocation;
}

const Stake: React.FC<Props> = ({ tool }) => {
    return (
        <ToolCard 
            tool={tool}
            icon="Beef"
            agentName="Staking Agent"
            loadingText="Staking..."
            resultHeading={(result: StakeResultType) => result.body 
                ? "Stake Complete"
                : "Failed to Stake"}
            resultBody={(result: StakeResultType) => result.body 
                ? <StakeResult amount={tool.args.amount} stakeResult={result.body} />
                : result.message}
            callBody={(toolCallId: string, args: StakeArgumentsType) => (
                <StakeCallBody toolCallId={toolCallId} args={args} />
            )}
            defaultOpen={true}
        />
    );
};

export default Stake; 