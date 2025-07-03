/**
 * Web3 Module - Centralized Export Hub
 * 
 * This is the main entry point for all Web3-related functionality.
 * Import everything you need from this single module to keep imports clean and organized.
 * 
 * Usage Examples:
 * 
 * // Import the main provider
 * import { Web3Provider } from '@/web3'
 * 
 * // Import hooks
 * import { useUserRegistry } from '@/web3'
 * 
 * // Import constants and configuration
 * import { CONTRACT_ADDRESSES, ROLES, APP_CONFIG } from '@/web3'
 * 
 * // Import utilities
 * import { isValidAddress, formatAddress, handleContractError } from '@/web3'
 * 
 * // Import types
 * import type { RegisterEmployeeParams, ContractError } from '@/web3'
 * 
 * @version 1.0.0
 * @author Payroll Manager Team
 */

// === PROVIDERS ===
export { Web3Provider } from './providers/web3-provider';

// === CONFIGURATION ===
export { wagmiConfig, queryClientConfig } from './config/wagmi';
export { 
  CONTRACT_ADDRESSES, 
  SUPPORTED_CHAINS, 
  WALLET_CONNECT_PROJECT_ID, 
  APP_CONFIG, 
  ROLES,
  validateEnvironment 
} from './config/constants';

// === ABIs ===
export { USER_REGISTRY_ABI } from './abi/userRegistry.abi';
export type { UserRegistryABI } from './abi/userRegistry.abi';

// === HOOKS ===
export { useUserRegistry } from './hooks/useUserRegistry';
// Future contract hooks can be exported here:
// export { usePayrollManager } from './hooks/usePayrollManager';
// export { useTokenManager } from './hooks/useTokenManager';

// === UTILITIES ===
export { 
  isValidAddress, 
  formatAddress, 
  formatTokenAmount, 
  parseTokenAmount, 
  handleContractError, 
  isContractError, 
  delay, 
  retryWithBackoff 
} from './utils/helpers';

// === TYPES ===
export type {
  Employee,
  EmployeeView,
  RegisterEmployeeParams,
  UpdateEmployeeGeneralParams,
  UpdateEmployeeSkillsParams,
  UserRole,
  ContractError
} from './types';

// === LEGACY COMPATIBILITY ===
// Re-export ROLES from hooks for backward compatibility
export { ROLES as LEGACY_ROLES } from './hooks/useUserRegistry';

/**
 * Future Contract Integration Template
 * 
 * When adding new contracts, follow this pattern:
 * 
 * 1. Add ABI to /abi/contractName.abi.ts
 * 2. Add contract address to /config/constants.ts
 * 3. Create hook in /hooks/useContractName.ts
 * 4. Export everything from this index.ts file
 * 
 * Example:
 * export { PAYROLL_MANAGER_ABI } from './abi/payrollManager.abi';
 * export { usePayrollManager } from './hooks/usePayrollManager';
 */
