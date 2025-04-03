This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloudflare Workers

This project is configured to deploy to Cloudflare Workers with separate environments for staging and production.

### Prerequisites

1. Install Wrangler CLI globally:
```bash
pnpm add -g wrangler
```

2. Authenticate with Cloudflare:
```bash
pnpm wrangler login
```

### Manual Deployment

Before deploying, build the project:

```bash
# Install dependencies if not already done
pnpm install

# Build the project
pnpm build
```

#### Deploy to Staging

To deploy to the staging environment:

```bash
pnpm deploy:staging
```

This will deploy to: `ai-cms-staging.{your-workers-subdomain}.workers.dev`

#### Deploy to Production

To deploy to the production environment:

```bash
# Using the production-specific command:
pnpm deploy:prod

# Or using the default deploy command (same as deploy:prod):
pnpm deploy
```

This will deploy to: `ai-cms.{your-workers-subdomain}.workers.dev`

### Automated Deployment

The project includes GitHub Actions workflows for automated deployments:

- Pushes to the `main` branch automatically trigger a production deployment
- Manual deployments can be triggered from the GitHub Actions tab using the "Deploy to Cloudflare" workflow

### Environment Variables

Make sure to set up the following environment variables in your Cloudflare Workers settings or GitHub Secrets for deployments:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- All other environment variables as specified in the GitHub workflow file

### Local Development Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_WIDGET_SERVICE_URL=
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_PRIVY_APP_ID=
CDP_API_KEY_NAME=
CDP_API_KEY_PRIVATE_KEY=
TWITTER_BEARER_TOKEN=
HELIUS_RPC_URL=
PRIVY_APP_ID=
PRIVY_APP_SECRET=
COSMOS_ENDPOINT=
COSMOS_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_PROJECT_ID=
```

Contact the project maintainers to get the appropriate values for these environment variables.

## Legacy Deployment (Vercel)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
