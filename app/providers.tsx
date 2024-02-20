"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
bsc,
  bscTestnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient } = configureChains(
    [bscTestnet, bsc],
    [
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'Jupyter app',
    projectId: 'YOUR_PROJECT_ID',
    chains
  });
  
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })
const Provider = ({children}:{children:React.ReactNode}) => {
    return (
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
            {children}
        </RainbowKitProvider>
      </WagmiConfig>
    );
  };
  export default Provider;