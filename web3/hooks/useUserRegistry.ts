"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { useState, useCallback } from "react";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import type {
  RegisterEmployeeParams,
  UpdateEmployeeGeneralParams,
  ContractError,
} from "../types";

// Role constants from your contract
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
};

const USER_REGISTRY_ABI = [
  // Write functions
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "string", name: "fullName", type: "string" },
      { internalType: "string", name: "email", type: "string" },
      { internalType: "string", name: "country", type: "string" },
      { internalType: "string", name: "position", type: "string" },
      { internalType: "string", name: "skillPrincipal", type: "string" },
      { internalType: "string", name: "skillSecundaria", type: "string" },
      { internalType: "string", name: "skillTerciaria", type: "string" },
      { internalType: "string[]", name: "otrasSkills", type: "string[]" },
      { internalType: "uint256", name: "monthlySalaryUSD", type: "uint256" },
      { internalType: "string", name: "preferredToken", type: "string" },
      { internalType: "address", name: "paymentWallet", type: "address" },
    ],
    name: "registerEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "string", name: "fullName", type: "string" },
      { internalType: "string", name: "email", type: "string" },
      { internalType: "string", name: "country", type: "string" },
      { internalType: "string", name: "position", type: "string" },
      { internalType: "string", name: "preferredToken", type: "string" },
    ],
    name: "updateEmployeeGeneralData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "string", name: "skillPrincipal", type: "string" },
      { internalType: "string", name: "skillSecundaria", type: "string" },
      { internalType: "string", name: "skillTerciaria", type: "string" },
      { internalType: "string[]", name: "otrasSkills", type: "string[]" },
    ],
    name: "updateEmployeeSkills",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "uint256", name: "newSalary", type: "uint256" },
    ],
    name: "updateEmployeeSalary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "address", name: "newWallet", type: "address" },
    ],
    name: "updateEmployeeWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "deactivateEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "activateEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Read functions
  {
    inputs: [],
    name: "getAllEmployeesWithSensitiveData",
    outputs: [
      {
        components: [
          { internalType: "address", name: "wallet", type: "address" },
          { internalType: "string", name: "fullName", type: "string" },
          { internalType: "string", name: "email", type: "string" },
          { internalType: "string", name: "country", type: "string" },
          { internalType: "string", name: "position", type: "string" },
          { internalType: "string", name: "skillPrincipal", type: "string" },
          { internalType: "string", name: "skillSecundaria", type: "string" },
          { internalType: "string", name: "skillTerciaria", type: "string" },
          {
            internalType: "uint256",
            name: "monthlySalaryUSD",
            type: "uint256",
          },
          { internalType: "string", name: "preferredToken", type: "string" },
          { internalType: "address", name: "paymentWallet", type: "address" },
          { internalType: "bool", name: "active", type: "bool" },
        ],
        internalType: "struct UserRegistry.EmployeeView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "getEmployeeMetadata",
    outputs: [
      { internalType: "string", name: "country", type: "string" },
      { internalType: "string", name: "position", type: "string" },
      { internalType: "string", name: "skillPrincipal", type: "string" },
      { internalType: "string", name: "skillSecundaria", type: "string" },
      { internalType: "string", name: "skillTerciaria", type: "string" },
      { internalType: "string[]", name: "otrasSkills", type: "string[]" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "getSensitiveEmployeeData",
    outputs: [
      { internalType: "string", name: "fullName", type: "string" },
      { internalType: "string", name: "email", type: "string" },
      { internalType: "uint256", name: "monthlySalaryUSD", type: "uint256" },
      { internalType: "address", name: "paymentWallet", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "isActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Access Control Functions
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
    name: "revokeRole",
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
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useUserRegistry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Helper function for write operations
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
        const error = err as ContractError;
        setError(error);
        throw error;
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
