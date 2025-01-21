import FirecrawlApp from '@mendable/firecrawl-js';

export const firecrawl = new FirecrawlApp({
	apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY,
});
