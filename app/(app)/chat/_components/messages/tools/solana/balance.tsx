import React from 'react'

import ToolCard from '../tool-card';

import type { ToolInvocation } from 'ai';
import type { BalanceResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const GetBalance: React.FC<Props> = ({ tool }) => {
    

    return (
        <ToolCard 
            tool={tool}
            agentName="Wallet Agent"
            icon="Wallet"
            loadingText={`Getting ${tool.args.tokenAddress || "SOL"} Balance...`}
            resultHeading={(result: BalanceResultType) => result.body?.token ? `Fetched ${result.body.token} Balance` : `Failed to fetch balance`}
            resultBody={(result: BalanceResultType) => result.body 
                ? (
                    <div className="flex flex-row items-center gap-2">
                        <img src={result.body.logoURI} alt={result.body.name} className="w-8 h-8 rounded-full" />
                        <p>{result.body.balance.toFixed(4)} {result.body.name} ({result.body.token})</p>
                    </div>
                )
                :  "No balance found"}
        />
    )
}

export default GetBalance;