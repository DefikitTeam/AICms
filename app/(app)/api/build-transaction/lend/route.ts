import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { amount, userPublicKey } = await req.json();

        // Validate required parameters
        if (!amount || !userPublicKey) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Get the transaction from Lulo
        const response = await fetch(
            `https://blink.lulo.fi/actions?amount=${amount}&symbol=USDC`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account: userPublicKey,
                }),
            }
        );

        const data = await response.json();

        return NextResponse.json({ 
            transaction: data.transaction
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 