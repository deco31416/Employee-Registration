"use client"

import type { EmployeeView } from "@/web3/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, MapPin, Briefcase, DollarSign, Wallet } from "lucide-react"

interface EmployeeListProps {
  employees?: EmployeeView[]
  isLoading: boolean
}

export function EmployeeList({ employees, isLoading }: EmployeeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No employees found</h3>
          <p className="text-muted-foreground">No employees have been registered yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <Card key={employee.wallet}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {employee.fullName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {employee.email}
                </CardDescription>
              </div>
              <Badge variant={employee.active ? "default" : "secondary"}>
                {employee.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{employee.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Position:</span>
                  <span>{employee.position}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Salary:</span>
                  <span>${employee.monthlySalaryUSD.toString()} USD</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {employee.skillPrincipal}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {employee.skillSecundaria}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {employee.skillTerciaria}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Payment:</span>
                  <span className="text-xs font-mono">
                    {employee.paymentWallet.slice(0, 6)}...{employee.paymentWallet.slice(-4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant={employee.active ? "destructive" : "default"} size="sm">
                {employee.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
