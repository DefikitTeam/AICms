import { NextResponse } from "next/server";

import { getTokenDataByAddress } from "@/lib/solana/get-token-data";

import { NextRequest } from "next/server";

interface Params {
    address: string;
}

export const GET = async (request: NextRequest, { params }: { params: Promise<Params> }) => {
    const address = (await params).address;
    try {
        const tokenData = await getTokenDataByAddress(address);
        return NextResponse.json(tokenData);
    } catch (e) {
        console.error(e);
        return NextResponse.json(null, { status: 500 });
    }
}