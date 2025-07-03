# 🔗 Web3 Connections Folder Blueprint

## Table of Contents

1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Directory Structure](#directory-structure)
4. [Implementation Guide](#implementation-guide)
5. [Role-Based Contract Integration](#role-based-contract-integration)
6. [Scalable Architecture](#scalable-architecture)
7. [Import Patterns](#import-patterns)
8. [Best Practices](#best-practices)
9. [Next.js Integration](#nextjs-integration)
10. [TypeScript Configuration](#typescript-configuration)
11. [Testing and Debugging](#testing-and-debugging)
12. [Migration Guide](#migration-guide)
13. [Future Contract Integration](#future-contract-integration)
14. [Troubleshooting](#troubleshooting)

---

## Overview

This blueprint provides a comprehensive guide for creating a centralized Web3 connections folder structure in DApp projects. The architecture is designed for scalability, maintainability, and ease of integration with role-based smart contracts using modern Web3 libraries.

### Technology Stack
- **Frontend Framework**: Next.js 14+ with TypeScript
- **Web3 Libraries**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity with role-based access control
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS

### Architecture Goals
- ✅ **Centralized Management**: Single source of truth for all Web3 connections
- ✅ **Scalable Structure**: Easy addition of new contracts without refactoring
- ✅ **Role-Based Integration**: Proper handling of contract modifiers and permissions
- ✅ **Type Safety**: Full TypeScript integration with contract ABIs
- ✅ **Developer Experience**: Clean imports and intuitive file organization
- ✅ **Maintainability**: Clear separation of concerns and modular architecture

---

## Project Setup

### Step 1: Create Root Web3 Directory

```bash
# Create the main web3 directory (can be named web3 or conexion-web3)
mkdir web3

# Create subdirectories
mkdir web3/{abi,hooks,providers,config,types,utils}

# Create main index file
touch web3/index.ts
```

### Step 2: Install Required Dependencies

```bash
# Core Web3 dependencies
npm install wagmi viem @tanstack/react-query

# RainbowKit for wallet connections
npm install @rainbow-me/rainbowkit

# Additional utilities
npm install @wagmi/core @wagmi/connectors
```

---

## Directory Structure

### Complete Web3 Folder Architecture

```
web3/
├── index.ts                          # 🎯 Central export hub
├── abi/
│   ├── userRegistry.abi.ts          # Contract ABIs with documentation
│   ├── payrollManager.abi.ts        # Future contract ABIs
│   └── accessControl.abi.ts         # Role management ABIs
├── config/
│   ├── constants.ts                 # Contract addresses and chains
│   ├── wagmi.ts                     # Wagmi configuration
│   └── roles.ts                     # Role constants and permissions
├── hooks/
│   ├── useUserRegistry.ts           # Contract-specific hooks
│   ├── usePayrollManager.ts         # Future contract hooks
│   └── useRoleManagement.ts         # Role management hooks
├── providers/
│   ├── web3-provider.tsx            # Main Web3 provider
│   └── rainbow-provider.tsx         # RainbowKit provider
├── types/
│   ├── index.ts                     # TypeScript definitions
│   ├── contracts.ts                 # Contract-specific types
│   └── roles.ts                     # Role-related types
└── utils/
    ├── helpers.ts                   # Web3 utility functions
    ├── validation.ts                # Address and input validation
    └── errors.ts                    # Error handling utilities
```

---

## Implementation Guide

### 1. ABI File Structure

Create dedicated ABI files with proper documentation and type safety:

```typescript
// web3/abi/userRegistry.abi.ts
/**
 * User Registry Contract ABI
 * 
 * This ABI contains all functions for employee management with role-based access:
 * - Employee CRUD operations (requires ADMIN_ROLE or OPERATOR_ROLE)
 * - Sensitive data access (requires COMPLIANCE_ROLE or AUDITOR_ROLE)
 * - Salary management (requires FINANCE_ROLE or PAYROLL_ROLE)
 * 
 * @version 1.0.0
 * @contract UserRegistry
 * @network BSC Testnet/Mainnet
 */

export const USER_REGISTRY_ABI = [
  // Write functions with role requirements
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "string", name: "fullName", type: "string" },
      { internalType: "string", name: "email", type: "string" },
      // ... other parameters
    ],
    name: "registerEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  
  // Read functions with role restrictions
  {
    inputs: [],
    name: "getAllEmployeesWithSensitiveData",
    outputs: [
      {
        components: [
          { internalType: "address", name: "wallet", type: "address" },
          { internalType: "string", name: "fullName", type: "string" },
          { internalType: "string", name: "email", type: "string" },
          // ... other fields
        ],
        internalType: "struct UserRegistry.EmployeeView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  
  // Role management functions
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export type UserRegistryABI = typeof USER_REGISTRY_ABI;
```

### 2. Configuration Files

#### Constants and Contract Addresses

```typescript
// web3/config/constants.ts
/**
 * Web3 Configuration Constants
 * 
 * Centralized configuration for contract addresses, supported chains,
 * and environment-specific settings.
 */

// Contract Addresses with environment support
export const CONTRACT_ADDRESSES = {
  USER_REGISTRY: (process.env.NEXT_PUBLIC_USER_REGISTRY_ADDRESS as `0x${string}`) || 
    "0xYourContractAddress",
  PAYROLL_MANAGER: (process.env.NEXT_PUBLIC_PAYROLL_MANAGER_ADDRESS as `0x${string}`) || 
    "0xYourPayrollAddress",
  // Add more contracts as needed
} as const;

// Supported Blockchain Networks
export const SUPPORTED_CHAINS = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  ETHEREUM_MAINNET: 1,
  POLYGON_MAINNET: 137,
} as const;

// Application Configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Web3 DApp",
  description: "Decentralized Application with Role-Based Access Control",
  version: "1.0.0",
  defaultChain: SUPPORTED_CHAINS.BSC_TESTNET,
} as const;

// WalletConnect Configuration
export const WALLET_CONNECT_PROJECT_ID = 
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id";
```

#### Role Constants

```typescript
// web3/config/roles.ts
/**
 * Smart Contract Role Constants
 * 
 * These constants match the keccak256 hashes defined in your smart contracts.
 * Update these values to match your actual contract role definitions.
 */

export const ROLES = {
  // OpenZeppelin AccessControl default admin role
  DEFAULT_ADMIN_ROLE: 
    "0x0000000000000000000000000000000000000000000000000000000000000000" as const,
  
  // Custom roles - update with your actual contract values
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

// Role metadata for UI display
export const ROLE_METADATA = {
  [ROLES.DEFAULT_ADMIN_ROLE]: {
    name: "Super Admin",
    description: "Full control over all contract functions",
    color: "red",
  },
  [ROLES.ADMIN_ROLE]: {
    name: "Admin",
    description: "Employee management and general administration",
    color: "blue",
  },
  [ROLES.AUDITOR_ROLE]: {
    name: "Auditor",
    description: "Read-only access for auditing purposes",
    color: "purple",
  },
  [ROLES.COMPLIANCE_ROLE]: {
    name: "Compliance",
    description: "Compliance verification and monitoring",
    color: "green",
  },
  [ROLES.FINANCE_ROLE]: {
    name: "Finance",
    description: "Financial data management and salary operations",
    color: "yellow",
  },
  [ROLES.OPERATOR_ROLE]: {
    name: "Operator",
    description: "Daily operations and routine tasks",
    color: "gray",
  },
  [ROLES.PAYROLL_ROLE]: {
    name: "Payroll",
    description: "Payroll processing and employee compensation",
    color: "indigo",
  },
  [ROLES.SIGNER_ROLE]: {
    name: "Signer",
    description: "Transaction signing and authorization",
    color: "pink",
  },
} as const;
```

#### Wagmi Configuration

```typescript
// web3/config/wagmi.ts
import { createConfig, http } from "wagmi";
import { bsc, bscTestnet, mainnet, polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { WALLET_CONNECT_PROJECT_ID, SUPPORTED_CHAINS } from "./constants";

/**
 * Wagmi Configuration
 * 
 * Configures supported chains, connectors, and transport layers
 * for Web3 wallet connections and blockchain interactions.
 */

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc, mainnet, polygon],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "Web3 DApp",
        description: "DApp with Role-Based Access Control",
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://your-app-icon.png']
      }
    }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true, // Enable Server-Side Rendering support
});

/**
 * React Query Configuration for Wagmi
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    },
    mutations: {
      retry: 1,
    },
  },
};
```

### 3. Hook Implementation for Role-Based Contracts

```typescript
// web3/hooks/useUserRegistry.ts
"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { useState, useCallback } from "react";
import { USER_REGISTRY_ABI } from "../abi/userRegistry.abi";
import { CONTRACT_ADDRESSES, ROLES } from "../config";
import { handleContractError, validateAddress } from "../utils";
import type { RegisterEmployeeParams, ContractError } from "../types";

/**
 * Custom hook for UserRegistry contract interactions
 * 
 * This hook handles all interactions with the UserRegistry smart contract,
 * including proper role-based access control and error handling.
 * 
 * IMPORTANT: For functions with role modifiers, ensure the connected wallet
 * has the appropriate role assigned before calling write functions.
 */

export function useUserRegistry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { data: walletClient } = useWalletClient();

  // Helper function for write operations with role validation
  const executeWrite = useCallback(
    async (functionName: string, args: any[], requiredRoles?: string[]) => {
      try {
        setIsLoading(true);
        setError(null);

        // Optional: Pre-validate roles before attempting transaction
        if (requiredRoles && walletClient?.account?.address) {
          // You can add role validation logic here
          console.log(`Function ${functionName} requires roles:`, requiredRoles);
        }

        await writeContract({
          address: CONTRACT_ADDRESSES.USER_REGISTRY,
          abi: USER_REGISTRY_ABI,
          functionName: functionName as any,
          args: args as any,
        });
      } catch (err) {
        const contractError = handleContractError(err);
        setError(contractError);
        throw contractError;
      } finally {
        setIsLoading(false);
      }
    },
    [writeContract, walletClient]
  );

  // READ FUNCTIONS
  // Note: Include account parameter for functions with role modifiers
  
  const getAllEmployeesWithSensitiveData = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: USER_REGISTRY_ABI,
    functionName: "getAllEmployeesWithSensitiveData",
    account: walletClient?.account?.address, // 👈 Critical for role-based access
    query: {
      enabled: !!walletClient?.account?.address,
    },
  });

  const getEmployeeMetadata = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "getEmployeeMetadata",
      args: [wallet],
      account: walletClient?.account?.address, // 👈 Ensures correct msg.sender
      query: { 
        enabled: !!wallet && !!walletClient?.account?.address 
      },
    });

  const getSensitiveEmployeeData = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "getSensitiveEmployeeData",
      args: [wallet],
      account: walletClient?.account?.address, // 👈 Required for role verification
      query: { 
        enabled: !!wallet && !!walletClient?.account?.address 
      },
    });

  // Public function (no role required)
  const isActive = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "isActive",
      args: [wallet],
      query: { enabled: !!wallet },
    });

  // ROLE MANAGEMENT FUNCTIONS
  
  const hasRole = (role: `0x${string}`, account: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "hasRole",
      args: [role, account],
      query: { enabled: !!role && !!account },
    });

  const getRoleAdmin = (role: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "getRoleAdmin",
      args: [role],
      query: { enabled: !!role },
    });

  // WRITE FUNCTIONS
  // Include required roles for documentation and potential validation

  const registerEmployee = (params: RegisterEmployeeParams) =>
    executeWrite(
      "registerEmployee",
      [
        params.wallet,
        params.fullName,
        params.email,
        params.country,
        params.position,
        params.skillPrincipal,
        params.skillSecundaria,
        params.skillTerciaria,
        params.otrasSkills,
        params.monthlySalaryUSD,
        params.preferredToken,
        params.paymentWallet,
      ],
      [ROLES.ADMIN_ROLE, ROLES.OPERATOR_ROLE] // Required roles
    );

  const updateEmployeeSalary = (wallet: `0x${string}`, newSalary: bigint) =>
    executeWrite(
      "updateEmployeeSalary",
      [wallet, newSalary],
      [ROLES.FINANCE_ROLE, ROLES.PAYROLL_ROLE] // Required roles
    );

  const grantRole = (role: `0x${string}`, account: `0x${string}`) =>
    executeWrite(
      "grantRole",
      [role, account],
      [ROLES.DEFAULT_ADMIN_ROLE] // Only admin can grant roles
    );

  const revokeRole = (role: `0x${string}`, account: `0x${string}`) =>
    executeWrite(
      "revokeRole",
      [role, account],
      [ROLES.DEFAULT_ADMIN_ROLE] // Only admin can revoke roles
    );

  return {
    // State
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    transactionHash: hash,

    // Read functions
    getAllEmployeesWithSensitiveData,
    getEmployeeMetadata,
    getSensitiveEmployeeData,
    isActive,
    hasRole,
    getRoleAdmin,

    // Write functions
    registerEmployee,
    updateEmployeeSalary,
    grantRole,
    revokeRole,

    // Utility
    clearError: () => setError(null),
  };
}
```

### 4. Provider Setup

```typescript
// web3/providers/web3-provider.tsx
"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig, queryClientConfig } from "../config/wagmi";
import { validateEnvironment } from "../utils/validation";

// Import RainbowKit styles
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient(queryClientConfig);

/**
 * Web3Provider Component
 * 
 * Provides Web3 context to the entire application including:
 * - Wagmi configuration for blockchain interactions
 * - RainbowKit for wallet connection UI
 * - React Query for data fetching and caching
 * - Environment validation
 */

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Validate environment variables on mount
    validateEnvironment();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-foreground">Loading Web3 Provider...</div>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 5. Utility Functions

```typescript
// web3/utils/helpers.ts
import { isAddress } from "viem";
import type { ContractError } from "../types";

/**
 * Web3 Utility Functions
 * 
 * Collection of utility functions for Web3 operations including
 * address validation, error handling, and data formatting.
 */

// Address validation
export const isValidAddress = (address: string): address is `0x${string}` => {
  return isAddress(address);
};

// Format address for display
export const formatAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string => {
  if (!isValidAddress(address)) return address;
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

// Enhanced contract error handling
export const handleContractError = (error: any): ContractError => {
  const contractError: ContractError = {
    name: error.name || 'ContractError',
    message: error.message || 'Unknown contract error',
    code: error.code,
    reason: error.reason,
  };

  // Parse common error patterns
  if (error.message?.includes('User rejected')) {
    contractError.message = 'Transaction was rejected by user';
    contractError.reason = 'user_rejected';
  } else if (error.message?.includes('insufficient funds')) {
    contractError.message = 'Insufficient funds for transaction';
    contractError.reason = 'insufficient_funds';
  } else if (error.message?.includes('AccessControl')) {
    contractError.message = 'Access denied. You do not have the required permissions';
    contractError.reason = 'access_denied';
  } else if (error.message?.includes('execution reverted')) {
    contractError.message = 'Transaction failed. Please check your inputs and permissions';
    contractError.reason = 'execution_reverted';
  } else if (error.message?.includes('onlyAdminOrAuthorized')) {
    contractError.message = 'Insufficient permissions. Admin or authorized role required';
    contractError.reason = 'role_required';
  }

  return contractError;
};

// Token amount formatting
export const formatTokenAmount = (
  value: bigint,
  decimals: number = 18
): string => {
  try {
    const divisor = BigInt(10 ** decimals);
    const quotient = value / divisor;
    const remainder = value % divisor;
    
    if (remainder === 0n) {
      return quotient.toString();
    }
    
    const remainderStr = remainder.toString().padStart(decimals, '0');
    const trimmedRemainder = remainderStr.replace(/0+$/, '');
    
    return `${quotient}.${trimmedRemainder}`;
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

// Retry mechanism with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      const delayTime = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
  }
  
  throw lastError!;
};
```

### 6. Central Export Hub

```typescript
// web3/index.ts
/**
 * Web3 Module - Centralized Export Hub
 * 
 * This is the main entry point for all Web3-related functionality.
 * Import everything you need from this single module to maintain
 * clean and organized imports throughout your application.
 * 
 * Usage Examples:
 * 
 * // Import the main provider
 * import { Web3Provider } from '@/web3'
 * 
 * // Import hooks and utilities
 * import { useUserRegistry, isValidAddress, ROLES } from '@/web3'
 * 
 * // Import configuration
 * import { CONTRACT_ADDRESSES, wagmiConfig } from '@/web3'
 * 
 * // Import types
 * import type { RegisterEmployeeParams, ContractError } from '@/web3'
 * 
 * @version 1.0.0
 * @author Your Development Team
 */

// === PROVIDERS ===
export { Web3Provider } from './providers/web3-provider';

// === CONFIGURATION ===
export { wagmiConfig, queryClientConfig } from './config/wagmi';
export { 
  CONTRACT_ADDRESSES, 
  SUPPORTED_CHAINS, 
  WALLET_CONNECT_PROJECT_ID, 
  APP_CONFIG 
} from './config/constants';
export { ROLES, ROLE_METADATA } from './config/roles';

// === ABIs ===
export { USER_REGISTRY_ABI } from './abi/userRegistry.abi';
export type { UserRegistryABI } from './abi/userRegistry.abi';
// Future contract ABIs:
// export { PAYROLL_MANAGER_ABI } from './abi/payrollManager.abi';
// export { ACCESS_CONTROL_ABI } from './abi/accessControl.abi';

// === HOOKS ===
export { useUserRegistry } from './hooks/useUserRegistry';
// Future contract hooks:
// export { usePayrollManager } from './hooks/usePayrollManager';
// export { useRoleManagement } from './hooks/useRoleManagement';

// === UTILITIES ===
export { 
  isValidAddress, 
  formatAddress, 
  formatTokenAmount, 
  handleContractError, 
  retryWithBackoff 
} from './utils/helpers';
export { validateEnvironment, validateInput } from './utils/validation';

// === TYPES ===
export type {
  ContractError,
  RegisterEmployeeParams,
  UpdateEmployeeParams,
  EmployeeData,
  RolePermissions
} from './types';

/**
 * Template for Adding New Contracts
 * 
 * When integrating a new smart contract, follow this pattern:
 * 
 * 1. Create ABI file: /abi/contractName.abi.ts
 * 2. Add contract address to: /config/constants.ts
 * 3. Create hook: /hooks/useContractName.ts
 * 4. Add types: /types/contractName.ts
 * 5. Export everything from this index.ts file
 * 
 * Example for PayrollManager contract:
 * 
 * // Add to this file:
 * export { PAYROLL_MANAGER_ABI } from './abi/payrollManager.abi';
 * export { usePayrollManager } from './hooks/usePayrollManager';
 * export type { PayrollParams } from './types/payrollManager';
 * 
 * // Usage in components:
 * import { usePayrollManager, PAYROLL_MANAGER_ABI } from '@/web3';
 */
```

---

## Role-Based Contract Integration

### Understanding Role Modifiers

When working with smart contracts that use role-based access control, it's crucial to understand how to properly interact with protected functions.

#### Contract Side (Solidity)

```solidity
// Example modifier in your smart contract
modifier onlyAdminOrAuthorized() {
    require(
        hasRole(ADMIN_ROLE, msg.sender) ||
        hasRole(COMPLIANCE_ROLE, msg.sender) ||
        hasRole(PAYROLL_ROLE, msg.sender),
        "Access denied: must have an authorized role"
    );
    _;
}

function getAllEmployeesWithSensitiveData()
    external
    view
    onlyAdminOrAuthorized
    returns (EmployeeView[] memory)
{
    // Function implementation
}
```

#### DApp Side (TypeScript)

The key insight is that for role-protected view functions, you **must** pass the `account` parameter to ensure `msg.sender` is correctly set:

```typescript
// ❌ WRONG - Will fail for role-protected functions
const { data } = useReadContract({
  address: CONTRACT_ADDRESSES.USER_REGISTRY,
  abi: USER_REGISTRY_ABI,
  functionName: "getAllEmployeesWithSensitiveData",
  // Missing account parameter
});

// ✅ CORRECT - Properly passes msg.sender for role verification
const { data } = useReadContract({
  address: CONTRACT_ADDRESSES.USER_REGISTRY,
  abi: USER_REGISTRY_ABI,
  functionName: "getAllEmployeesWithSensitiveData",
  account: walletClient?.account?.address, // 👈 Critical!
  query: {
    enabled: !!walletClient?.account?.address,
  },
});
```

### Role Assignment Workflow

1. **Deploy Contract**: The deployer automatically gets `DEFAULT_ADMIN_ROLE`
2. **Grant Initial Roles**: Use the admin account to grant roles to other addresses
3. **Verify Permissions**: Always check roles before attempting protected operations
4. **Handle Errors**: Implement proper error handling for permission denied scenarios

```typescript
// Example role assignment in your DApp
const grantAdminRole = async (targetAddress: string) => {
  try {
    await grantRole(ROLES.ADMIN_ROLE, targetAddress as `0x${string}`);
    console.log(`Admin role granted to ${targetAddress}`);
  } catch (error) {
    console.error('Failed to grant role:', error);
    // Handle permission denied or other errors
  }
};
```

---

## Scalable Architecture

### Adding New Contracts

The architecture is designed to easily accommodate new smart contracts. Follow this systematic approach:

#### Step 1: Add Contract ABI

```typescript
// web3/abi/payrollManager.abi.ts
export const PAYROLL_MANAGER_ABI = [
  // Your contract ABI here
] as const;

export type PayrollManagerABI = typeof PAYROLL_MANAGER_ABI;
```

#### Step 2: Update Constants

```typescript
// web3/config/constants.ts
export const CONTRACT_ADDRESSES = {
  USER_REGISTRY: "0x...",
  PAYROLL_MANAGER: "0x...", // 👈 Add new contract
} as const;
```

#### Step 3: Create Hook

```typescript
// web3/hooks/usePayrollManager.ts
export function usePayrollManager() {
  // Follow the same pattern as useUserRegistry
  // Include proper role handling and error management
}
```

#### Step 4: Add Types

```typescript
// web3/types/payrollManager.ts
export interface PayrollParams {
  // Define your contract-specific types
}
```

#### Step 5: Export from Index

```typescript
// web3/index.ts
export { PAYROLL_MANAGER_ABI } from './abi/payrollManager.abi';
export { usePayrollManager } from './hooks/usePayrollManager';
export type { PayrollParams } from './types/payrollManager';
```

### Multi-Contract Integration

For DApps with multiple interrelated contracts:

```typescript
// web3/hooks/useMultiContract.ts
export function useMultiContract() {
  const userRegistry = useUserRegistry();
  const payrollManager = usePayrollManager();
  const tokenManager = useTokenManager();

  // Combine multiple contract interactions
  const processPayroll = async (employeeId: string, amount: bigint) => {
    // 1. Verify employee exists in UserRegistry
    // 2. Calculate payment via PayrollManager
    // 3. Execute token transfer via TokenManager
  };

  return {
    userRegistry,
    payrollManager,
    tokenManager,
    processPayroll,
  };
}
```

---

## Import Patterns

### Recommended Import Style

```typescript
// ✅ RECOMMENDED: Single import from web3 module
import { 
  Web3Provider, 
  useUserRegistry, 
  CONTRACT_ADDRESSES,
  ROLES,
  isValidAddress,
  formatAddress 
} from '@/web3';

// ❌ AVOID: Multiple scattered imports
import { useUserRegistry } from '@/web3/hooks/useUserRegistry';
import { CONTRACT_ADDRESSES } from '@/web3/config/constants';
import { Web3Provider } from '@/web3/providers/web3-provider';
```

### Component Integration Examples

#### Main Layout/Provider Setup

```typescript
// app/layout.tsx
import { Web3Provider } from '@/web3';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
```

#### Component Using Contract Functions

```typescript
// components/EmployeeManagement.tsx
import { useUserRegistry, ROLES, isValidAddress } from '@/web3';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export function EmployeeManagement() {
  const { address, isConnected } = useAccount();
  const {
    registerEmployee,
    getAllEmployeesWithSensitiveData,
    hasRole,
    isLoading,
    error
  } = useUserRegistry();

  const [formData, setFormData] = useState({
    wallet: '',
    fullName: '',
    email: '',
    // ... other fields
  });

  // Check if current user has admin role
  const { data: isAdmin } = hasRole(
    ROLES.ADMIN_ROLE, 
    address as `0x${string}`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidAddress(formData.wallet)) {
      alert('Invalid wallet address');
      return;
    }

    if (!isAdmin) {
      alert('You need admin role to register employees');
      return;
    }

    try {
      await registerEmployee({
        wallet: formData.wallet as `0x${string}`,
        fullName: formData.fullName,
        email: formData.email,
        // ... other fields
      });
      
      alert('Employee registered successfully!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register employee');
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <h2>Employee Management</h2>
      {/* Your form UI here */}
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={isLoading || !isAdmin}>
          {isLoading ? 'Registering...' : 'Register Employee'}
        </button>
      </form>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

#### Role Management Component

```typescript
// components/RoleManagement.tsx
import { useUserRegistry, ROLES, ROLE_METADATA } from '@/web3';
import { useAccount } from 'wagmi';

export function RoleManagement() {
  const { address } = useAccount();
  const { grantRole, revokeRole, hasRole, isLoading } = useUserRegistry();

  const handleGrantRole = async (role: string, targetAddress: string) => {
    try {
      await grantRole(role as `0x${string}`, targetAddress as `0x${string}`);
      alert('Role granted successfully!');
    } catch (error) {
      console.error('Failed to grant role:', error);
    }
  };

  return (
    <div>
      <h2>Role Management</h2>
      {Object.entries(ROLE_METADATA).map(([roleId, metadata]) => (
        <div key={roleId}>
          <h3>{metadata.name}</h3>
          <p>{metadata.description}</p>
          <code>{roleId}</code>
          {/* Role management UI */}
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

### 1. File Organization

- **Keep ABIs separate**: Each contract should have its own ABI file
- **Modular hooks**: One hook per contract for better maintainability
- **Clear naming**: Use descriptive names that match contract functions
- **Documentation**: Comment all functions, especially role requirements

### 2. Error Handling

```typescript
// Always implement robust error handling
try {
  await contractFunction(params);
} catch (error) {
  const contractError = handleContractError(error);
  
  // Handle specific error types
  switch (contractError.reason) {
    case 'access_denied':
      showNotification('You do not have permission for this action');
      break;
    case 'user_rejected':
      showNotification('Transaction was cancelled');
      break;
    default:
      showNotification(`Error: ${contractError.message}`);
  }
}
```

### 3. Role Validation

```typescript
// Always validate roles before attempting protected operations
const { data: hasRequiredRole } = hasRole(ROLES.ADMIN_ROLE, address);

if (!hasRequiredRole) {
  return <div>Insufficient permissions</div>;
}

// Proceed with protected operation
```

### 4. Performance Optimization

```typescript
// Use query options to optimize performance
const { data } = useReadContract({
  // ... contract config
  query: {
    enabled: !!address && !!contractAddress,
    staleTime: 30000, // Cache for 30 seconds
    retry: 3,
  },
});
```

### 5. Type Safety

```typescript
// Always use proper TypeScript types
interface RegisterEmployeeParams {
  wallet: `0x${string}`;
  fullName: string;
  email: string;
  // ... other fields with proper types
}
```

---

## Next.js Integration

### 1. Environment Configuration

Create a `.env.local` file:

```bash
# Required environment variables
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0xYourContractAddress

# Optional: Chain-specific addresses
NEXT_PUBLIC_BSC_TESTNET_USER_REGISTRY=0xTestnetAddress
NEXT_PUBLIC_BSC_MAINNET_USER_REGISTRY=0xMainnetAddress
```

### 2. Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // Enable if you need server-side rendering with Web3
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
```

### 3. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/web3": ["./web3"],
      "@/web3/*": ["./web3/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## TypeScript Configuration

### 1. Type Definitions

```typescript
// web3/types/index.ts
export interface ContractError extends Error {
  code?: string;
  reason?: string;
  data?: any;
}

export interface RegisterEmployeeParams {
  wallet: `0x${string}`;
  fullName: string;
  email: string;
  country: string;
  position: string;
  skillPrincipal: string;
  skillSecundaria: string;
  skillTerciaria: string;
  otrasSkills: string[];
  monthlySalaryUSD: bigint;
  preferredToken: string;
  paymentWallet: `0x${string}`;
}

export interface EmployeeData {
  wallet: `0x${string}`;
  fullName: string;
  email: string;
  country: string;
  position: string;
  skillPrincipal: string;
  skillSecundaria: string;
  skillTerciaria: string;
  monthlySalaryUSD: bigint;
  preferredToken: string;
  paymentWallet: `0x${string}`;
  active: boolean;
}

export type RoleType = keyof typeof ROLES;

export interface RolePermissions {
  role: `0x${string}`;
  account: `0x${string}`;
  hasPermission: boolean;
}
```

### 2. ABI Type Generation

For better type safety, consider using tools like `wagmi cli` to generate types from your contract ABIs:

```bash
# Install wagmi cli
npm install -D @wagmi/cli

# Generate types
npx wagmi generate
```

---

## Testing and Debugging

### 1. Testing Role-Based Functions

```typescript
// Test role assignment and verification
describe('Role Management', () => {
  test('should grant admin role', async () => {
    const { grantRole, hasRole } = useUserRegistry();
    
    await grantRole(ROLES.ADMIN_ROLE, testAddress);
    
    const { data: hasAdminRole } = hasRole(ROLES.ADMIN_ROLE, testAddress);
    expect(hasAdminRole).toBe(true);
  });
});
```

### 2. Debugging Contract Interactions

```typescript
// Add logging for debugging
const executeWrite = useCallback(async (functionName: string, args: any[]) => {
  console.log(`Executing ${functionName} with args:`, args);
  console.log(`Connected wallet:`, walletClient?.account?.address);
  
  try {
    await writeContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: functionName as any,
      args: args as any,
    });
  } catch (error) {
    console.error(`Failed to execute ${functionName}:`, error);
    throw error;
  }
}, [writeContract, walletClient]);
```

### 3. Environment Validation

```typescript
// web3/utils/validation.ts
export const validateEnvironment = () => {
  const requiredVars = [
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
    'NEXT_PUBLIC_USER_REGISTRY_ADDRESS'
  ];
  
  const missing = requiredVars.filter(
    varName => !process.env[varName]
  );
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  return missing.length === 0;
};
```

---

## Migration Guide

### Migrating Existing Projects

Follow these steps to migrate an existing DApp to use this architecture:

#### Step 1: Backup Current Code

```bash
git checkout -b web3-refactor
git add .
git commit -m "Backup before Web3 refactor"
```

#### Step 2: Create Web3 Directory Structure

```bash
mkdir web3/{abi,config,hooks,providers,types,utils}
touch web3/index.ts
```

#### Step 3: Move Existing Files

1. **Move ABIs**: Extract contract ABIs from components to `/web3/abi/`
2. **Move Hooks**: Relocate contract hooks to `/web3/hooks/`
3. **Move Providers**: Transfer Web3 providers to `/web3/providers/`
4. **Move Constants**: Consolidate addresses and constants in `/web3/config/`

#### Step 4: Update Imports

Use find and replace to update imports throughout your project:

```bash
# Find all files with old imports
grep -r "from.*web3" --include="*.tsx" --include="*.ts" .

# Replace with new centralized imports
# Example: Replace specific imports with centralized import
```

#### Step 5: Test Functionality

1. Start development server: `npm run dev`
2. Test wallet connection
3. Test contract read functions
4. Test contract write functions
5. Verify role-based access control

#### Step 6: Clean Up

Remove old, unused files and consolidate duplicate code.

---

## Future Contract Integration

### Planning for Scalability

When designing your Web3 folder structure, consider these future needs:

#### 1. Multi-Chain Support

```typescript
// web3/config/chains.ts
export const CHAIN_CONFIG = {
  bsc: {
    USER_REGISTRY: "0x...",
    PAYROLL_MANAGER: "0x...",
  },
  ethereum: {
    USER_REGISTRY: "0x...",
    PAYROLL_MANAGER: "0x...",
  },
  polygon: {
    USER_REGISTRY: "0x...",
    PAYROLL_MANAGER: "0x...",
  },
};
```

#### 2. Contract Versioning

```typescript
// web3/abi/userRegistry.v2.abi.ts
export const USER_REGISTRY_V2_ABI = [
  // New version with additional functions
] as const;
```

#### 3. Feature Flags

```typescript
// web3/config/features.ts
export const FEATURES = {
  PAYROLL_AUTOMATION: process.env.NEXT_PUBLIC_ENABLE_PAYROLL === 'true',
  MULTI_TOKEN_SUPPORT: process.env.NEXT_PUBLIC_MULTI_TOKEN === 'true',
  ADVANCED_ROLES: process.env.NEXT_PUBLIC_ADVANCED_ROLES === 'true',
};
```

### Integration Checklist

When adding a new contract:

- [ ] Create ABI file with proper documentation
- [ ] Add contract address to constants
- [ ] Create dedicated hook following established patterns
- [ ] Add TypeScript types
- [ ] Update central index.ts exports
- [ ] Add role constants if applicable
- [ ] Create integration tests
- [ ] Update documentation
- [ ] Verify error handling
- [ ] Test role-based access control

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Access Denied" Errors

**Problem**: Functions with role modifiers failing
**Solution**: 
- Verify the connected wallet has the required role
- Check that `account` parameter is passed to `useReadContract`
- Ensure roles are properly assigned in the smart contract

```typescript
// Debug role assignment
const { data: hasRole } = hasRole(ROLES.ADMIN_ROLE, address);
console.log('User has admin role:', hasRole);
```

#### 2. "Module Not Found" Errors

**Problem**: Import errors after refactoring
**Solution**: 
- Check `tsconfig.json` path configuration
- Verify all exports in `web3/index.ts`
- Clear Next.js cache: `rm -rf .next`

#### 3. "Invalid Address" Errors

**Problem**: Address validation failing
**Solution**:
```typescript
import { isValidAddress } from '@/web3';

if (!isValidAddress(userInput)) {
  throw new Error('Invalid Ethereum address');
}
```

#### 4. RainbowKit Styling Issues

**Problem**: Wallet modal not displaying correctly
**Solution**:
```typescript
// Make sure to import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';
```

#### 5. Environment Variables Not Loading

**Problem**: Contract addresses undefined
**Solution**:
- Verify `.env.local` file exists and is properly formatted
- Restart development server after adding environment variables
- Check variable names have `NEXT_PUBLIC_` prefix for client-side access

---

## Conclusion

This blueprint provides a comprehensive guide for creating a scalable, maintainable Web3 connections folder structure. By following these patterns and practices, you'll be able to:

- **Efficiently manage multiple smart contracts** with role-based access control
- **Maintain clean, organized code** that's easy to understand and modify
- **Scale your DApp** to include new contracts without major refactoring
- **Provide excellent developer experience** with centralized imports and clear documentation
- **Handle complex role-based permissions** correctly and securely

### Key Takeaways

1. **Centralization is Key**: Use a single index.ts file for all exports
2. **Role Handling**: Always pass the `account` parameter for role-protected functions
3. **Type Safety**: Leverage TypeScript for better development experience
4. **Error Handling**: Implement comprehensive error handling for all contract interactions
5. **Documentation**: Document roles, permissions, and usage patterns clearly
6. **Testing**: Test role-based functionality thoroughly
7. **Scalability**: Design the structure to accommodate future contracts easily

### Next Steps

1. **Implement this structure** in your current project
2. **Test thoroughly** with different user roles and permissions
3. **Document your specific contracts** and their role requirements
4. **Create reusable components** for common Web3 operations
5. **Consider automated testing** for contract interactions
6. **Plan for multi-chain deployment** if applicable

This blueprint serves as a foundation that can be adapted to various DApp architectures while maintaining consistency and best practices across projects.

---

**Version**: 1.0.0  
**Last Updated**: July 2025  
**Compatible With**: Next.js 14+, Wagmi 2+, Viem 2+, RainbowKit 2+, TypeScript 5+  
**License**: MIT
