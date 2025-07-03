"use client"

import type React from "react"

import { useState } from "react"
import { useUserRegistry } from "@/web3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus } from "lucide-react"

interface RegisterEmployeeFormProps {
  onSuccess?: () => void
}

export function RegisterEmployeeForm({ onSuccess }: RegisterEmployeeFormProps) {
  const { registerEmployee, isLoading } = useUserRegistry()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    wallet: "",
    fullName: "",
    email: "",
    country: "",
    position: "",
    skillPrincipal: "",
    skillSecundaria: "",
    skillTerciaria: "",
    otrasSkills: "",
    monthlySalaryUSD: "",
    preferredToken: "USDC",
    paymentWallet: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const otrasSkillsArray = formData.otrasSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      await registerEmployee({
        wallet: formData.wallet as `0x${string}`,
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country,
        position: formData.position,
        skillPrincipal: formData.skillPrincipal,
        skillSecundaria: formData.skillSecundaria,
        skillTerciaria: formData.skillTerciaria,
        otrasSkills: otrasSkillsArray,
        monthlySalaryUSD: BigInt(formData.monthlySalaryUSD),
        preferredToken: formData.preferredToken,
        paymentWallet: formData.paymentWallet as `0x${string}`,
      })

      toast({
        title: "Employee registered successfully",
        description: `${formData.fullName} has been added to the registry.`,
      })

      // Reset form
      setFormData({
        wallet: "",
        fullName: "",
        email: "",
        country: "",
        position: "",
        skillPrincipal: "",
        skillSecundaria: "",
        skillTerciaria: "",
        otrasSkills: "",
        monthlySalaryUSD: "",
        preferredToken: "USDC",
        paymentWallet: "",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Failed to register employee. Please check your permissions and try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Register New Employee
        </CardTitle>
        <CardDescription>Add a new employee to the registry with their details and skills.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Employee Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="0x..."
                value={formData.wallet}
                onChange={(e) => handleInputChange("wallet", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentWallet">Payment Wallet Address</Label>
              <Input
                id="paymentWallet"
                placeholder="0x..."
                value={formData.paymentWallet}
                onChange={(e) => handleInputChange("paymentWallet", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Software Engineer"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skillPrincipal">Primary Skill</Label>
              <Input
                id="skillPrincipal"
                placeholder="React"
                value={formData.skillPrincipal}
                onChange={(e) => handleInputChange("skillPrincipal", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillSecundaria">Secondary Skill</Label>
              <Input
                id="skillSecundaria"
                placeholder="Node.js"
                value={formData.skillSecundaria}
                onChange={(e) => handleInputChange("skillSecundaria", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillTerciaria">Tertiary Skill</Label>
              <Input
                id="skillTerciaria"
                placeholder="TypeScript"
                value={formData.skillTerciaria}
                onChange={(e) => handleInputChange("skillTerciaria", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otrasSkills">Other Skills (comma separated)</Label>
            <Textarea
              id="otrasSkills"
              placeholder="Python, Docker, AWS, etc."
              value={formData.otrasSkills}
              onChange={(e) => handleInputChange("otrasSkills", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlySalaryUSD">Monthly Salary (USD)</Label>
              <Input
                id="monthlySalaryUSD"
                type="number"
                placeholder="5000"
                value={formData.monthlySalaryUSD}
                onChange={(e) => handleInputChange("monthlySalaryUSD", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredToken">Preferred Token</Label>
              <Input
                id="preferredToken"
                placeholder="USDC"
                value={formData.preferredToken}
                onChange={(e) => handleInputChange("preferredToken", e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Employee...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Register Employee
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
