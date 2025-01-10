import { z } from "zod";

export const LendInputSchema = z.object({
    amount: z.number().positive().describe("The amount of USDC to lend. Must be a positive number."),
}); 