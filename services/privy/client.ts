import { PrivyClient } from '@privy-io/server-auth';

export const privy = new PrivyClient(
	process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm5np560104c76o17yz1ls1yg',
	process.env.PRIVY_APP_SECRET! ||
		'3ePht1EXY8BsNT6j5cJeRiMe3hJsGdmLVXgyV2XjjPcV2WjywfKro3jHJTCg2TDXtfzWs6zqAcixiXymREDtHJEY'
);
