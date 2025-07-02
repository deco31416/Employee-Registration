// Use environment variables with fallbacks
export const CONTRACT_ADDRESSES = {
  USER_REGISTRY:
    (process.env.NEXT_PUBLIC_USER_REGISTRY_ADDRESS as `0x${string}`) || "0xD6CCb894Eb0164a99d72F815BCb3e9f5CaC47675",
} as const

export const SUPPORTED_CHAINS = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
} as const

export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID_WALLETCONNECT || "6b0e7594e3cfc2d55e17b6509e809444"
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Payroll Manager"
