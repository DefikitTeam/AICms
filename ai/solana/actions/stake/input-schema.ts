import { z } from "zod";

export const StakeInputSchema = z.object({
    amount: z.number().positive().describe("The amount of SOL to stake. Must be a positive number."),
}); 