"use client"

import { useAccount } from "wagmi"
import { useUserRegistry, ROLES } from "@/web3/hooks/useUserRegistry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  Crown, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  UserPlus
} from "lucide-react"

export function QuickRoleSetup() {
  const { isConnected, address } = useAccount()
  const { toast } = useToast()
  const {
    grantRole,
    hasRole,
    isLoading,
  } = useUserRegistry()

  // Check if current wallet has ADMIN_ROLE
  const { data: hasAdminRole, refetch: refetchAdminRole } = hasRole(
    ROLES.ADMIN_ROLE,
    address as `0x${string}`
  )

  const handleGrantAdminRole = async () => {
    if (!address) return

    try {
      await grantRole(ROLES.ADMIN_ROLE, address as `0x${string}`)
      
      toast({
        title: "¡Rol de Admin otorgado!",
        description: "Ahora tienes permisos de administrador para usar todas las funciones.",
      })
      
      // Refetch to update the UI
      setTimeout(() => refetchAdminRole(), 2000)
    } catch (error: any) {
      console.error("Grant admin role error:", error)
      toast({
        title: "Error al otorgar rol",
        description: error?.reason || error?.message || "Puede que no tengas permisos para otorgar roles. Necesitas ser el owner del contrato.",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <Card className="border-yellow-500/20 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600">
          <Crown className="h-5 w-5" />
          Configuración Rápida de Roles
        </CardTitle>
        <CardDescription>
          Otórgate el rol de administrador para usar todas las funciones de la dApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Tu wallet:</strong> {address}
          </AlertDescription>
        </Alert>

        {hasAdminRole === undefined ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Verificando permisos...</span>
          </div>
        ) : hasAdminRole ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Perfecto!</strong> Ya tienes el rol de administrador. Puedes usar todas las funciones.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sin permisos:</strong> Necesitas el rol de administrador para usar las funciones del contrato.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleGrantAdminRole} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Otorgando rol...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Otorgarme Rol de Admin
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Nota: Esta función solo funciona si tu wallet es el owner del contrato (quien lo desplegó).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
