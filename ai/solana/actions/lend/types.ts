import { z } from "zod";
import { LendInputSchema } from "./input-schema";
import { SolanaActionResult } from "../solana-action";

export type LendSchemaType = typeof LendInputSchema;

export type LendArgumentsType = z.infer<LendSchemaType>;

export type LendResultBodyType = {
    tx: string;
} 

export type LendResultType = SolanaActionResult<LendResultBodyType>;