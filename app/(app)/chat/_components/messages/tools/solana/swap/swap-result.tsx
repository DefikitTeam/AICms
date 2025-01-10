import React from 'react';

import type { SolanaTradeResultBodyType } from '@/ai';

interface Props {
    tradeResult: SolanaTradeResultBodyType;
}

const SwapResult: React.FC<Props> = ({ tradeResult }) => {

    return (
        <p className="text-xs text-muted-foreground">
            Swapped {tradeResult.inputAmount} {tradeResult.inputToken} for {tradeResult.outputToken}
        </p>
    );
};

export default SwapResult; 