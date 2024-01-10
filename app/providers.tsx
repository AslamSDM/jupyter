"use client";

"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ThemeProviderProps } from "next-themes/dist/types";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}
const { chains, publicClient } = configureChains(
  [bsc,bscTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "aegis ai",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

	return (
		<WagmiConfig config={wagmiConfig}>
		<RainbowKitProvider chains={chains}>
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
		</NextUIProvider>
		</RainbowKitProvider>
		</WagmiConfig>
	);
}
