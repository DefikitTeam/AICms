import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import { baseSepolia } from "viem/chains";

interface ProvidersProps {
  children: ReactNode;
}
const queryClient = new QueryClient();
const GlobalConnectWalletProvider: FC<ProvidersProps> = ({ children }) => {
//   const chainConfig = ConfigService.getInstance();

  return (
      <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                  initialChain={baseSepolia}
                  coolMode
                  theme={darkTheme({
                      accentColor: '#7b3fe4',
                      accentColorForeground: 'white',
                      borderRadius: 'small',
                      fontStack: 'system',
                      overlayBlur: 'small'
                  })}
              >
                  {children}
              </RainbowKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
  );
};

export default GlobalConnectWalletProvider;