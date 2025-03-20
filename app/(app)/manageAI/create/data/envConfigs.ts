const envConfigs = [
	{
		name: 'Discord Settings',
		value: [
			{
				name: 'DISCORD_APPLICATION_ID',
				label: 'Discord Application ID',
				placeholder: '1326811252059672618',
				isSecure: false,
				description: 'The application ID of your Discord bot. More details at https://docs.discloud.com/en/suport/faq/id-bot',
				type: 'text',
			},
			{
				name: 'DISCORD_API_TOKEN',
				label: 'Discord API Token',
				placeholder: 'your-discord-api-token',
				isSecure: true,
				description: 'Bot token for Discord API. More details at https://discordgsm.com/guide/how-to-get-a-discord-bot-token',
				type: 'text',
			},
			{
				name: 'DISCORD_VOICE_CHANNEL_ID',
				label: 'Discord Voice Channel ID',
				placeholder: 'your-voice-channel-id',
				isSecure: false,
				description:
					'The ID of the voice channel the bot should join (optional). More details at https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID',
				type: 'text',
			},
		],
	},
	{
		name: 'Telegram Settings',
		value: [
			{
				name: 'TELEGRAM_BOT_TOKEN',
				label: 'Telegram Bot Token',
				placeholder: 'your-telegram-bot-token',
				isSecure: true,
				description: 'Bot token for Telegram API. More details at https://core.telegram.org/bots/tutorial#obtain-your-bot-token',
				type: 'text',
			},
		],
	},
	// {
	// 	name: 'AI Model Settings',
	// 	value: [
	// 		{
	// 			name: 'OPENAI_API_KEY',
	// 			label: 'OpenAI API Key',
	// 			placeholder: 'sk-...',
	// 			isSecure: true,
	// 			description: 'API key for OpenAI services.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'SMALL_OPENAI_MODEL',
	// 			label: 'Small OpenAI Model',
	// 			placeholder: 'gpt-4o-mini',
	// 			isSecure: false,
	// 			description: 'Identifier for the small OpenAI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'MEDIUM_OPENAI_MODEL',
	// 			label: 'Medium OpenAI Model',
	// 			placeholder: 'gpt-4o',
	// 			isSecure: false,
	// 			description: 'Identifier for the medium OpenAI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'LARGE_OPENAI_MODEL',
	// 			label: 'Large OpenAI Model',
	// 			placeholder: 'gpt-4o',
	// 			isSecure: false,
	// 			description: 'Identifier for the large OpenAI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'EMBEDDING_OPENAI_MODEL',
	// 			label: 'Embedding OpenAI Model',
	// 			placeholder: 'text-embedding-3-small',
	// 			isSecure: false,
	// 			description: 'Identifier for the OpenAI embedding model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'IMAGE_OPENAI_MODEL',
	// 			label: 'Image OpenAI Model',
	// 			placeholder: 'dall-e-3',
	// 			isSecure: false,
	// 			description: 'Identifier for the OpenAI image model.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Eternal AI Settings',
	// 	value: [
	// 		{
	// 			name: 'ETERNALAI_URL',
	// 			label: 'Eternal AI URL',
	// 			placeholder: 'https://api.eternalai.com',
	// 			isSecure: false,
	// 			description: 'URL for Eternal AI inference API.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'ETERNALAI_MODEL',
	// 			label: 'Eternal AI Model',
	// 			placeholder:
	// 				'neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16',
	// 			isSecure: false,
	// 			description: 'Identifier for the Eternal AI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'ETERNALAI_API_KEY',
	// 			label: 'Eternal AI API Key',
	// 			placeholder: 'your-eternalai-api-key',
	// 			isSecure: true,
	// 			description: 'API key for Eternal AI services.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Grok Settings',
	// 	value: [
	// 		{
	// 			name: 'GROK_API_KEY',
	// 			label: 'Grok API Key',
	// 			placeholder: 'your-grok-api-key',
	// 			isSecure: true,
	// 			description: 'API key for GROK services.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Groq Settings',
	// 	value: [
	// 		{
	// 			name: 'GROQ_API_KEY',
	// 			label: 'Groq API Key',
	// 			placeholder: 'gsk-...',
	// 			isSecure: true,
	// 			description: 'API key for GROQ services. Must start with gsk_.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'OpenRouter Settings',
	// 	value: [
	// 		{
	// 			name: 'OPENROUTER_API_KEY',
	// 			label: 'OpenRouter API Key',
	// 			placeholder: 'your-openrouter-api-key',
	// 			isSecure: true,
	// 			description: 'API key for OpenRouter services.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Google Generative AI Settings',
	// 	value: [
	// 		{
	// 			name: 'GOOGLE_GENERATIVE_AI_API_KEY',
	// 			label: 'Google Generative AI API Key',
	// 			placeholder: 'AIza...',
	// 			isSecure: true,
	// 			description: 'API key for Google Generative AI (Gemini).',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Ali Bailian Settings',
	// 	value: [
	// 		{
	// 			name: 'ALI_BAILIAN_API_KEY',
	// 			label: 'Ali Bailian API Key',
	// 			placeholder: 'your-ali-bailian-api-key',
	// 			isSecure: true,
	// 			description: 'API key for Ali Bailian services.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'NanoGPT Settings',
	// 	value: [
	// 		{
	// 			name: 'NANOGPT_API_KEY',
	// 			label: 'NanoGPT API Key',
	// 			placeholder: 'your-nanogpt-api-key',
	// 			isSecure: true,
	// 			description: 'API key for NanoGPT services.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Hyperbolic AI Settings',
	// 	value: [
	// 		{
	// 			name: 'HYPERBOLIC_API_KEY',
	// 			label: 'Hyperbolic AI API Key',
	// 			placeholder: 'your-hyperbolic-api-key',
	// 			isSecure: true,
	// 			description: 'API key for Hyperbolic AI services.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'HYPERBOLIC_MODEL',
	// 			label: 'Hyperbolic AI Model',
	// 			placeholder: 'your-hyperbolic-model',
	// 			isSecure: false,
	// 			description: 'Identifier for the Hyperbolic AI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'IMAGE_HYPERBOLIC_MODEL',
	// 			label: 'Image Hyperbolic AI Model',
	// 			placeholder: 'FLUX.1-dev',
	// 			isSecure: false,
	// 			description: "Identifier for Hyperbolic AI's image model.",
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'SMALL_HYPERBOLIC_MODEL',
	// 			label: 'Small Hyperbolic AI Model',
	// 			placeholder: 'meta-llama/Llama-3.2-3B-Instruct',
	// 			isSecure: false,
	// 			description: 'Identifier for the small Hyperbolic AI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'MEDIUM_HYPERBOLIC_MODEL',
	// 			label: 'Medium Hyperbolic AI Model',
	// 			placeholder: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
	// 			isSecure: false,
	// 			description: 'Identifier for the medium Hyperbolic AI model.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'LARGE_HYPERBOLIC_MODEL',
	// 			label: 'Large Hyperbolic AI Model',
	// 			placeholder: 'meta-llama/Meta-Llama-3.1-405-Instruct',
	// 			isSecure: false,
	// 			description: 'Identifier for the large Hyperbolic AI model.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Speech Synthesis Settings',
	// 	value: [
	// 		{
	// 			name: 'ELEVENLABS_XI_API_KEY',
	// 			label: 'ElevenLabs XI API Key',
	// 			placeholder: 'your-elevenlabs-xi-api-key',
	// 			isSecure: true,
	// 			description: 'API key from ElevenLabs for speech synthesis.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'Direct Client Settings',
	// 	value: [
	// 		{
	// 			name: 'EXPRESS_MAX_PAYLOAD',
	// 			label: 'Express Max Payload',
	// 			placeholder: '100kb',
	// 			isSecure: false,
	// 			description:
	// 				'Maximum payload size for Express.js. Defaults to 100kb.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	// {
	// 	name: 'ElevenLabs Settings',
	// 	value: [
	// 		{
	// 			name: 'ELEVENLABS_MODEL_ID',
	// 			label: 'ElevenLabs Model ID',
	// 			placeholder: 'eleven_multilingual_v2',
	// 			isSecure: false,
	// 			description: 'Model ID for ElevenLabs.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_VOICE_ID',
	// 			label: 'ElevenLabs Voice ID',
	// 			placeholder: '21m00Tcm4TlvDq8ikWAM',
	// 			isSecure: false,
	// 			description: 'Voice ID for ElevenLabs.',
	// 			type: 'text',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_VOICE_STABILITY',
	// 			label: 'ElevenLabs Voice Stability',
	// 			placeholder: '0.5',
	// 			isSecure: false,
	// 			description: 'Stability parameter for the ElevenLabs voice.',
	// 			type: 'number',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_VOICE_SIMILARITY_BOOST',
	// 			label: 'ElevenLabs Voice Similarity Boost',
	// 			placeholder: '0.9',
	// 			isSecure: false,
	// 			description: 'Similarity boost parameter for the ElevenLabs voice.',
	// 			type: 'number',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_VOICE_STYLE',
	// 			label: 'ElevenLabs Voice Style',
	// 			placeholder: '0.66',
	// 			isSecure: false,
	// 			description: 'Style parameter for the ElevenLabs voice.',
	// 			type: 'number',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_VOICE_USE_SPEAKER_BOOST',
	// 			label: 'ElevenLabs Voice Use Speaker Boost',
	// 			placeholder: 'false',
	// 			isSecure: false,
	// 			description:
	// 				'Flag to use speaker boost in ElevenLabs voice synthesis.',
	// 			type: 'boolean',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_OPTIMIZE_STREAMING_LATENCY',
	// 			label: 'ElevenLabs Optimize Streaming Latency',
	// 			placeholder: '4',
	// 			isSecure: false,
	// 			description:
	// 				'Optimization parameter for streaming latency in ElevenLabs.',
	// 			type: 'number',
	// 		},
	// 		{
	// 			name: 'ELEVENLABS_OUTPUT_FORMAT',
	// 			label: 'ElevenLabs Output Format',
	// 			placeholder: 'pcm_16000',
	// 			isSecure: false,
	// 			description: 'Output format for ElevenLabs speech synthesis.',
	// 			type: 'text',
	// 		},
	// 	],
	// },
	{
		name: 'Twitter/X Settings',
		value: [
			{
				name: 'TWITTER_USERNAME',
				label: 'Twitter Username',
				placeholder: 'your-twitter-username',
				isSecure: false,
				description: 'Username for the Twitter account.',
				type: 'text',
			},
			{
				name: 'TWITTER_EMAIL',
				label: 'Twitter Email',
				placeholder: 'your-email@example.com',
				isSecure: false,
				description: 'Email associated with the Twitter account.',
				type: 'text',
			},
			{
				name: 'TWITTER_PASSWORD',
				label: 'Twitter Password',
				placeholder: 'your-twitter-password',
				isSecure: true,
				description: 'Password for the Twitter account.',
				type: 'text',
			},
			{
				name: 'TWITTER_2FA_SECRET',
				label: 'Twitter 2FA Secret (Required for not faling when configure twitter agent)',
				placeholder: 'your-twitter-2fa-secret',
				isSecure: true,
				description:
					'Two-factor authentication secret for Twitter account.',
				type: 'text',
				required: true,
			},
			{
				name: 'TWITTER_COOKIES_AUTH_TOKEN',
				label: 'Twitter Cookies Auth Token',
				placeholder: 'your-twitter-auth-token',
				isSecure: true,
				description: 'Auth token for the Twitter account. Get it from your browser devtools. More details at https://medium.com/@alialahmed128/how-to-get-a-twitter-auth-token-de955720dedb',
				type: 'text',
			},
			{
				name: 'TWITTER_COOKIES_CT0',
				label: 'Twitter Cookies CT0',
				placeholder: 'your-twitter-ct0',
				isSecure: true,
				description: 'CT0 for the Twitter account. Get it from your browser devtools',
				type: 'text',
			},
			{
				name: 'TWITTER_COOKIES_GUEST_ID',
				label: 'Twitter Cookies Guest ID',
				placeholder: 'your-twitter-guest-id',
				isSecure: true,
				description: 'Guest ID for the Twitter account. Get it from your browser devtools',
				type: 'text',
			},
			
		],
	},
];

export default envConfigs;
