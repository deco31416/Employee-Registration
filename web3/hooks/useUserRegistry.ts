"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useState, useCallback } from "react"
import { CONTRACT_ADDRESSES } from "../constants/addresses"
import type { RegisterEmployeeParams, UpdateEmployeeGeneralParams, ContractError } from "../types"

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
          { internalType: "uint256", name: "monthlySalaryUSD", type: "uint256" },
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
] as const

export function useUserRegistry() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ContractError | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Helper function for write operations
  const executeWrite = useCallback(
    async (functionName: string, args: any[]) => {
      try {
        setIsLoading(true)
        setError(null)

        await writeContract({
          address: CONTRACT_ADDRESSES.USER_REGISTRY,
          abi: USER_REGISTRY_ABI,
          functionName: functionName as any,
          args,
        })
      } catch (err) {
        const error = err as ContractError
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [writeContract],
  )

  // Read functions
  const getAllEmployeesWithSensitiveData = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: USER_REGISTRY_ABI,
    functionName: "getAllEmployeesWithSensitiveData",
  })

  const getEmployeeMetadata = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "getEmployeeMetadata",
      args: [wallet],
      query: { enabled: !!wallet },
    })

  const getSensitiveEmployeeData = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "getSensitiveEmployeeData",
      args: [wallet],
      query: { enabled: !!wallet },
    })

  const isActive = (wallet: `0x${string}`) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.USER_REGISTRY,
      abi: USER_REGISTRY_ABI,
      functionName: "isActive",
      args: [wallet],
      query: { enabled: !!wallet },
    })

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
      otrasSkills: string[],
    ) => executeWrite("updateEmployeeSkills", [wallet, skillPrincipal, skillSecundaria, skillTerciaria, otrasSkills]),

    updateEmployeeSalary: (wallet: `0x${string}`, newSalary: bigint) =>
      executeWrite("updateEmployeeSalary", [wallet, newSalary]),

    updateEmployeeWallet: (wallet: `0x${string}`, newWallet: `0x${string}`) =>
      executeWrite("updateEmployeeWallet", [wallet, newWallet]),

    deactivateEmployee: (wallet: `0x${string}`) => executeWrite("deactivateEmployee", [wallet]),

    activateEmployee: (wallet: `0x${string}`) => executeWrite("activateEmployee", [wallet]),

    // Read functions
    getAllEmployeesWithSensitiveData,
    getEmployeeMetadata,
    getSensitiveEmployeeData,
    isActive,
  }
}
