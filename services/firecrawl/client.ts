import FirecrawlApp from '@mendable/firecrawl-js';

export const firecrawl = new FirecrawlApp({
	apiKey:
		process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY ||
		'fc-2152b9cb5d8f414c95c450277e74beb9',
});
