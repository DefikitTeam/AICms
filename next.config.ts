import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		serverComponentsExternalPackages: ['twitter-api-v2'],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config) => {
		/* On `node-fetch` v2, that `supabase-js` uses,
		`encoding` package was optionally required for `.textConverted`
		which means it wasn't in `node-fetch` deps.
		See: https://github.com/node-fetch/node-fetch/issues/412.
		Since `encoding` is not part of the deps by default, when using with webpack,
		it will raise a warning message.
		This can be ignored as it doesn't prevent anything to work well. */
		config.ignoreWarnings = [
			{ module: /node_modules\/node-fetch\/lib\/index\.js/ },
			{ file: /node_modules\/node-fetch\/lib\/index\.js/ },
			{
				module:
					/node_modules\/@radix-ui\/react-primitive\/dist\/index\.mjs/,
			},
			{ file: /node_modules\/@radix-ui\/react-primitive\/dist\/index\.mjs/ },
			{
				module:
					/node_modules\/@radix-ui\/react-visually-hidden\/dist\/index\.mjs/,
			},
			{
				file: /node_modules\/@radix-ui\/react-visually-hidden\/dist\/index\.mjs/,
			},
			{
				module:
					/node_modules\/@radix-ui\/themes\/dist\/esm\/components\/visually-hidden\.js/,
			},
			{
				file: /node_modules\/@radix-ui\/themes\/dist\/esm\/components\/visually-hidden\.js/,
			},
			{
				module:
					/node_modules\/@radix-ui\/themes\/dist\/esm\/components\/index\.js/,
			},
			{
				file: /node_modules\/@radix-ui\/themes\/dist\/esm\/components\/index\.js/,
			},
			{ module: /node_modules\/@radix-ui\/themes\/dist\/esm\/index\.js/ },
			{ file: /node_modules\/@radix-ui\/themes\/dist\/esm\/index\.js/ },
			{
				module:
					/node_modules\/next\/dist\/build\/webpack\/loaders\/next-app-loader\/index\.js/,
			},
			{
				file: /node_modules\/next\/dist\/build\/webpack\/loaders\/next-app-loader\/index\.js/,
			},
			{
				module: /app\/(app)\/layout\.tsx/,
			},
			{
				file: /app\/(app)\/layout\.tsx/,
			},
		];

		return config;
	},
};

export default nextConfig;
