/* eslint-disable */
import {
  artelaTestnet,
  baseSepolia,
  berachain,
  berachainTestnetbArtio,
  Chain,
  monadTestnet,
  polygonAmoy
} from 'viem/chains';

import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
    appName: 'AICms',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? '',
    appIcon: '/logo.png',
    // @ts-ignore
    chains: [artelaTestnet,
      baseSepolia,
      berachain,
      berachainTestnetbArtio,
      monadTestnet,
      polygonAmoy],
    // defaultChain: baseSepolia,
    // autoConnect: false
    // wallets: [
    //     hotWallet,
    // ],
    // ssr: true
});