"use client";

"use client";
import * as React from "react";
import { useRouter } from 'next/navigation'

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export interface ProvidersProps {
  children: React.ReactNode;
}
const { chains, publicClient } = configureChains(
  [bsc,bscTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "aegis ai",
  projectId: "d asd",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

	return (
		<WagmiConfig config={wagmiConfig}>
		<RainbowKitProvider chains={chains}>
        {children}
		</RainbowKitProvider>
		</WagmiConfig>
	);
}
