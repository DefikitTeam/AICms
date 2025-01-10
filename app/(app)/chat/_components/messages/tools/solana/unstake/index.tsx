import React from 'react';

import ToolCard from '../../tool-card';

import UnstakeCallBody from './unstake-call-body';
import UnstakeResult from './unstake-result';

import type { ToolInvocation } from 'ai';
import type { StakeResultType, UnstakeResultType, UnstakeArgumentsType } from '@/ai';


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
            resultBody={(result: UnstakeResultType) => result.body 
                ? <UnstakeResult amount={tool.args.amount} unstakeResult={result.body} />
                : result.message}
            callBody={(toolCallId: string, args: UnstakeArgumentsType) => (
                <UnstakeCallBody toolCallId={toolCallId} args={args} />
            )}
            defaultOpen={true}
        />
    );
};

export default Stake; 