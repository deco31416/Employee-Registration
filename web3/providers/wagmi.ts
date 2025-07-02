import { createConfig, http } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Simple configuration without complex auto-detection
export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    injected(),
    walletConnect({
      projectId: "6b0e7594e3cfc2d55e17b6509e809444",
      showQrModal: true,
    }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
})
