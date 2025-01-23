"use client";

import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import {
  base,
  mainnet,
  sepolia,
  berachainTestnetbArtio,
  polygonAmoy,
} from "viem/chains";

interface Props {
  children: React.ReactNode;
}

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

export const PrivyProvider: React.FC<Props> = ({ children }) => {
  return (
    <PrivyProviderBase
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#d19900",
          logo: "https://www.askthehive.ai/logo-dark.png",
          // walletChainType: 'ethereum-and-solana',
          // walletChainType: 'solana-only',
          walletChainType: "ethereum-only",
        },
        defaultChain: berachainTestnetbArtio,
        supportedChains: [
          base,
          mainnet,
          sepolia,
          berachainTestnetbArtio,
          polygonAmoy,
        ],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        solanaClusters: [
          {
            name: "mainnet-beta",
            rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
          },
        ],
      }}
    >
      {children}
    </PrivyProviderBase>
  );
};
