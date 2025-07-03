"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useUserRegistry, ROLES } from "@/web3/hooks/useUserRegistry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  Shield, 
  UserPlus, 
  UserMinus, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Users,
  Crown,
  Copy
} from "lucide-react"

const ROLE_LABELS = {
  [ROLES.DEFAULT_ADMIN_ROLE]: "Super Admin",
  [ROLES.ADMIN_ROLE]: "Admin",
  [ROLES.AUDITOR_ROLE]: "Auditor",
  [ROLES.COMPLIANCE_ROLE]: "Compliance",
  [ROLES.FINANCE_ROLE]: "Finance",
  [ROLES.OPERATOR_ROLE]: "Operator",
  [ROLES.PAYROLL_ROLE]: "Payroll",
  [ROLES.SIGNER_ROLE]: "Signer",
}

const ROLE_DESCRIPTIONS = {
  [ROLES.DEFAULT_ADMIN_ROLE]: "Control total del sistema",
  [ROLES.ADMIN_ROLE]: "Gestión completa de empleados",
  [ROLES.AUDITOR_ROLE]: "Acceso de solo lectura para auditorías",
  [ROLES.COMPLIANCE_ROLE]: "Verificación de cumplimiento",
  [ROLES.FINANCE_ROLE]: "Gestión financiera y salarios",
  [ROLES.OPERATOR_ROLE]: "Operaciones diarias",
  [ROLES.PAYROLL_ROLE]: "Gestión de nóminas",
  [ROLES.SIGNER_ROLE]: "Firmante autorizado",
}

