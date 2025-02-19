'use client';

import type { NextConfig } from 'next';
import path from 'path';

const nextConfig = {
	async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace with specific domains in production
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ];
  },

	/* config options here */
	experimental: {
		serverComponentsExternalPackages: ['twitter-api-v2'],
	},
  reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config: NextConfig) => {
		/* On `node-fetch` v2, that `supabase-js` uses,
		`encoding` package was optionally required for `.textConverted`
		which means it wasn't in `node-fetch` deps.
		See: https://github.com/node-fetch/node-fetch/issues/412.
		Since `encoding` is not part of the deps by default, when using with webpack,
		it will raise a warning message.
		This can be ignored as it doesn't prevent anything to work well. */
      // Handle native .node files
      config.module.rules.push({
        test: /\.node$/,
        use: "node-loader",
      });

      // Handle fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // "zlib-sync": false,
      };

      // Alias configurations
      config.resolve.alias = {
        ...config.resolve.alias,
        // Tokenizers alias
        "@anush008/tokenizers-darwin-arm64": "@anush008/tokenizers-darwin-universal",
        // ONNX Runtime alias - map all architecture-specific paths to universal
        "./darwin/arm64/onnxruntime_binding.node": path.resolve(
          __dirname,
          "node_modules/onnxruntime-node/bin/napi-v3/darwin/universal/onnxruntime_binding.node"
        ),
        "./darwin/x64/onnxruntime_binding.node": path.resolve(
          __dirname,
          "node_modules/onnxruntime-node/bin/napi-v3/darwin/universal/onnxruntime_binding.node"
        ),
        // Add Sharp universal binary alias
        "sharp": path.resolve(__dirname, "node_modules/sharp")
      };

      // External modules configuration
      config.externals = [
        ...(config.externals || []),
        {
          "@anush008/tokenizers-darwin-arm64": "commonjs @anush008/tokenizers-darwin-universal",
          "onnxruntime-node": "commonjs onnxruntime-node",
          "sharp": "commonjs sharp"
        }
      ];

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