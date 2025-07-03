// Perfect! Here are the TypeScript interfaces and types for the employee management system:

export interface Employee {
  fullName: string
  email: string
  country: string
  position: string
  skillPrincipal: string
  skillSecundaria: string
  skillTerciaria: string
  otrasSkills: string[]
  monthlySalaryUSD: bigint
  preferredToken: string
  paymentWallet: `0x${string}`
  active: boolean
}

export interface EmployeeView {
  wallet: `0x${string}`
  fullName: string
  email: string
  country: string
  position: string
  skillPrincipal: string
  skillSecundaria: string
  skillTerciaria: string
  monthlySalaryUSD: bigint
  preferredToken: string
  paymentWallet: `0x${string}`
  active: boolean
}

export interface RegisterEmployeeParams {
  wallet: `0x${string}`
  fullName: string
  email: string
  country: string
  position: string
  skillPrincipal: string
  skillSecundaria: string
  skillTerciaria: string
  otrasSkills: string[]
  monthlySalaryUSD: bigint
  preferredToken: string
  paymentWallet: `0x${string}`
}

export interface UpdateEmployeeGeneralParams {
  wallet: `0x${string}`
  fullName: string
  email: string
  country: string
  position: string
  preferredToken: string
}

export interface UpdateEmployeeSkillsParams {
  wallet: `0x${string}`
  skillPrincipal: string
  skillSecundaria: string
  skillTerciaria: string
  otrasSkills: string[]
}

export type UserRole =
  | "ADMIN_ROLE"
  | "COMPLIANCE_ROLE"
  | "PAYROLL_ROLE"
  | "OPERATOR_ROLE"
  | "FINANCE_ROLE"
  | "AUDITOR_ROLE"

export interface ContractError extends Error {
  code?: string
  reason?: string
}
