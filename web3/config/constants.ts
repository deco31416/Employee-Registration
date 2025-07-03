/**
 * Web3 Configuration Constants
 * 
 * Centralized configuration for all Web3-related constants including:
 * - Contract addresses with environment variable support
 * - Supported blockchain networks
 * - WalletConnect configuration
 * - Application metadata
 * 
 * @version 1.0.0
 */

// Contract Addresses - Support for multiple environments
export const CONTRACT_ADDRESSES = {
  USER_REGISTRY:
    (process.env.NEXT_PUBLIC_USER_REGISTRY_ADDRESS as `0x${string}`) || 
    "0xD6CCb894Eb0164a99d72F815BCb3e9f5CaC47675",
  
  // Future contracts can be added here
  // PAYROLL_MANAGER: process.env.NEXT_PUBLIC_PAYROLL_MANAGER_ADDRESS as `0x${string}`,
  // TOKEN_MANAGER: process.env.NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS as `0x${string}`,
} as const;

// Supported Blockchain Networks
export const SUPPORTED_CHAINS = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  // Add more chains as needed
  // ETHEREUM_MAINNET: 1,
  // POLYGON_MAINNET: 137,
} as const;

// WalletConnect Configuration
export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID_WALLETCONNECT || "6b0e7594e3cfc2d55e17b6509e809444";

// Application Metadata
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Payroll Manager",
  description: "Web3 Payroll Management System",
  version: "1.0.0",
  defaultChain: SUPPORTED_CHAINS.BSC_TESTNET,
} as const;

// Role Constants - Predefined keccak256 hashes for access control
export const ROLES = {
  DEFAULT_ADMIN_ROLE:
    "0x0000000000000000000000000000000000000000000000000000000000000000" as const,
  ADMIN_ROLE:
    "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775" as const,
  AUDITOR_ROLE:
    "0x59a1c48e5837ad7a7f3dcedcbe129bf3249ec4fbf651fd4f5e2600ead39fe2f5" as const,
  COMPLIANCE_ROLE:
    "0x442a94f1a1fac79af32856af2a64f63648cfa2ef3b98610a5bb7cbec4cee6985" as const,
  FINANCE_ROLE:
    "0x940d6b1946ff1d2b5a9f1909219c3c81a370804b5ba0f91ec0828c99a2e6a681" as const,
  OPERATOR_ROLE:
    "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929" as const,
  PAYROLL_ROLE:
    "0x7f9673717d875a205cbe95d736eb2269b7dc4fbf2b34e5f3ec698f5deec49d1d" as const,
  SIGNER_ROLE:
    "0xe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f70" as const,
} as const;

// Environment validation helper
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_PROJECT_ID_WALLETCONNECT',
    'NEXT_PUBLIC_USER_REGISTRY_ADDRESS'
  ];
  
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
};
