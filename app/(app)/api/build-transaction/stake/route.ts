import { NextRequest, NextResponse } from "next/server";

import { JUP_API, getTokenDataByAddress } from "@/lib/solana";

export const POST = async (req: NextRequest) => {
    const { inputAmount, slippageBps, userPublicKey } = await req.json();
        
    const inputMintDecimals = await getTokenDataByAddress("So11111111111111111111111111111111111111112");
    if (!inputMintDecimals) throw new Error("Input mint not found");

    const quoteResponse = await (
        await fetch(
            `${JUP_API}/quote?` +
            `inputMint=So11111111111111111111111111111111111111112` +
            `&outputMint=jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v` +
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