import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
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
