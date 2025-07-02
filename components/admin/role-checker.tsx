"use client"

import { useAccount, useReadContract } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, Network } from "lucide-react"
import { CONTRACT_ADDRESSES } from "@/web3/constants/addresses"

// Access Control ABI for role checking
const ACCESS_CONTROL_ABI = [
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
] as const

// Role constants (keccak256 hashes)
const ROLES = {
  ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000",
  COMPLIANCE_ROLE: "0x8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c",
  PAYROLL_ROLE: "0x7b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c",
  OPERATOR_ROLE: "0x6b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c",
  FINANCE_ROLE: "0x5b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c",
  AUDITOR_ROLE: "0x4b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c8b5c2e3c",
}

export function RoleChecker() {
  const { address, isConnected, chain } = useAccount()

  // Check admin role
  const { data: isAdmin } = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: ACCESS_CONTROL_ABI,
    functionName: "hasRole",
    args: [ROLES.ADMIN_ROLE, address!],
    query: { enabled: !!address && isConnected },
  })

  // Check other roles
  const { data: isCompliance } = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: ACCESS_CONTROL_ABI,
    functionName: "hasRole",
    args: [ROLES.COMPLIANCE_ROLE, address!],
    query: { enabled: !!address && isConnected },
  })

  const { data: isPayroll } = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: ACCESS_CONTROL_ABI,
    functionName: "hasRole",
    args: [ROLES.PAYROLL_ROLE, address!],
    query: { enabled: !!address && isConnected },
  })

  const { data: isOperator } = useReadContract({
    address: CONTRACT_ADDRESSES.USER_REGISTRY,
    abi: ACCESS_CONTROL_ABI,
    functionName: "hasRole",
    args: [ROLES.OPERATOR_ROLE, address!],
    query: { enabled: !!address && isConnected },
  })

  const isWrongNetwork = isConnected && chain && ![bsc.id, bscTestnet.id].includes(chain.id)

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Wallet Not Connected
          </CardTitle>
          <CardDescription>Please connect your wallet to check permissions</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isWrongNetwork) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-destructive" />
            Wrong Network
          </CardTitle>
          <CardDescription>Please switch to BSC Testnet or BSC Mainnet</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Contract is deployed on BSC networks only. Current network: {chain?.name}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const userRoles = [
    { name: "Admin", hasRole: isAdmin, color: "bg-red-600" },
    { name: "Compliance", hasRole: isCompliance, color: "bg-blue-600" },
    { name: "Payroll", hasRole: isPayroll, color: "bg-green-600" },
    { name: "Operator", hasRole: isOperator, color: "bg-purple-600" },
  ].filter((role) => role.hasRole)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role & Permissions
        </CardTitle>
        <CardDescription>Your roles on BSC {chain?.id === bscTestnet.id ? "Testnet" : "Mainnet"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Connected Address:</p>
          <code className="text-xs bg-muted p-2 rounded block break-all">{address}</code>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Contract Address:</p>
          <code className="text-xs bg-muted p-2 rounded block break-all">{CONTRACT_ADDRESSES.USER_REGISTRY}</code>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Your Roles:</p>
          <div className="flex flex-wrap gap-2">
            {userRoles.length > 0 ? (
              userRoles.map((role) => (
                <Badge key={role.name} className={role.color}>
                  {role.name}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary">No roles assigned</Badge>
            )}
          </div>
          {userRoles.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              You need admin or authorized roles to interact with the contract
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
