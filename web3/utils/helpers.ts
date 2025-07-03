/**
 * Web3 Utility Functions
 * 
 * Collection of utility functions for Web3 operations:
 * - Address validation
 * - Error handling
 * - Type guards
 * - Helper functions
 * 
 * @version 1.0.0
 */

import { isAddress } from "viem";
import type { ContractError } from "../types";

/**
 * Validates if a string is a valid Ethereum address
 * @param address - String to validate
 * @returns boolean indicating if address is valid
 */
export const isValidAddress = (address: string): address is `0x${string}` => {
  return isAddress(address);
};

/**
 * Formats an address for display (truncated)
 * @param address - Ethereum address to format
 * @param startLength - Number of characters from start (default: 6)
 * @param endLength - Number of characters from end (default: 4)
 * @returns Formatted address string
 */
export const formatAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string => {
  if (!isValidAddress(address)) return address;
  
  if (address.length <= startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Safely formats a BigInt value to string with proper decimals
 * @param value - BigInt value to format
 * @param decimals - Number of decimal places (default: 18)
 * @returns Formatted string
 */
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

/**
 * Parses a string amount to BigInt with proper decimals
 * @param amount - String amount to parse
 * @param decimals - Number of decimal places (default: 18)
 * @returns BigInt value
 */
export const parseTokenAmount = (
  amount: string,
  decimals: number = 18
): bigint => {
  try {
    const [integerPart, decimalPart = ''] = amount.split('.');
    const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);
    const fullAmount = integerPart + paddedDecimal;
    return BigInt(fullAmount);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return 0n;
  }
};

/**
 * Enhanced error handler for contract interactions
 * @param error - Error object from contract call
 * @returns Standardized ContractError
 */
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
    contractError.message = 'Transaction failed. Please check your inputs and try again';
    contractError.reason = 'execution_reverted';
  }

  return contractError;
};

/**
 * Type guard to check if an error is a ContractError
 * @param error - Error to check
 * @returns boolean indicating if error is ContractError
 */
export const isContractError = (error: any): error is ContractError => {
  return error && typeof error === 'object' && 'message' in error;
};

/**
 * Waits for a specified amount of time (useful for polling)
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retries a function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with the function result
 */
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
      await delay(delayTime);
    }
  }
  
  throw lastError!;
};
