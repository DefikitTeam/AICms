import React from 'react'

import StarterButton from './starter-button';

const starterButtons = [
    {
        title: "Trending",
        description: "Search the trending tokens",
        icon: "Coins" as const,
        prompt: "Show me the trending tokens"
    }, 
    {
        title: "Stake",
        description: "Stake Sol for JupSOL",
        icon: "Coins" as const,
        prompt: "Stake some of your SOL"
    },
    {
        title: "Trade",
        description: "Swap on Jupiter",
        icon: "ChartCandlestick" as const,
        prompt: "Let's trade some tokens"
    },
    {
        title: "Search X",
        description: "Query social media",
        icon: "Search" as const,
        prompt: "Let's search X"
    }
] as const

const StarterButtons = () => {
    return (
        <div className="grid grid-cols-2 gap-2">
            {starterButtons.map((button) => (
                <StarterButton 
                    key={button.title} 
                    {...button}
                />
            ))}
        </div>
    )
}

export default StarterButtons