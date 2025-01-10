import { NextResponse } from 'next/server';

import { findKnowledgeByUrl } from '@/db/services';

export async function POST(req: Request) {
    const { url } = await req.json();
    console.log("get knowledge by url", url)
    const knowledge = await findKnowledgeByUrl(url);
    return NextResponse.json(knowledge.length > 0 ? knowledge[0] : null);
}