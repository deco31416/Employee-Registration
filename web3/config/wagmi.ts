/**
 * Wagmi Configuration
 * 
 * Centralized configuration for Wagmi including:
 * - Supported chains (BSC Mainnet & Testnet)
 * - Wallet connectors (Injected, WalletConnect)
 * - RPC transports
 * 
 * @version 1.0.0
 */

import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { WALLET_CONNECT_PROJECT_ID } from "./constants";

/**
 * Wagmi configuration with optimized settings for BSC networks
 */
export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "Payroll Manager",
        description: "Web3 Payroll Management System",
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: []
      }
    }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
  ssr: true, // Enable SSR support for Next.js
});

/**
 * Default query client configuration for React Query
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
};
