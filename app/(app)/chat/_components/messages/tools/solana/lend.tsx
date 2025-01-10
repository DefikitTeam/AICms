import React from 'react'

import ToolCard from '../tool-card';

import type { ToolInvocation } from 'ai';
import type { LendResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const Lend: React.FC<Props> = ({ tool }) => {

    return (
        <ToolCard 
            tool={tool}
            icon="Coins"
            agentName="Lending Agent"
            loadingText={`Lending USDC...`}
            resultHeading={(result: LendResultType) => result.body 
                ? `Lent USDC on Lulo`
                :  "Failed to lend USDC"}
            resultBody={(result: LendResultType) => result.body 
                ? <LendCard amount={tool.args.amount} />
                :  "No token data found"}
            defaultOpen={true}
        />
    )
}

const LendCard = ({ amount }: { amount: number}) => {
    return (
        <p>
            Successfully lent ${amount} USDC on Lulo.
        </p>
    )
}

export default Lend;