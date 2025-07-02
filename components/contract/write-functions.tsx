"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useUserRegistry } from "@/web3/hooks/useUserRegistry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  UserPlus, 
  Edit, 
  Award, 
  DollarSign, 
  Wallet, 
  UserX, 
  UserCheck, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff 
} from "lucide-react"

export function WriteFunctions() {
  const { isConnected, address } = useAccount()
  const { toast } = useToast()
  const {
    registerEmployee,
    updateEmployeeGeneralData,
    updateEmployeeSkills,
    updateEmployeeSalary,
    updateEmployeeWallet,
    deactivateEmployee,
    activateEmployee,
    isLoading,
    isSuccess,
    error,
    transactionHash,
  } = useUserRegistry()

  // Form states
  const [registerForm, setRegisterForm] = useState({
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

  const [generalForm, setGeneralForm] = useState({
    wallet: "",
    fullName: "",
    email: "",
    country: "",
    position: "",
    preferredToken: "USDC",
  })

  const [skillsForm, setSkillsForm] = useState({
    wallet: "",
    skillPrincipal: "",
    skillSecundaria: "",
    skillTerciaria: "",
    otrasSkills: "",
  })

  const [salaryForm, setSalaryForm] = useState({
    wallet: "",
    newSalary: "",
  })

  const [walletForm, setWalletForm] = useState({
    wallet: "",
    newWallet: "",
  })

  const [statusForm, setStatusForm] = useState({
    wallet: "",
  })

  // Helper function to render connection status
  const renderConnectionStatus = () => {
    if (!isConnected) {
      return (
        <Alert className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <strong>No conectado:</strong> Conecta tu wallet para ejecutar funciones de escritura en el contrato.
          </AlertDescription>
        </Alert>
      )
    }
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          <strong>Conectado:</strong> {address} - Puedes ejecutar transacciones en el contrato.
        </AlertDescription>
      </Alert>
    )
  }

  // Helper function to render transaction status
  const renderTransactionStatus = () => {
    if (isLoading) {
      return (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <strong>Procesando:</strong> Tu transacción está siendo procesada en la blockchain...
          </AlertDescription>
        </Alert>
      )
    }

    if (isSuccess && transactionHash) {
      return (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>¡Éxito!</strong> Transacción completada. Hash: 
            <code className="ml-1 text-xs bg-muted p-1 rounded">{transactionHash}</code>
          </AlertDescription>
        </Alert>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error.message || 'Error desconocido en la transacción'}
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  // Helper function to validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">✍️ Funciones de Escritura</h2>
        {renderConnectionStatus()}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff className="h-5 w-5" />
              Wallet No Conectado
            </CardTitle>
            <CardDescription>
              Necesitas conectar tu wallet para ejecutar funciones de escritura en el contrato inteligente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Una vez conectado, podrás ejecutar las siguientes transacciones:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Registrar nuevos empleados</li>
              <li>Actualizar datos generales de empleados</li>
              <li>Modificar habilidades de empleados</li>
              <li>Actualizar salarios</li>
              <li>Cambiar wallets de pago</li>
              <li>Activar/desactivar empleados</li>
            </ul>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Estas operaciones requieren permisos de administrador y consumen gas en la red.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación de formulario
    if (!isValidAddress(registerForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    if (!registerForm.fullName || !registerForm.email || !registerForm.monthlySalaryUSD) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    try {
      const otrasSkillsArray = registerForm.otrasSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      await registerEmployee({
        wallet: registerForm.wallet as `0x${string}`,
        fullName: registerForm.fullName,
        email: registerForm.email,
        country: registerForm.country,
        position: registerForm.position,
        skillPrincipal: registerForm.skillPrincipal,
        skillSecundaria: registerForm.skillSecundaria,
        skillTerciaria: registerForm.skillTerciaria,
        otrasSkills: otrasSkillsArray,
        monthlySalaryUSD: BigInt(registerForm.monthlySalaryUSD),
        preferredToken: registerForm.preferredToken,
        paymentWallet: registerForm.paymentWallet as `0x${string}`,
      })

      toast({
        title: "¡Empleado registrado exitosamente!",
        description: `${registerForm.fullName} ha sido agregado al registro.`,
      })

      // Limpiar formulario
      setRegisterForm({
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
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Error al registrar empleado",
        description: error?.reason || error?.message || "Error desconocido. Verifica tus permisos de administrador.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAddress(generalForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateEmployeeGeneralData({
        wallet: generalForm.wallet as `0x${string}`,
        fullName: generalForm.fullName,
        email: generalForm.email,
        country: generalForm.country,
        position: generalForm.position,
        preferredToken: generalForm.preferredToken,
      })

      toast({
        title: "¡Datos actualizados!",
        description: "Los datos generales del empleado han sido actualizados exitosamente.",
      })
    } catch (error: any) {
      console.error("Update error:", error)
      toast({
        title: "Error al actualizar",
        description: error?.reason || error?.message || "Error al actualizar los datos del empleado.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSkills = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAddress(skillsForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    try {
      const otrasSkillsArray = skillsForm.otrasSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      await updateEmployeeSkills(
        skillsForm.wallet as `0x${string}`,
        skillsForm.skillPrincipal,
        skillsForm.skillSecundaria,
        skillsForm.skillTerciaria,
        otrasSkillsArray,
      )

      toast({
        title: "¡Habilidades actualizadas!",
        description: "Las habilidades del empleado han sido actualizadas exitosamente.",
      })
    } catch (error: any) {
      console.error("Skills update error:", error)
      toast({
        title: "Error al actualizar habilidades",
        description: error?.reason || error?.message || "Error al actualizar las habilidades del empleado.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSalary = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAddress(salaryForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    if (!salaryForm.newSalary || isNaN(Number(salaryForm.newSalary))) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa un salario válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateEmployeeSalary(salaryForm.wallet as `0x${string}`, BigInt(salaryForm.newSalary))

      toast({
        title: "¡Salario actualizado!",
        description: "El salario del empleado ha sido actualizado exitosamente.",
      })
    } catch (error: any) {
      console.error("Salary update error:", error)
      toast({
        title: "Error al actualizar salario",
        description: error?.reason || error?.message || "Error al actualizar el salario del empleado.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAddress(walletForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet actual no es válida.",
        variant: "destructive",
      })
      return
    }

    if (!isValidAddress(walletForm.newWallet)) {
      toast({
        title: "Error de validación",
        description: "La nueva dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateEmployeeWallet(walletForm.wallet as `0x${string}`, walletForm.newWallet as `0x${string}`)

      toast({
        title: "¡Wallet actualizado!",
        description: "La wallet de pago del empleado ha sido actualizada exitosamente.",
      })
    } catch (error: any) {
      console.error("Wallet update error:", error)
      toast({
        title: "Error al actualizar wallet",
        description: error?.reason || error?.message || "Error al actualizar la wallet del empleado.",
        variant: "destructive",
      })
    }
  }

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAddress(statusForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    try {
      await deactivateEmployee(statusForm.wallet as `0x${string}`)

      toast({
        title: "¡Empleado desactivado!",
        description: "El empleado ha sido desactivado exitosamente.",
      })
    } catch (error: any) {
      console.error("Deactivation error:", error)
      toast({
        title: "Error al desactivar",
        description: error?.reason || error?.message || "Error al desactivar el empleado.",
        variant: "destructive",
      })
    }
  }

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAddress(statusForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    try {
      await activateEmployee(statusForm.wallet as `0x${string}`)

      toast({
        title: "¡Empleado activado!",
        description: "El empleado ha sido activado exitosamente.",
      })
    } catch (error: any) {
      console.error("Activation error:", error)
      toast({
        title: "Error al activar",
        description: error?.reason || error?.message || "Error al activar el empleado.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">✏️ Write Functions</h2>

      {/* Register Employee */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            registerEmployee()
          </CardTitle>
          <CardDescription>Register a new employee with complete information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reg-wallet">Employee Wallet</Label>
                <Input
                  id="reg-wallet"
                  placeholder="0x..."
                  value={registerForm.wallet}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, wallet: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-payment">Payment Wallet</Label>
                <Input
                  id="reg-payment"
                  placeholder="0x..."
                  value={registerForm.paymentWallet}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, paymentWallet: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  placeholder="John Doe"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="john@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-country">Country</Label>
                <Input
                  id="reg-country"
                  placeholder="United States"
                  value={registerForm.country}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, country: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-position">Position</Label>
                <Input
                  id="reg-position"
                  placeholder="Software Engineer"
                  value={registerForm.position}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, position: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-skill1">Primary Skill</Label>
                <Input
                  id="reg-skill1"
                  placeholder="React"
                  value={registerForm.skillPrincipal}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, skillPrincipal: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-skill2">Secondary Skill</Label>
                <Input
                  id="reg-skill2"
                  placeholder="Node.js"
                  value={registerForm.skillSecundaria}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, skillSecundaria: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-skill3">Tertiary Skill</Label>
                <Input
                  id="reg-skill3"
                  placeholder="TypeScript"
                  value={registerForm.skillTerciaria}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, skillTerciaria: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-salary">Monthly Salary (USD)</Label>
                <Input
                  id="reg-salary"
                  type="number"
                  placeholder="5000"
                  value={registerForm.monthlySalaryUSD}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, monthlySalaryUSD: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reg-other-skills">Other Skills (comma separated)</Label>
              <Textarea
                id="reg-other-skills"
                placeholder="Python, Docker, AWS"
                value={registerForm.otrasSkills}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, otrasSkills: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Register Employee
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update General Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            updateEmployeeGeneralData()
          </CardTitle>
          <CardDescription>Update employee general information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateGeneral} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gen-wallet">Employee Wallet</Label>
                <Input
                  id="gen-wallet"
                  placeholder="0x..."
                  value={generalForm.wallet}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, wallet: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gen-name">Full Name</Label>
                <Input
                  id="gen-name"
                  placeholder="John Doe"
                  value={generalForm.fullName}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gen-email">Email</Label>
                <Input
                  id="gen-email"
                  type="email"
                  placeholder="john@example.com"
                  value={generalForm.email}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gen-country">Country</Label>
                <Input
                  id="gen-country"
                  placeholder="United States"
                  value={generalForm.country}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, country: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gen-position">Position</Label>
                <Input
                  id="gen-position"
                  placeholder="Software Engineer"
                  value={generalForm.position}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, position: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gen-token">Preferred Token</Label>
                <Input
                  id="gen-token"
                  placeholder="USDC"
                  value={generalForm.preferredToken}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, preferredToken: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
              Update General Data
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            updateEmployeeSkills()
          </CardTitle>
          <CardDescription>Update employee skills and competencies</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSkills} className="space-y-4">
            <div>
              <Label htmlFor="skills-wallet">Employee Wallet</Label>
              <Input
                id="skills-wallet"
                placeholder="0x..."
                value={skillsForm.wallet}
                onChange={(e) => setSkillsForm((prev) => ({ ...prev, wallet: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="skills-primary">Primary Skill</Label>
                <Input
                  id="skills-primary"
                  placeholder="React"
                  value={skillsForm.skillPrincipal}
                  onChange={(e) => setSkillsForm((prev) => ({ ...prev, skillPrincipal: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="skills-secondary">Secondary Skill</Label>
                <Input
                  id="skills-secondary"
                  placeholder="Node.js"
                  value={skillsForm.skillSecundaria}
                  onChange={(e) => setSkillsForm((prev) => ({ ...prev, skillSecundaria: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="skills-tertiary">Tertiary Skill</Label>
                <Input
                  id="skills-tertiary"
                  placeholder="TypeScript"
                  value={skillsForm.skillTerciaria}
                  onChange={(e) => setSkillsForm((prev) => ({ ...prev, skillTerciaria: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="skills-other">Other Skills (comma separated)</Label>
              <Textarea
                id="skills-other"
                placeholder="Python, Docker, AWS"
                value={skillsForm.otrasSkills}
                onChange={(e) => setSkillsForm((prev) => ({ ...prev, otrasSkills: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Award className="mr-2 h-4 w-4" />}
              Update Skills
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Salary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            updateEmployeeSalary()
          </CardTitle>
          <CardDescription>Update employee monthly salary</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSalary} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary-wallet">Employee Wallet</Label>
                <Input
                  id="salary-wallet"
                  placeholder="0x..."
                  value={salaryForm.wallet}
                  onChange={(e) => setSalaryForm((prev) => ({ ...prev, wallet: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="salary-amount">New Salary (USD)</Label>
                <Input
                  id="salary-amount"
                  type="number"
                  placeholder="6000"
                  value={salaryForm.newSalary}
                  onChange={(e) => setSalaryForm((prev) => ({ ...prev, newSalary: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
              Update Salary
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            updateEmployeeWallet()
          </CardTitle>
          <CardDescription>Update employee payment wallet address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateWallet} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wallet-employee">Employee Wallet</Label>
                <Input
                  id="wallet-employee"
                  placeholder="0x..."
                  value={walletForm.wallet}
                  onChange={(e) => setWalletForm((prev) => ({ ...prev, wallet: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="wallet-new">New Payment Wallet</Label>
                <Input
                  id="wallet-new"
                  placeholder="0x..."
                  value={walletForm.newWallet}
                  onChange={(e) => setWalletForm((prev) => ({ ...prev, newWallet: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
              Update Wallet
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Employee Status Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deactivate Employee */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              deactivateEmployee()
            </CardTitle>
            <CardDescription>Deactivate an employee</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeactivate} className="space-y-4">
              <div>
                <Label htmlFor="deactivate-wallet">Employee Wallet</Label>
                <Input
                  id="deactivate-wallet"
                  placeholder="0x..."
                  value={statusForm.wallet}
                  onChange={(e) => setStatusForm((prev) => ({ ...prev, wallet: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} variant="destructive" className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                Deactivate Employee
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activate Employee */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              activateEmployee()
            </CardTitle>
            <CardDescription>Activate an employee</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleActivate} className="space-y-4">
              <div>
                <Label htmlFor="activate-wallet">Employee Wallet</Label>
                <Input
                  id="activate-wallet"
                  placeholder="0x..."
                  value={statusForm.wallet}
                  onChange={(e) => setStatusForm((prev) => ({ ...prev, wallet: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                Activate Employee
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status */}
      {transactionHash && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">Transaction Hash:</p>
              <code className="text-xs bg-muted p-2 rounded block break-all">{transactionHash}</code>
              {isSuccess && <p className="text-green-600 text-sm">✅ Transaction confirmed!</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
