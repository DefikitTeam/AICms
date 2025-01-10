import React from 'react'

import ToolCard from '../tool-card';

import type { ToolInvocation } from 'ai';
import type { SearchKnowledgeResultType } from '@/ai';

interface Props {
    tool: ToolInvocation
}

const SearchKnowledge: React.FC<Props> = ({ tool }) => {
    

    return (
        <ToolCard 
            tool={tool}
            agentName="Knowledge Agent"
            icon="Brain"
            loadingText={`Searching Knowledge...`}
            resultHeading={(result: SearchKnowledgeResultType) => result.body?.knowledge ? `Searched knowledge base` : `Failed to fetch knowledge`}
            resultBody={(result: SearchKnowledgeResultType) => result.body 
                ? `Included the top ${result.body.knowledge.length} pages in context.`
                :  "No knowledge found"
            }
            defaultOpen={false}
        />
    )
}

export default SearchKnowledge;