export function RoleManagement() {
  const { isConnected, address } = useAccount()
  const { toast } = useToast()
  const {
    grantRole,
    revokeRole,
    hasRole,
    isLoading,
    isSuccess,
    error,
    transactionHash,
  } = useUserRegistry()

  // Modal state for copy feedback
  const [copyModal, setCopyModal] = useState({
    isOpen: false,
    roleName: "",
    roleId: "",
  })

  const [checkForm, setCheckForm] = useState({
    role: "",
    wallet: "",
  })

  const [grantForm, setGrantForm] = useState({
    role: "",
    wallet: "",
  })

  const [revokeForm, setRevokeForm] = useState({
    role: "",
    wallet: "",
  })

  // Check if user has role
  const { data: hasRoleData, isLoading: checkingRole, refetch: refetchRole } = hasRole(
    checkForm.role as `0x${string}`,
    checkForm.wallet as `0x${string}`
  )

  // Helper function to validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  // Function to copy role ID to clipboard
  const copyToClipboard = async (roleId: string, roleName: string) => {
    try {
      await navigator.clipboard.writeText(roleId)
      
      // Show custom modal instead of toast
      setCopyModal({
        isOpen: true,
        roleName,
        roleId,
      })
      
      // Auto-hide modal after 2 seconds
      setTimeout(() => {
        setCopyModal({
          isOpen: false,
          roleName: "",
          roleId: "",
        })
      }, 2000)
      
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = roleId
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        
        // Show custom modal for fallback too
        setCopyModal({
          isOpen: true,
          roleName,
          roleId,
        })
        
        // Auto-hide modal after 2 seconds
        setTimeout(() => {
          setCopyModal({
            isOpen: false,
            roleName: "",
            roleId: "",
          })
        }, 2000)
        
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "No se pudo copiar al portapapeles.",
          variant: "destructive",
        })
      }
      document.body.removeChild(textArea)
    }
  }

  // Helper function to render transaction status
  const renderTransactionStatus = () => {
    if (isLoading) {
      return (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <strong>Procesando:</strong> Tu transacción está siendo procesada...
          </AlertDescription>
        </Alert>
      )
    }

    if (isSuccess && transactionHash) {
      return (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>¡Éxito!</strong> Rol actualizado. Hash: 
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
            <strong>Error:</strong> {error.message || 'Error en la transacción'}
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  const handleGrantRole = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidAddress(grantForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    if (!grantForm.role) {
      toast({
        title: "Error de validación",
        description: "Por favor selecciona un rol.",
        variant: "destructive",
      })
      return
    }

    try {
      await grantRole(grantForm.role as `0x${string}`, grantForm.wallet as `0x${string}`)
      
      toast({
        title: "¡Rol otorgado!",
        description: `Rol ${ROLE_LABELS[grantForm.role as keyof typeof ROLE_LABELS]} otorgado exitosamente.`,
      })
    } catch (error: any) {
      console.error("Grant role error:", error)
      toast({
        title: "Error al otorgar rol",
        description: error?.reason || error?.message || "Error al otorgar el rol. Verifica tus permisos.",
        variant: "destructive",
      })
    }
  }

  const handleRevokeRole = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidAddress(revokeForm.wallet)) {
      toast({
        title: "Error de validación",
        description: "La dirección de wallet no es válida.",
        variant: "destructive",
      })
      return
    }

    if (!revokeForm.role) {
      toast({
        title: "Error de validación",
        description: "Por favor selecciona un rol.",
        variant: "destructive",
      })
      return
    }

    try {
      await revokeRole(revokeForm.role as `0x${string}`, revokeForm.wallet as `0x${string}`)
      
      toast({
        title: "¡Rol revocado!",
        description: `Rol ${ROLE_LABELS[revokeForm.role as keyof typeof ROLE_LABELS]} revocado exitosamente.`,
      })
    } catch (error: any) {
      console.error("Revoke role error:", error)
      toast({
        title: "Error al revocar rol",
        description: error?.reason || error?.message || "Error al revocar el rol. Verifica tus permisos.",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">👑 Gestión de Roles</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>No conectado:</strong> Conecta tu wallet para gestionar roles del sistema.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">👑 Gestión de Roles</h2>

      {renderTransactionStatus()}

      {/* Check Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verificar Rol
          </CardTitle>
          <CardDescription>Verifica si una wallet tiene un rol específico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check-role">Rol</Label>
              <Select value={checkForm.role} onValueChange={(value) => setCheckForm(prev => ({...prev, role: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([roleId, label]) => (
                    <SelectItem key={roleId} value={roleId}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="check-wallet">Dirección de Wallet</Label>
              <Input
                id="check-wallet"
                placeholder="0x..."
                value={checkForm.wallet}
                onChange={(e) => setCheckForm(prev => ({...prev, wallet: e.target.value}))}
              />
            </div>
          </div>

          <Button 
            onClick={() => refetchRole()} 
            disabled={!checkForm.role || !isValidAddress(checkForm.wallet) || checkingRole}
          >
            {checkingRole ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Rol"
            )}
          </Button>

          {hasRoleData !== undefined && (
            <Alert>
              {hasRoleData ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <strong>Resultado:</strong> La wallet {hasRoleData ? "SÍ tiene" : "NO tiene"} el rol{" "}
                {ROLE_LABELS[checkForm.role as keyof typeof ROLE_LABELS]}.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Grant Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Otorgar Rol
          </CardTitle>
          <CardDescription>Asigna un rol a una wallet específica</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGrantRole} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grant-role">Rol</Label>
                <Select value={grantForm.role} onValueChange={(value) => setGrantForm(prev => ({...prev, role: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([roleId, label]) => (
                      <SelectItem key={roleId} value={roleId}>
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">
                            {ROLE_DESCRIPTIONS[roleId as keyof typeof ROLE_DESCRIPTIONS]}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grant-wallet">Dirección de Wallet</Label>
                <Input
                  id="grant-wallet"
                  placeholder="0x..."
                  value={grantForm.wallet}
                  onChange={(e) => setGrantForm(prev => ({...prev, wallet: e.target.value}))}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!grantForm.role || !isValidAddress(grantForm.wallet) || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Otorgando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Otorgar Rol
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Revoke Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5" />
            Revocar Rol
          </CardTitle>
          <CardDescription>Remueve un rol de una wallet específica</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRevokeRole} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="revoke-role">Rol</Label>
                <Select value={revokeForm.role} onValueChange={(value) => setRevokeForm(prev => ({...prev, role: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([roleId, label]) => (
                      <SelectItem key={roleId} value={roleId}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="revoke-wallet">Dirección de Wallet</Label>
                <Input
                  id="revoke-wallet"
                  placeholder="0x..."
                  value={revokeForm.wallet}
                  onChange={(e) => setRevokeForm(prev => ({...prev, wallet: e.target.value}))}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="destructive"
              disabled={!revokeForm.role || !isValidAddress(revokeForm.wallet) || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revocando...
                </>
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Revocar Rol
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Role Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Información de Roles
          </CardTitle>
          <CardDescription>Descripción de los roles disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(ROLE_LABELS).map(([roleId, label]) => (
              <div key={roleId} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {ROLE_DESCRIPTIONS[roleId as keyof typeof ROLE_DESCRIPTIONS]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background p-1 rounded">
                      {roleId.slice(0, 10)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(roleId, label)}
                      className="h-8 w-8 p-0"
                      title={`Copiar dirección completa del rol ${label}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground font-mono break-all">
                  {roleId}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Copy Success Modal */}
      {copyModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-background border rounded-lg p-6 mx-4 max-w-md w-full animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">¡Copiado al Portapapeles!</h3>
                <p className="text-sm text-muted-foreground">
                  Rol {copyModal.roleName} copiado exitosamente
                </p>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Dirección copiada:</p>
              <code className="text-xs font-mono break-all block bg-background p-2 rounded border">
                {copyModal.roleId}
              </code>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCopyModal({ isOpen: false, roleName: "", roleId: "" })}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
