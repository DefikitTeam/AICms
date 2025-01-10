import { getPrice } from "@/lib/solana";

import type { GetTrendingTokensArgumentsType, GetTrendingTokensResultBodyType } from "./types";
import type { SolanaActionResult } from "../solana-action";
import type { SolanaToken } from "@/types";

/**
 * Gets the trending tokens from Jupiter API using the birdeye-trending tag.
 *
 * @param solanaKit - The Solana agent kit instance
 * @param args - The input arguments for the action
 * @returns A message containing the trending tokens information
 */
export async function getTrendingTokens(
  args: GetTrendingTokensArgumentsType
): Promise<SolanaActionResult<GetTrendingTokensResultBodyType>> {
  try {
    const response = await fetch('https://tokens.jup.ag/tokens?tags=birdeye-trending');
    if (!response.ok) {
      throw new Error('Failed to fetch trending tokens');
    }

    let tokens: SolanaToken[] = await response.json();

    if (args.limit && args.limit > 0) {
      tokens = tokens.slice(0, args.limit);
    }

    const prices = await Promise.all(tokens.map(async (token) => {
      const price = await getPrice(token.address);
      return Number(price.priceInUSDC ?? "0");
    }));

    return {
      message: `Found ${tokens.length} trending tokens. The user is shown the tokens, do not list them. Ask the user what they want to do with the coin.`,
      body: {
        tokens,
        prices
      }
    };
  } catch (error) {
    return {
      message: `Error getting trending tokens: ${error}`,
      body: {
        tokens: [],
        prices: []
      }
    };
  }
}
