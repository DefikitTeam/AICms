import React from 'react'

import { 
    AnimatedShinyText, 
    Card, 
    Collapsible, 
    CollapsibleTrigger, 
    CollapsibleContent, 
    Icon 
} from '@/components/ui'

import { cn } from '@/lib/utils'

import type { ToolInvocation } from 'ai'
import type { IconName } from '@/types'
import type { BaseActionResult } from '@/ai'

interface Props<ActionResultBodyType, ActionArgsType> {
    tool: ToolInvocation,
    icon: IconName,
    loadingText: string,
    resultHeading: (result: BaseActionResult<ActionResultBodyType>) => string,
    resultBody: (result: BaseActionResult<ActionResultBodyType>) => React.ReactNode,
    agentName: string,
    callBody?: (toolCallId: string, args: ActionArgsType) => React.ReactNode,
    defaultOpen?: boolean,
    className?: string,
}

const ToolCard = <ActionResultBodyType, ActionArgsType>({ tool, icon, loadingText, resultHeading, resultBody, agentName, callBody, defaultOpen = true, className }: Props<ActionResultBodyType, ActionArgsType>) => {
    
    return (
        <Card className={cn(
            "flex flex-col gap-2 p-2 w-fit",
            tool.state === "result"
                ? (tool.result.body 
                    ? "border-brand-600/50 dark:border-brand-400/50"
                    : "border-red-500 dark:border-red-400")
                : "border-neutral-500 dark:border-neutral-400",
            className
        )}>
            <div className="flex items-center gap-2">
                <Icon name={icon} className="w-4 h-4" />
                <p className="text-lg font-bold">{agentName}</p>
            </div>
            {
                tool.state === "partial-call" ? (
                    <AnimatedShinyText>
                        {loadingText}
                    </AnimatedShinyText>
                ) : (
                    tool.state === "call" ? (
                        callBody ? callBody(tool.toolCallId, tool.args) : (
                            <AnimatedShinyText>
                            {loadingText}
                        </AnimatedShinyText>
                        )
                    ) : (
                        <Collapsible defaultOpen={defaultOpen}>
                            <CollapsibleTrigger className="flex items-center gap-2">
                                    <p className="">{resultHeading(tool.result)}</p>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="text-sm">
                                {resultBody(tool.result)}
                            </CollapsibleContent>
                        </Collapsible>
                    )
                )
            }
        </Card>
    )
}

export default ToolCard