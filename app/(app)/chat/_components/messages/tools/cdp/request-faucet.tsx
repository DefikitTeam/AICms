import React from 'react'

import ToolCard from '../tool-card';

import type { ToolInvocation } from 'ai';
import type { RequestFaucetFundsActionResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const RequestFaucet: React.FC<Props> = ({ tool }) => {

    return (
        <ToolCard
            tool={tool}
            agentName="Faucet Agent"
            icon="Droplet"
            loadingText="Requesting Faucet Funds..."
            resultHeading={() => "Received Faucet Funds"}
            resultBody={(result: RequestFaucetFundsActionResultType) => result.body 
                ? `[Transaction Link](${result.body.transactionLink})` 
                : result.message}
        />
    )
}

export default RequestFaucet;