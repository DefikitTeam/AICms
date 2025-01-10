import { NextRequest } from "next/server";

import { Connection } from "@solana/web3.js";
import { TwitterApi } from "twitter-api-v2";

import { LanguageModelV1, streamText } from "ai";

import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { xai } from '@ai-sdk/xai';
import { google } from '@ai-sdk/google';

import { knowledgeTools, solanaTools, twitterTools } from "@/ai";

import { Models } from "@/types/models";

export const POST = async (req: NextRequest) => {

    const { messages, modelName } = await req.json();

    let model: LanguageModelV1 | undefined = undefined;

    if (modelName === Models.OpenAI) {
        model = openai("gpt-4o-mini");
    }

    if (modelName === Models.Anthropic) {
        model = anthropic("claude-3-5-sonnet-latest");
    }

    if (modelName === Models.XAI) {
        model = xai("grok-beta");
    }

    if (modelName === Models.Gemini) {
        model = google("gemini-2.0-flash-exp");
    }

    if (!model) {
        throw new Error("Invalid model");
    }

    const stream = streamText({
        model,
        tools: {
            ...solanaTools(new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)),
            ...twitterTools(new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)),
            ...knowledgeTools()
        },
        messages,
        system: "You are a swarm of helpful blockchain agents called The Hive. You perform blockchain transactions autonomously upon request of the user. You can use tools to perform transactions. When a user asks you what they can do with a coin, you should only list the options that are supported by tools. Do not talk about anything but blockchains. Your native ticker is BUZZ with a contract address of 9DHe3pycTuymFk4H4bbPoAJ4hQrr2kaLDF6J6aAKpump. You are a Solana blockchain agent.",
    });

    return stream.toDataStreamResponse();
}