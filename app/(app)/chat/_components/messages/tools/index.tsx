'use client'

import React from 'react'

import {
    Balance,
    GetWalletAddress,
    GetTrendingTokens,
    GetTokenData,
    Trade,
    Stake,
    Unstake,
    AllBalances,
    Lend
} from './solana'

import { SearchRecentTweets } from './twitter'

import { SearchKnowledge } from './knowledge'

import { 
    SOLANA_BALANCE_NAME,
    SOLANA_GET_WALLET_ADDRESS_NAME,
    SOLANA_GET_TRENDING_TOKENS_NAME,
    SOLANA_GET_TOKEN_DATA_NAME,
    SOLANA_TRADE_NAME,
    SOLANA_LEND_NAME,
    SOLANA_STAKE_NAME,
    SOLANA_UNSTAKE_NAME,
    SOLANA_ALL_BALANCES_NAME,
    TWITTER_SEARCH_RECENT_NAME,
    SEARCH_KNOWLEDGE_NAME
} from '@/ai/action-names'

import type { ToolInvocation as ToolInvocationType } from 'ai'

interface Props {
    tool: ToolInvocationType
}

const ToolInvocation: React.FC<Props> = ({ tool }) => {
    
    switch(tool.toolName) {
        case SOLANA_BALANCE_NAME:
            return <Balance tool={tool} />
        case SOLANA_GET_WALLET_ADDRESS_NAME:
            return <GetWalletAddress tool={tool} />
        case SOLANA_GET_TRENDING_TOKENS_NAME:
            return <GetTrendingTokens tool={tool} />
        case SOLANA_GET_TOKEN_DATA_NAME:
            return <GetTokenData tool={tool} />
        case SOLANA_TRADE_NAME:
            return <Trade tool={tool} />
        case TWITTER_SEARCH_RECENT_NAME:
            return <SearchRecentTweets tool={tool} />
        case SOLANA_LEND_NAME:
            return <Lend tool={tool} />
        case SOLANA_STAKE_NAME:
            return <Stake tool={tool} />
        case SOLANA_UNSTAKE_NAME:
            return <Unstake tool={tool} />
        case SOLANA_ALL_BALANCES_NAME:
            return <AllBalances tool={tool} />
        case SEARCH_KNOWLEDGE_NAME:
            return <SearchKnowledge tool={tool} />
        default:
            return (
                <pre className="whitespace-pre-wrap">
                    {JSON.stringify(tool, null, 2)}
                </pre>
            );
    }
}

export default ToolInvocation