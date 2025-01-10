export interface TokenAccount {
    address: string;
    mint: string;
    owner: string;
    amount: number;
    delegated_amount: number;
    frozen: boolean;
}

export interface TokenAccountsResponse {
    total: number;
    limit: number;
    cursor: string;
    token_accounts: TokenAccount[];
}