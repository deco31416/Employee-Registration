"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { useState, useCallback } from "react";
import { USER_REGISTRY_ABI } from "../abi/userRegistry.abi";
import { CONTRACT_ADDRESSES } from "../config/constants";
import { handleContractError } from "../utils/helpers";
import type {
  RegisterEmployeeParams,
  UpdateEmployeeGeneralParams,
  ContractError,
} from "../types";

// Role constants re-exported for backward compatibility
export { ROLES } from "../config/constants";

/**
 * Custom hook for interacting with the UserRegistry smart contract
 * 
 * Provides methods for:
 * - Employee management (register, update, activate/deactivate)
 * - Role-based access control (grant, revoke, check roles)
 * - Data retrieval with proper error handling
 * 
 * @returns Object containing contract interaction methods and state
 */

export function useUserRegistry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Helper function for write operations with enhanced error handling
  const executeWrite = useCallback(
    async (functionName: string, args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);

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
    [writeContract]
  );

  const { data: walletClient } = useWalletClient();

  // Read functions
  const getAllEmployeesWithSensitiveData = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: USER_REGISTRY_ABI,
    functionName: "getAllEmployeesWithSensitiveData",
    account: walletClient?.account?.address, // 👈
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
    account: walletClient?.account?.address, // 👈 para que msg.sender sea correcto
    query: { enabled: !!wallet && !!walletClient?.account?.address },
  });

  const getSensitiveEmployeeData = (wallet: `0x${string}`) =>
  useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: USER_REGISTRY_ABI,
    functionName: "getSensitiveEmployeeData",
    args: [wallet],
    account: walletClient?.account?.address,  // 👈
    query: { enabled: !!wallet && !!walletClient?.account?.address },
  });


  const isActive = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "isActive",
      args: [wallet],
      query: { enabled: !!wallet },
    });

  // Role management functions
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

  return {
    // States
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    transactionHash: hash,

    // Write functions
    registerEmployee: (params: RegisterEmployeeParams) =>
      executeWrite("registerEmployee", [
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
      ]),

    updateEmployeeGeneralData: (params: UpdateEmployeeGeneralParams) =>
      executeWrite("updateEmployeeGeneralData", [
        params.wallet,
        params.fullName,
        params.email,
        params.country,
        params.position,
        params.preferredToken,
      ]),

    updateEmployeeSkills: (
      wallet: `0x${string}`,
      skillPrincipal: string,
      skillSecundaria: string,
      skillTerciaria: string,
      otrasSkills: string[]
    ) =>
      executeWrite("updateEmployeeSkills", [
        wallet,
        skillPrincipal,
        skillSecundaria,
        skillTerciaria,
        otrasSkills,
      ]),

    updateEmployeeSalary: (wallet: `0x${string}`, newSalary: bigint) =>
      executeWrite("updateEmployeeSalary", [wallet, newSalary]),

    updateEmployeeWallet: (wallet: `0x${string}`, newWallet: `0x${string}`) =>
      executeWrite("updateEmployeeWallet", [wallet, newWallet]),

    deactivateEmployee: (wallet: `0x${string}`) =>
      executeWrite("deactivateEmployee", [wallet]),

    activateEmployee: (wallet: `0x${string}`) =>
      executeWrite("activateEmployee", [wallet]),

    // Role management functions
    grantRole: (role: `0x${string}`, account: `0x${string}`) =>
      executeWrite("grantRole", [role, account]),

    revokeRole: (role: `0x${string}`, account: `0x${string}`) =>
      executeWrite("revokeRole", [role, account]),

    // Read functions
    getAllEmployeesWithSensitiveData,
    getEmployeeMetadata,
    getSensitiveEmployeeData,
    isActive,
    hasRole,
    getRoleAdmin,
  };
}
