import { NextRequest, NextResponse } from 'next/server';

import { PrivyClient } from '@privy-io/server-auth';

import { findChatsByUser } from '@/db/services/chats';

const privy = new PrivyClient(
	process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm5np560104c76o17yz1ls1yg',
	process.env.PRIVY_APP_SECRET ||
		'3ePht1EXY8BsNT6j5cJeRiMe3hJsGdmLVXgyV2XjjPcV2WjywfKro3jHJTCg2TDXtfzWs6zqAcixiXymREDtHJEY'
);

export const GET = async (req: NextRequest) => {
	try {
		// Get the authorization header
		const authHeader = req.headers.get('authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return NextResponse.json(
				{ error: 'Missing or invalid authorization header' },
				{ status: 401 }
			);
		}

		// Extract the token
		const token = authHeader.split(' ')[1];

		// Verify the token with Privy
		const { userId } = await privy.verifyAuthToken(token);
		if (!userId) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}

		// Get the user's chats
		const chats = await findChatsByUser(userId);

		return NextResponse.json(chats);
	} catch (error) {
		console.error('Error in /api/chats:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const runtime = 'nodejs';
