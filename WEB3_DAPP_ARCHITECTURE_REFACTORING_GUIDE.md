# 🏗️ Web3 DApp Architecture Refactoring Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture Design](#architecture-design)
3. [Migration Steps](#migration-steps)
4. [File Structure](#file-structure)
5. [Implementation Guide](#implementation-guide)
6. [Import Patterns](#import-patterns)
7. [Best Practices](#best-practices)
8. [Lessons Learned](#lessons-learned)
9. [Future Project Migration](#future-project-migration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide documents the complete refactoring process for organizing Web3 connections in a Next.js DApp, moving from scattered imports to a centralized, scalable architecture. The refactoring maintains 100% functionality while improving maintainability, scalability, and developer experience.

### Technology Stack
- **Frontend**: Next.js 14+ with TypeScript
- **Web3 Stack**: Wagmi, Viem, RainbowKit
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI (shadcn/ui)

### Goals Achieved
- ✅ Centralized Web3 configuration and exports
- ✅ Scalable architecture for multiple smart contracts
- ✅ Enhanced error handling and utilities
- ✅ Improved developer experience with single import pattern
- ✅ Zero breaking changes during migration
- ✅ Future-proof structure for contract integration

---

## Architecture Design

### Before Refactoring
```
project/
├── components/
│   ├── admin/
│   │   ├── role-management.tsx     // import from @/web3/hooks/useUserRegistry
│   │   └── quick-role-setup.tsx    // import from @/web3/hooks/useUserRegistry
│   └── contract/
│       ├── read-functions.tsx      // import from @/web3/hooks/useUserRegistry
│       └── write-functions.tsx     // import from @/web3/hooks/useUserRegistry
├── web3/
│   ├── hooks/
│   │   └── useUserRegistry.ts      // Contains ABI + logic
│   ├── providers/
│   │   ├── web3-provider.tsx
│   │   └── wagmi.ts
│   ├── constants/
│   │   └── addresses.ts
│   └── types/
│       └── index.ts
```

### After Refactoring
```
project/
├── components/
│   ├── admin/
│   │   ├── role-management.tsx     // import from @/web3
│   │   └── quick-role-setup.tsx    // import from @/web3
│   └── contract/
│       ├── read-functions.tsx      // import from @/web3
│       └── write-functions.tsx     // import from @/web3
├── web3/
│   ├── index.ts                    // 🎯 Central export hub
│   ├── abi/
│   │   └── userRegistry.abi.ts     // Separated ABI with documentation
│   ├── config/
│   │   ├── constants.ts            // Environment and contract config
│   │   └── wagmi.ts               // Wagmi configuration
│   ├── hooks/
│   │   └── useUserRegistry.ts      // Pure hook logic
│   ├── providers/
│   │   └── web3-provider.tsx       // Enhanced provider
│   ├── types/
│   │   └── index.ts               // TypeScript definitions
│   └── utils/
│       └── helpers.ts             // Web3 utilities
```

---

## Migration Steps

### Step 1: Create New Directory Structure

```bash
mkdir web3/abi
mkdir web3/config
mkdir web3/utils
```

### Step 2: Extract and Organize ABIs

Create dedicated ABI files with proper documentation:

```typescript
// web3/abi/contractName.abi.ts
/**
 * Contract Name ABI
 * 
 * This ABI contains all functions for the ContractName smart contract:
 * - Function category 1 (description)
 * - Function category 2 (description)
 * 
 * @version 1.0.0
 */

export const CONTRACT_NAME_ABI = [
  // ABI definition here
] as const;

export type ContractNameABI = typeof CONTRACT_NAME_ABI;
```

### Step 3: Centralize Configuration

```typescript
// web3/config/constants.ts
export const CONTRACT_ADDRESSES = {
  CONTRACT_NAME: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) || "0x...",
} as const;

export const SUPPORTED_CHAINS = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
} as const;

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "DApp Name",
  version: "1.0.0",
} as const;
```

### Step 4: Create Utility Functions

```typescript
// web3/utils/helpers.ts
import { isAddress } from "viem";

export const isValidAddress = (address: string): address is `0x${string}` => {
  return isAddress(address);
};

export const formatAddress = (address: string, startLength = 6, endLength = 4): string => {
  if (!isValidAddress(address)) return address;
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export const handleContractError = (error: any): ContractError => {
  // Enhanced error handling logic
};
```

### Step 5: Refactor Hooks

Remove ABI from hooks and import from dedicated files:

```typescript
// web3/hooks/useContractName.ts
import { USER_REGISTRY_ABI } from "../abi/userRegistry.abi";
import { CONTRACT_ADDRESSES } from "../config/constants";
import { handleContractError } from "../utils/helpers";

export function useContractName() {
  // Hook logic here
}
```

### Step 6: Create Central Export Hub

```typescript
// web3/index.ts
/**
 * Web3 Module - Centralized Export Hub
 * 
 * Import everything you need from this single module:
 * import { Web3Provider, useContract, CONTRACT_ADDRESSES } from '@/web3'
 */

// Providers
export { Web3Provider } from './providers/web3-provider';

// Configuration
export { CONTRACT_ADDRESSES, SUPPORTED_CHAINS, APP_CONFIG } from './config/constants';

// ABIs
export { CONTRACT_NAME_ABI } from './abi/contractName.abi';

// Hooks
export { useContractName } from './hooks/useContractName';

// Utilities
export { isValidAddress, formatAddress, handleContractError } from './utils/helpers';

// Types
export type { ContractParams, ContractError } from './types';
```

### Step 7: Update All Imports

Replace scattered imports with centralized imports:

```typescript
// Before
import { useUserRegistry, ROLES } from "@/web3/hooks/useUserRegistry"
import { CONTRACT_ADDRESSES } from "@/web3/constants/addresses"
import { Web3Provider } from "@/web3/providers/web3-provider"

// After
import { useUserRegistry, ROLES, CONTRACT_ADDRESSES, Web3Provider } from "@/web3"
```

### Step 8: Clean Up Legacy Files

Remove duplicate and unused files:
- Delete old `/constants` folder if moved to `/config`
- Remove duplicate configuration files
- Clean up unused imports

---

## File Structure

### Complete Web3 Directory Structure

```
web3/
├── index.ts                          # Central export hub
├── abi/
│   ├── userRegistry.abi.ts          # User Registry contract ABI
│   ├── payrollManager.abi.ts        # Future: Payroll Manager ABI
│   └── tokenManager.abi.ts          # Future: Token Manager ABI
├── config/
│   ├── constants.ts                 # Contract addresses, chains, app config
│   └── wagmi.ts                     # Wagmi configuration
├── hooks/
│   ├── useUserRegistry.ts           # User Registry hook
│   ├── usePayrollManager.ts         # Future: Payroll Manager hook
│   └── useTokenManager.ts           # Future: Token Manager hook
├── providers/
│   └── web3-provider.tsx            # Web3 provider with error boundaries
├── types/
│   └── index.ts                     # TypeScript type definitions
└── utils/
    └── helpers.ts                   # Web3 utility functions
```

### Key File Templates

#### ABI File Template
```typescript
// web3/abi/contractName.abi.ts
/**
 * Contract Name ABI
 * @version 1.0.0
 */

export const CONTRACT_NAME_ABI = [
  // Write functions
  {
    inputs: [/* ... */],
    name: "functionName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Read functions
  {
    inputs: [/* ... */],
    name: "viewFunction",
    outputs: [/* ... */],
    stateMutability: "view", 
    type: "function",
  },
] as const;

export type ContractNameABI = typeof CONTRACT_NAME_ABI;
```

#### Hook Template
```typescript
// web3/hooks/useContractName.ts
"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { useState, useCallback } from "react";
import { CONTRACT_NAME_ABI } from "../abi/contractName.abi";
import { CONTRACT_ADDRESSES } from "../config/constants";
import { handleContractError } from "../utils/helpers";

export function useContractName() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const executeWrite = useCallback(async (functionName: string, args: any[]) => {
    try {
      setIsLoading(true);
      setError(null);
      await writeContract({
        address: CONTRACT_ADDRESSES.CONTRACT_NAME,
        abi: CONTRACT_NAME_ABI,
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
  }, [writeContract]);

  // Return hook interface
  return {
    // State
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    transactionHash: hash,
    
    // Write functions
    writeFunction: (params: any) => executeWrite("writeFunction", [params]),
    
    // Read functions
    readFunction: useReadContract({
      address: CONTRACT_ADDRESSES.CONTRACT_NAME,
      abi: CONTRACT_NAME_ABI,
      functionName: "readFunction",
    }),
  };
}
```

---

## Implementation Guide

### Enhanced Error Handling

```typescript
// web3/utils/helpers.ts
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
  }

  return contractError;
};
```

### Environment Validation

```typescript
// web3/config/constants.ts
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_PROJECT_ID_WALLETCONNECT',
    'NEXT_PUBLIC_CONTRACT_ADDRESS'
  ];
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
};
```

### Wagmi Configuration

```typescript
// web3/config/wagmi.ts
import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { WALLET_CONNECT_PROJECT_ID } from "./constants";

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "DApp Name",
        description: "DApp Description",
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

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
};
```

---

## Import Patterns

### Single Import Pattern

```typescript
// ✅ Recommended: Single import from web3 module
import { 
  Web3Provider, 
  useUserRegistry, 
  CONTRACT_ADDRESSES,
  ROLES,
  isValidAddress,
  formatAddress,
  handleContractError
} from "@/web3"

// ❌ Avoid: Multiple scattered imports
import { useUserRegistry } from "@/web3/hooks/useUserRegistry"
import { CONTRACT_ADDRESSES } from "@/web3/config/constants"
import { Web3Provider } from "@/web3/providers/web3-provider"
```

### Component Usage Examples

```typescript
// components/example-component.tsx
import { useUserRegistry, ROLES, isValidAddress } from "@/web3"

export function ExampleComponent() {
  const { 
    registerEmployee, 
    getAllEmployeesWithSensitiveData, 
    isLoading, 
    error 
  } = useUserRegistry();

  const handleSubmit = async (formData: any) => {
    if (!isValidAddress(formData.wallet)) {
      toast.error("Invalid wallet address");
      return;
    }

    try {
      await registerEmployee(formData);
      toast.success("Employee registered successfully");
    } catch (error) {
      toast.error("Failed to register employee");
    }
  };

  // Component logic...
}
```

### Provider Setup

```typescript
// app/layout.tsx or app/page.tsx
import { Web3Provider } from "@/web3"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
```

---

## Best Practices

### 1. **Separation of Concerns**
- ABIs in dedicated files with documentation
- Configuration separated from logic
- Utilities in separate module
- Types in dedicated file

### 2. **Error Handling**
```typescript
// Enhanced error handling in hooks
const executeWrite = useCallback(async (functionName: string, args: any[]) => {
  try {
    setIsLoading(true);
    setError(null);
    // Contract interaction
  } catch (err) {
    const contractError = handleContractError(err);
    setError(contractError);
    throw contractError; // Re-throw for component handling
  } finally {
    setIsLoading(false);
  }
}, []);
```

### 3. **Type Safety**
```typescript
// Strong typing for contract parameters
interface RegisterEmployeeParams {
  wallet: `0x${string}`;
  fullName: string;
  email: string;
  // ... other fields
}

// Type-safe ABI exports
export type UserRegistryABI = typeof USER_REGISTRY_ABI;
```

### 4. **Environment Configuration**
```typescript
// Support multiple environments
export const CONTRACT_ADDRESSES = {
  USER_REGISTRY: (process.env.NEXT_PUBLIC_USER_REGISTRY_ADDRESS as `0x${string}`) || 
    "0xDefaultAddress",
} as const;
```

### 5. **Documentation Standards**
```typescript
/**
 * Custom hook for interacting with UserRegistry smart contract
 * 
 * Provides methods for:
 * - Employee management (register, update, activate/deactivate)
 * - Role-based access control (grant, revoke, check roles)
 * - Data retrieval with proper error handling
 * 
 * @returns Object containing contract interaction methods and state
 */
export function useUserRegistry() {
  // Hook implementation
}
```

### 6. **Future-Proof Architecture**
```typescript
// web3/index.ts - Template for adding new contracts
export { useNewContract } from './hooks/useNewContract';
export { NEW_CONTRACT_ABI } from './abi/newContract.abi';
// Add contract address to constants.ts
// Import and export here
```

---

## Lessons Learned

### 1. **Centralization Benefits**
- **Single Import Pattern**: Reduces cognitive load and improves DX
- **Consistent Error Handling**: Centralized error handling improves UX
- **Easier Refactoring**: Changes to contract interactions only affect the web3 module
- **Better Testing**: Isolated Web3 logic is easier to test

### 2. **Scalability Considerations**
- **ABI Separation**: Large ABIs in dedicated files improve maintainability
- **Modular Hooks**: Separate hooks for each contract prevent coupling
- **Configuration Management**: Environment-based configuration supports multiple deployments
- **Utility Functions**: Reusable utilities reduce code duplication

### 3. **Migration Strategy**
- **Incremental Approach**: Migrate one contract at a time to avoid breaking changes
- **Backward Compatibility**: Maintain old imports during transition period
- **Testing Coverage**: Ensure all functionality works after migration
- **Documentation**: Document changes for team members

### 4. **Performance Optimizations**
- **Tree Shaking**: Proper exports enable better tree shaking
- **Code Splitting**: Separate modules can be lazy-loaded if needed
- **Bundle Size**: Centralized imports can reduce bundle size
- **Caching**: Better caching strategies with organized structure

### 5. **Developer Experience**
- **Auto-completion**: Better TypeScript inference with proper exports
- **Import Organization**: Cleaner import statements
- **Error Messages**: More meaningful error messages with centralized handling
- **Debugging**: Easier to trace issues with organized structure

---

## Future Project Migration

### Pre-Migration Checklist

- [ ] Identify all Web3-related files and dependencies
- [ ] Document current import patterns
- [ ] Create backup of current working state
- [ ] Plan migration order (start with least dependent modules)
- [ ] Prepare test cases to validate functionality

### Migration Steps for New Projects

1. **Initial Setup**
   ```bash
   mkdir web3/{abi,config,hooks,providers,types,utils}
   touch web3/index.ts
   ```

2. **Copy Structure**
   - Copy the directory structure from this project
   - Adapt configuration files for new project requirements
   - Update contract addresses and chain configurations

3. **Adapt ABIs**
   - Extract ABIs from existing hooks or contracts
   - Add proper documentation and typing
   - Follow naming conventions

4. **Configure Environment**
   - Set up environment variables
   - Configure supported chains
   - Set up WalletConnect project ID

5. **Migrate Hooks**
   - Create hooks following the template pattern
   - Implement error handling
   - Add proper TypeScript typing

6. **Update Imports**
   - Replace scattered imports with centralized imports
   - Test each component after import changes
   - Remove unused files

7. **Validation**
   - Run build process to check for errors
   - Test all Web3 functionality
   - Verify environment variable loading

### Adaptation for Different Tech Stacks

#### For Vite Projects
```typescript
// Adjust environment variable access
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
```

#### For Create React App
```typescript
// Use REACT_APP prefix
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
```

#### For Different Chains
```typescript
// web3/config/constants.ts
export const SUPPORTED_CHAINS = {
  ETHEREUM_MAINNET: 1,
  POLYGON_MAINNET: 137,
  ARBITRUM_MAINNET: 42161,
} as const;
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. **Import Errors After Migration**
```typescript
// Problem: Module not found
// Solution: Check tsconfig.json paths configuration
{
  "compilerOptions": {
    "paths": {
      "@/web3": ["./web3"],
      "@/web3/*": ["./web3/*"]
    }
  }
}
```

#### 2. **Environment Variables Not Loading**
```typescript
// Problem: Environment variables undefined
// Solution: Check .env file and restart dev server
// Ensure variables have correct prefix (NEXT_PUBLIC_, VITE_, etc.)
```

#### 3. **Type Errors with ABIs**
```typescript
// Problem: ABI type errors
// Solution: Ensure proper const assertion
export const CONTRACT_ABI = [
  // ABI definition
] as const; // ← Important: const assertion
```

#### 4. **Hook Dependency Issues**
```typescript
// Problem: Circular dependencies
// Solution: Check import order and avoid circular references
// Use index.ts for clean exports
```

#### 5. **Bundle Size Issues**
```typescript
// Problem: Large bundle size
// Solution: Use dynamic imports for heavy utilities
const { heavyUtility } = await import("@/web3/utils/heavy");
```

### Performance Monitoring

```typescript
// Add performance monitoring to hooks
export function useUserRegistry() {
  const startTime = performance.now();
  
  useEffect(() => {
    const endTime = performance.now();
    console.log(`Hook initialization took ${endTime - startTime} milliseconds`);
  }, []);
  
  // Rest of hook
}
```

---

## Conclusion

This architecture refactoring provides a solid foundation for scalable Web3 DApp development. The centralized approach reduces complexity, improves maintainability, and creates a clear path for future contract integrations.

### Key Benefits Achieved

- **🎯 Centralized Management**: Single point of control for all Web3 interactions
- **📈 Scalability**: Easy addition of new contracts without major refactoring
- **🛠️ Developer Experience**: Simplified imports and better error handling
- **🔧 Maintainability**: Clear separation of concerns and organized structure
- **⚡ Performance**: Optimized bundle size and better tree shaking
- **🔒 Type Safety**: Strong TypeScript integration throughout

### Next Steps

1. Apply this architecture to new projects
2. Extend with additional contracts using the established patterns
3. Consider implementing automated testing for Web3 interactions
4. Add comprehensive error reporting and monitoring
5. Create component libraries for common Web3 UI patterns

This guide serves as a blueprint for implementing clean, scalable Web3 architecture in React/Next.js applications while maintaining compatibility with modern Web3 libraries.

---

**Version**: 1.0.0  
**Last Updated**: July 2025  
**Compatible With**: Next.js 14+, Wagmi 2+, Viem 2+, TypeScript 5+
