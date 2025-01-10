export const SOLANA_TRADE_PROMPT = `Swap tokens using Jupiter Exchange.

Required parameters:
- outputMint: The mint address of the token to receive (e.g., "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" for USDC)
- inputAmount: The amount of input token to swap (e.g., 1 or 0.01)

Optional parameters:
- inputMint: The mint address of the token to swap (defaults to SOL)
- slippageBps: The slippage tolerance in basis points (e.g., 100 for 1%)`; 