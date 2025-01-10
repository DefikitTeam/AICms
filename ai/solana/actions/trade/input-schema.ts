import { z } from "zod";

export const TradeInputSchema = z.object({
    outputMint: z.string().describe("The mint address of the token to receive"),
    inputAmount: z.number().positive().describe("The amount of input token to swap"),
    inputMint: z.string().optional().describe("The mint address of the token to swap. If not provided, uses SOL"),
    slippageBps: z.number().default(500).describe("The slippage tolerance in basis points (e.g., 100 for 1%)"),
}); 