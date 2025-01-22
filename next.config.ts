import type { NextConfig } from 'next';
const webpack = require('webpack');

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		serverComponentsExternalPackages: ['twitter-api-v2'],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config) => {
		config.resolve.fallback = {
			crypto: require.resolve('crypto-browserify'),
			stream: require.resolve('stream-browserify'),
			assert: require.resolve('assert'),
		};
		config.plugins.push(
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
				process: 'process/browser',
			})
		);
		return config;
	},
};

export default nextConfig;
