"use client"

import { useEffect, useState } from "react"
import { Web3Provider } from "@/web3"
import { WalletConnection } from "@/components/wallet/wallet-connection"
import { RoleChecker } from "@/components/admin/role-checker"
import { QuickRoleSetup } from "@/components/admin/quick-role-setup"
import { RoleManagement } from "@/components/admin/role-management"
import { ReadFunctions } from "@/components/contract/read-functions"
import { WriteFunctions } from "@/components/contract/write-functions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </main>
    )
  }

  return (
    <Web3Provider>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-8">
            <header className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">Employee Registration</h1>
              <p className="text-muted-foreground">Employee registry and management on BSC</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WalletConnection />
              <RoleChecker />
            </div>

            <QuickRoleSetup />

            <Tabs defaultValue="read" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="read">📖 Read Functions</TabsTrigger>
                <TabsTrigger value="write">✏️ Write Functions</TabsTrigger>
                <TabsTrigger value="roles">👑 Role Management</TabsTrigger>
              </TabsList>

              <TabsContent value="read" className="mt-6">
                <ReadFunctions />
              </TabsContent>

              <TabsContent value="write" className="mt-6">
                <WriteFunctions />
              </TabsContent>

              <TabsContent value="roles" className="mt-6">
                <RoleManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </Web3Provider>
  )
}
