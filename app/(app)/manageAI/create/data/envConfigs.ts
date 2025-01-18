const envConfigs = [
	{
		name: 'Discord Settings',
		value: [
			{
				name: 'DISCORD_APPLICATION_ID',
				label: 'Discord Application ID',
				placeholder: '1326811252059672618',
				isSecure: false,
				description: 'The application ID of your Discord bot.',
			},
			{
				name: 'DISCORD_API_TOKEN',
				label: 'Discord API Token',
				placeholder: 'your-discord-api-token',
				isSecure: true,
				description: 'Bot token for Discord API.',
			},
			{
				name: 'DISCORD_VOICE_CHANNEL_ID',
				label: 'Discord Voice Channel ID',
				placeholder: 'your-voice-channel-id',
				isSecure: false,
				description:
					'The ID of the voice channel the bot should join (optional).',
			},
		],
	},
	{
		name: 'Cache Settings',
		value: [
			{
				name: 'CACHE_STORE',
				label: 'Cache Store',
				placeholder: 'database',
				isSecure: false,
				description:
					'Specifies the cache storage method. Options: redis, filesystem.',
			},
			{
				name: 'REDIS_URL',
				label: 'Redis URL',
				placeholder: 'redis://localhost:6379',
				isSecure: false,
				description:
					'URL for Redis instance. Can be a local or cloud-hosted Redis.',
			},
		],
	},
	{
		name: 'AI Model Settings',
		value: [
			{
				name: 'OPENAI_API_KEY',
				label: 'OpenAI API Key',
				placeholder: 'sk-...',
				isSecure: true,
				description: 'API key for OpenAI services.',
			},
			{
				name: 'SMALL_OPENAI_MODEL',
				label: 'Small OpenAI Model',
				placeholder: 'gpt-4o-mini',
				isSecure: false,
				description: 'Identifier for the small OpenAI model.',
			},
			{
				name: 'MEDIUM_OPENAI_MODEL',
				label: 'Medium OpenAI Model',
				placeholder: 'gpt-4o',
				isSecure: false,
				description: 'Identifier for the medium OpenAI model.',
			},
			{
				name: 'LARGE_OPENAI_MODEL',
				label: 'Large OpenAI Model',
				placeholder: 'gpt-4o',
				isSecure: false,
				description: 'Identifier for the large OpenAI model.',
			},
			{
				name: 'EMBEDDING_OPENAI_MODEL',
				label: 'Embedding OpenAI Model',
				placeholder: 'text-embedding-3-small',
				isSecure: false,
				description: 'Identifier for the OpenAI embedding model.',
			},
			{
				name: 'IMAGE_OPENAI_MODEL',
				label: 'Image OpenAI Model',
				placeholder: 'dall-e-3',
				isSecure: false,
				description: 'Identifier for the OpenAI image model.',
			},
		],
	},
	{
		name: 'Eternal AI Settings',
		value: [
			{
				name: 'ETERNALAI_URL',
				label: 'Eternal AI URL',
				placeholder: 'https://api.eternalai.com',
				isSecure: false,
				description: 'URL for Eternal AI inference API.',
			},
			{
				name: 'ETERNALAI_MODEL',
				label: 'Eternal AI Model',
				placeholder:
					'neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16',
				isSecure: false,
				description: 'Identifier for the Eternal AI model.',
			},
			{
				name: 'ETERNALAI_API_KEY',
				label: 'Eternal AI API Key',
				placeholder: 'your-eternalai-api-key',
				isSecure: true,
				description: 'API key for Eternal AI services.',
			},
		],
	},
	{
		name: 'Grok Settings',
		value: [
			{
				name: 'GROK_API_KEY',
				label: 'Grok API Key',
				placeholder: 'your-grok-api-key',
				isSecure: true,
				description: 'API key for GROK services.',
			},
		],
	},
	{
		name: 'Groq Settings',
		value: [
			{
				name: 'GROQ_API_KEY',
				label: 'Groq API Key',
				placeholder: 'gsk-...',
				isSecure: true,
				description: 'API key for GROQ services. Must start with gsk_.',
			},
		],
	},
	{
		name: 'OpenRouter Settings',
		value: [
			{
				name: 'OPENROUTER_API_KEY',
				label: 'OpenRouter API Key',
				placeholder: 'your-openrouter-api-key',
				isSecure: true,
				description: 'API key for OpenRouter services.',
			},
		],
	},
	{
		name: 'Google Generative AI Settings',
		value: [
			{
				name: 'GOOGLE_GENERATIVE_AI_API_KEY',
				label: 'Google Generative AI API Key',
				placeholder: 'AIza...',
				isSecure: true,
				description: 'API key for Google Generative AI (Gemini).',
			},
		],
	},
	{
		name: 'Ali Bailian Settings',
		value: [
			{
				name: 'ALI_BAILIAN_API_KEY',
				label: 'Ali Bailian API Key',
				placeholder: 'your-ali-bailian-api-key',
				isSecure: true,
				description: 'API key for Ali Bailian services.',
			},
		],
	},
	{
		name: 'NanoGPT Settings',
		value: [
			{
				name: 'NANOGPT_API_KEY',
				label: 'NanoGPT API Key',
				placeholder: 'your-nanogpt-api-key',
				isSecure: true,
				description: 'API key for NanoGPT services.',
			},
		],
	},
	{
		name: 'Hyperbolic AI Settings',
		value: [
			{
				name: 'HYPERBOLIC_API_KEY',
				label: 'Hyperbolic AI API Key',
				placeholder: 'your-hyperbolic-api-key',
				isSecure: true,
				description: 'API key for Hyperbolic AI services.',
			},
			{
				name: 'HYPERBOLIC_MODEL',
				label: 'Hyperbolic AI Model',
				placeholder: 'your-hyperbolic-model',
				isSecure: false,
				description: 'Identifier for the Hyperbolic AI model.',
			},
			{
				name: 'IMAGE_HYPERBOLIC_MODEL',
				label: 'Image Hyperbolic AI Model',
				placeholder: 'FLUX.1-dev',
				isSecure: false,
				description: "Identifier for Hyperbolic AI's image model.",
			},
			{
				name: 'SMALL_HYPERBOLIC_MODEL',
				label: 'Small Hyperbolic AI Model',
				placeholder: 'meta-llama/Llama-3.2-3B-Instruct',
				isSecure: false,
				description: 'Identifier for the small Hyperbolic AI model.',
			},
			{
				name: 'MEDIUM_HYPERBOLIC_MODEL',
				label: 'Medium Hyperbolic AI Model',
				placeholder: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
				isSecure: false,
				description: 'Identifier for the medium Hyperbolic AI model.',
			},
			{
				name: 'LARGE_HYPERBOLIC_MODEL',
				label: 'Large Hyperbolic AI Model',
				placeholder: 'meta-llama/Meta-Llama-3.1-405-Instruct',
				isSecure: false,
				description: 'Identifier for the large Hyperbolic AI model.',
			},
		],
	},
	{
		name: 'Speech Synthesis Settings',
		value: [
			{
				name: 'ELEVENLABS_XI_API_KEY',
				label: 'ElevenLabs XI API Key',
				placeholder: 'your-elevenlabs-xi-api-key',
				isSecure: true,
				description: 'API key from ElevenLabs for speech synthesis.',
			},
		],
	},
	{
		name: 'Direct Client Settings',
		value: [
			{
				name: 'EXPRESS_MAX_PAYLOAD',
				label: 'Express Max Payload',
				placeholder: '100kb',
				isSecure: false,
				description:
					'Maximum payload size for Express.js. Defaults to 100kb.',
			},
		],
	},
	{
		name: 'ElevenLabs Settings',
		value: [
			{
				name: 'ELEVENLABS_MODEL_ID',
				label: 'ElevenLabs Model ID',
				placeholder: 'eleven_multilingual_v2',
				isSecure: false,
				description: 'Model ID for ElevenLabs.',
			},
			{
				name: 'ELEVENLABS_VOICE_ID',
				label: 'ElevenLabs Voice ID',
				placeholder: '21m00Tcm4TlvDq8ikWAM',
				isSecure: false,
				description: 'Voice ID for ElevenLabs.',
			},
			{
				name: 'ELEVENLABS_VOICE_STABILITY',
				label: 'ElevenLabs Voice Stability',
				placeholder: '0.5',
				isSecure: false,
				description: 'Stability parameter for the ElevenLabs voice.',
			},
			{
				name: 'ELEVENLABS_VOICE_SIMILARITY_BOOST',
				label: 'ElevenLabs Voice Similarity Boost',
				placeholder: '0.9',
				isSecure: false,
				description: 'Similarity boost parameter for the ElevenLabs voice.',
			},
			{
				name: 'ELEVENLABS_VOICE_STYLE',
				label: 'ElevenLabs Voice Style',
				placeholder: '0.66',
				isSecure: false,
				description: 'Style parameter for the ElevenLabs voice.',
			},
			{
				name: 'ELEVENLABS_VOICE_USE_SPEAKER_BOOST',
				label: 'ElevenLabs Voice Use Speaker Boost',
				placeholder: 'false',
				isSecure: false,
				description:
					'Flag to use speaker boost in ElevenLabs voice synthesis.',
			},
			{
				name: 'ELEVENLABS_OPTIMIZE_STREAMING_LATENCY',
				label: 'ElevenLabs Optimize Streaming Latency',
				placeholder: '4',
				isSecure: false,
				description:
					'Optimization parameter for streaming latency in ElevenLabs.',
			},
			{
				name: 'ELEVENLABS_OUTPUT_FORMAT',
				label: 'ElevenLabs Output Format',
				placeholder: 'pcm_16000',
				isSecure: false,
				description: 'Output format for ElevenLabs speech synthesis.',
			},
		],
	},
	{
		name: 'Twitter X Settings',
		value: [
			{
				name: 'TWITTER_DRY_RUN',
				label: 'Twitter Dry Run',
				placeholder: 'false',
				isSecure: false,
				description: 'Flag to enable dry run for Twitter bot operations.',
			},
			{
				name: 'TWITTER_EMAIL',
				label: 'Twitter Email',
				placeholder: 'your-email@example.com',
				isSecure: false,
				description: 'Email associated with the Twitter account.',
			},
			{
				name: 'TWITTER_2FA_SECRET',
				label: 'Twitter 2FA Secret',
				placeholder: 'your-twitter-2fa-secret',
				isSecure: true,
				description:
					'Two-factor authentication secret for Twitter account.',
			},
			{
				name: 'TWITTER_POLL_INTERVAL',
				label: 'Twitter Poll Interval',
				placeholder: '120',
				isSecure: false,
				description:
					'Polling interval in seconds for Twitter interactions.',
			},
			{
				name: 'TWITTER_SEARCH_ENABLE',
				label: 'Twitter Search Enable',
				placeholder: 'FALSE',
				isSecure: false,
				description:
					'Flag to enable timeline search on Twitter. WARNING: Increases chance of getting banned.',
			},
			{
				name: 'TWITTER_TARGET_USERS',
				label: 'Twitter Target Users',
				placeholder: 'user1,user2,user3',
				isSecure: false,
				description:
					'Comma-separated list of Twitter usernames to interact with.',
			},
			{
				name: 'TWITTER_RETRY_LIMIT',
				label: 'Twitter Retry Limit',
				placeholder: '5',
				isSecure: false,
				description: 'Maximum number of retry attempts for Twitter login.',
			},
		],
	},
	{
		name: 'X Server Settings',
		value: [
			{
				name: 'X_SERVER_URL',
				label: 'X Server URL',
				placeholder: 'https://your-x-server.com',
				isSecure: false,
				description: 'URL for the X server.',
			},
			{
				name: 'XAI_API_KEY',
				label: 'XAI API Key',
				placeholder: 'your-xai-api-key',
				isSecure: true,
				description: 'API key for XAI services.',
			},
			{
				name: 'XAI_MODEL',
				label: 'XAI Model',
				placeholder: 'your-xai-model',
				isSecure: false,
				description: 'Identifier for the XAI model.',
			},
		],
	},
	{
		name: 'Post Interval Settings',
		value: [
			{
				name: 'POST_INTERVAL_MIN',
				label: 'Post Interval Min (minutes)',
				placeholder: '2',
				isSecure: false,
				description:
					'Minimum interval in minutes between posts. Default: 90.',
			},
			{
				name: 'POST_INTERVAL_MAX',
				label: 'Post Interval Max (minutes)',
				placeholder: '3',
				isSecure: false,
				description:
					'Maximum interval in minutes between posts. Default: 180.',
			},
			{
				name: 'POST_IMMEDIATELY',
				label: 'Post Immediately',
				placeholder: 'false',
				isSecure: false,
				description: 'Flag to post immediately.',
			},
		],
	},
	{
		name: 'Twitter Action Processing Settings',
		value: [
			{
				name: 'ACTION_INTERVAL',
				label: 'Action Interval (ms)',
				placeholder: '300000',
				isSecure: false,
				description:
					'Interval in milliseconds between action processing runs. Default: 5 minutes.',
			},
			{
				name: 'ENABLE_ACTION_PROCESSING',
				label: 'Enable Action Processing',
				placeholder: 'false',
				isSecure: false,
				description: 'Set to true to enable the action processing loop.',
			},
		],
	},
];

export default envConfigs;
