"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useUserRegistry } from "@/web3/hooks/useUserRegistry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, RefreshCw } from "lucide-react"
import { EmployeeList } from "./employee-list"
import { RegisterEmployeeForm } from "./register-employee-form"

export function EmployeeRegistry() {
  const { isConnected } = useAccount()
  const { employees, isLoadingEmployees, refetchEmployees } = useUserRegistry()
  const [activeTab, setActiveTab] = useState("list")

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            Employee Registry
          </CardTitle>
          <CardDescription>Connect your wallet to access the employee registry</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Registry
            </CardTitle>
            <CardDescription>Manage employees and their information</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{employees?.length || 0} employees</Badge>
            <Button variant="outline" size="sm" onClick={() => refetchEmployees()} disabled={isLoadingEmployees}>
              <RefreshCw className={`h-4 w-4 ${isLoadingEmployees ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Employee List</TabsTrigger>
            <TabsTrigger value="register">
              <Plus className="h-4 w-4 mr-2" />
              Register New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <EmployeeList employees={employees} isLoading={isLoadingEmployees} />
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <RegisterEmployeeForm
              onSuccess={() => {
                refetchEmployees()
                setActiveTab("list")
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
