import React from 'react'

import ToolCard from '../tool-card';

import type { ToolInvocation } from 'ai';
import type { RegisterBasenameActionResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const RegisterBasename: React.FC<Props> = ({ tool }) => {

    return (
        <ToolCard
            tool={tool}
            agentName="Basename Agent"
            icon="Globe"
            loadingText="Registering Basename..."
            resultHeading={() => "Basename Registered"}
            resultBody={(result: RegisterBasenameActionResultType) => result.body 
                ? result.body.basename
                : result.message}
        />
    )
}

export default RegisterBasename;