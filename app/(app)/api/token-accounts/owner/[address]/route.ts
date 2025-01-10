import { NextResponse } from 'next/server';

import { getTokenDataByAddress, getBalances } from '@/lib/solana';

export const GET = async (request: Request, { params }: { params: Promise<{ address: string }> }) => {
    try {
        const { address } = await params;

        const tokenAccounts = await getBalances(address);

        const tokenDatas = await Promise.all(tokenAccounts.token_accounts.map(async (tokenAccount) => {
            return getTokenDataByAddress(tokenAccount.mint);
        }));

        return NextResponse.json(tokenAccounts.token_accounts.map((tokenAccount, index) => {
            return {
                ...tokenAccount,
                token_data: tokenDatas[index]
            };
        }));
    } catch (error) {
        console.error('Error fetching token accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch token accounts' },
            { status: 500 }
        );
    }
}