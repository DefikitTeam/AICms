import { NextRequest, NextResponse } from "next/server";

import { PublicKey } from "@solana/web3.js";

import { JUP_API, getTokenDataByAddress } from "@/lib/solana";

export const POST = async (req: NextRequest) => {
    const { outputMint, inputMint, inputAmount, slippageBps, userPublicKey } = await req.json();

    const outputMintPk = new PublicKey(outputMint);
    const inputMintPk = inputMint ? new PublicKey(inputMint) : new PublicKey("So11111111111111111111111111111111111111112");
        
    const inputMintDecimals = await getTokenDataByAddress(inputMintPk.toString());
    if (!inputMintDecimals) throw new Error("Input mint not found");

    const quoteResponse = await (
        await fetch(
            `${JUP_API}/quote?` +
            `inputMint=${inputMintPk.toString()}` +
            `&outputMint=${outputMintPk.toString()}` +
            `&amount=${inputAmount * (10 ** inputMintDecimals.decimals)}` +
            `&slippageBps=${slippageBps}` +
            `&onlyDirectRoutes=true` +
            `&maxAccounts=20`,
        )
    ).json();
    
    // Get serialized transaction
    const { swapTransaction } = await (
        await fetch("https://quote-api.jup.ag/v6/swap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey,
                wrapAndUnwrapSol: true,
                dynamicComputeUnitLimit: true,
                prioritizationFeeLamports: 100000,
            }),
        })
    ).json();

    return NextResponse.json({
        swapTransaction,
        outAmount: quoteResponse.outAmount,
    });
}