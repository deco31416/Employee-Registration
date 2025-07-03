/**
 * User Registry Contract ABI
 * 
 * This ABI contains all the functions for the UserRegistry smart contract:
 * - Employee management (register, update, activate/deactivate)
 * - Role-based access control (grant, revoke, check roles)
 * - Data retrieval (public and sensitive data)
 * 
 * @version 1.0.0
 */

export const USER_REGISTRY_ABI = [
  // Write functions - Employee Management
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
  
  // Read functions - Data Retrieval
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
  
  // Access Control Functions - Role Management
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

/**
 * Type definitions derived from ABI
 */
export type UserRegistryABI = typeof USER_REGISTRY_ABI;
