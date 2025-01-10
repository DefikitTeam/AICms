import { SOLANA_LEND_NAME } from "./name";
import { SOLANA_LEND_PROMPT } from "./prompt";
import { LendInputSchema } from "./input-schema";

import type { LendResultBodyType } from "./types";
import type { SolanaAction } from "../solana-action";

export class SolanaLendAction implements SolanaAction<typeof LendInputSchema, LendResultBodyType> {
  public name = SOLANA_LEND_NAME;
  public description = SOLANA_LEND_PROMPT;
  public argsSchema = LendInputSchema;
} 