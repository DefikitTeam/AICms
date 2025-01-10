import React from 'react'

import ToolCard from '../tool-card';

import type { ToolInvocation } from 'ai';
import type { GetBalanceActionResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const GetBalance: React.FC<Props> = ({ tool }) => {
    

    return (
        <ToolCard 
            tool={tool}
            agentName="Token Agent"
            icon="HandCoins"
            loadingText={`Getting ${tool.args.assetId} Balance...`}
            resultHeading={() => `Read ${tool.args.assetId.toUpperCase()} Balance`}
            resultBody={(result: GetBalanceActionResultType) => result.body 
                ? `${result.body.balance.toFixed(4)} ${tool.args.assetId.toUpperCase()}` 
                :  "No balance found"}
        />
    )
}

export default GetBalance;