import { TokenAccountsResponse } from "@/types";

export const getBalances = async (address: string): Promise<TokenAccountsResponse> => {
    const response = await fetch(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": "tokens-accounts",
            "method": "getTokenAccounts",
            "params": {
                "owner": address
            }
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch token accounts');
    }

    const data = await response.json();

    return data.result;
}