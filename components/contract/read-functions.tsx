"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useUserRegistry } from "@/web3/hooks/useUserRegistry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Users, User, Shield, DollarSign, AlertCircle, CheckCircle, XCircle, Loader2, Wifi, WifiOff } from "lucide-react"

export function ReadFunctions() {
  const { isConnected, address } = useAccount()
  const { 
    getAllEmployeesWithSensitiveData, 
    getEmployeeMetadata, 
    getSensitiveEmployeeData, 
    isActive 
  } = useUserRegistry()

  const [selectedWallet, setSelectedWallet] = useState("")

  // Get all employees
  const { data: allEmployees, isLoading: loadingAll, refetch: refetchAll, error: errorAll } = getAllEmployeesWithSensitiveData

  // Get specific employee data (only when wallet is provided)
  const {
    data: employeeMetadata,
    isLoading: loadingMetadata,
    refetch: refetchMetadata,
    error: errorMetadata
  } = getEmployeeMetadata(selectedWallet as `0x${string}`)
  const {
    data: sensitiveData,
    isLoading: loadingSensitive,
    refetch: refetchSensitive,
    error: errorSensitive
  } = getSensitiveEmployeeData(selectedWallet as `0x${string}`)
  const {
    data: isActiveData,
    isLoading: loadingActive,
    refetch: refetchActive,
    error: errorActive
  } = isActive(selectedWallet as `0x${string}`)

  // Helper function to render connection status
  const renderConnectionStatus = () => {
    if (!isConnected) {
      return (
        <Alert className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <strong>No conectado:</strong> Conecta tu wallet para acceder a las funciones de lectura del contrato.
          </AlertDescription>
        </Alert>
      )
    }
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          <strong>Conectado:</strong> {address} - Puedes leer datos del contrato.
        </AlertDescription>
      </Alert>
    )
  }

  // Helper function to render errors
  const renderError = (error: any, functionName: string) => {
    if (!error) return null
    return (
      <Alert variant="destructive" className="mt-2">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error en {functionName}:</strong> {error.message || 'Error desconocido'}
        </AlertDescription>
      </Alert>
    )
  }

  // Helper function to render loading state
  const renderLoadingState = (isLoading: boolean, text: string = "Cargando...") => {
    if (!isLoading) return null
    return (
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{text}</span>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">📖 Funciones de Lectura</h2>
        {renderConnectionStatus()}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff className="h-5 w-5" />
              Wallet No Conectado
            </CardTitle>
            <CardDescription>
              Necesitas conectar tu wallet para acceder a las funciones de lectura del contrato inteligente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Una vez conectado, podrás:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Ver todos los empleados registrados</li>
              <li>Consultar el estado de actividad de un empleado</li>
              <li>Obtener metadatos de empleados</li>
              <li>Acceder a datos sensibles (con permisos adecuados)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📖 Funciones de Lectura</h2>
      
      {renderConnectionStatus()}

      {/* Get All Employees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            getAllEmployeesWithSensitiveData()
          </CardTitle>
          <CardDescription>Obtener todos los empleados con información completa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => refetchAll()} disabled={loadingAll}>
            {loadingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              "Obtener Todos los Empleados"
            )}
          </Button>

          {renderLoadingState(loadingAll, "Obteniendo lista de empleados...")}
          {renderError(errorAll, "getAllEmployeesWithSensitiveData")}

          {!loadingAll && allEmployees && allEmployees.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Éxito:</strong> Se encontraron {allEmployees.length} empleados registrados.
              </AlertDescription>
            </Alert>
          )}

          {!loadingAll && allEmployees && allEmployees.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sin datos:</strong> No hay empleados registrados en el contrato.
              </AlertDescription>
            </Alert>
          )}

          {allEmployees && allEmployees.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Resultados: {allEmployees.length} empleados</p>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {allEmployees.map((employee, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{employee.fullName}</p>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                      <Badge variant={employee.active ? "default" : "secondary"}>
                        {employee.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono mt-1">{employee.wallet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Individual Employee Queries */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="wallet-input">Dirección de Wallet del Empleado</Label>
          <Input
            id="wallet-input"
            placeholder="0x..."
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
          />
          {selectedWallet && !/^0x[a-fA-F0-9]{40}$/.test(selectedWallet) && (
            <p className="text-sm text-red-500 mt-1">
              Formato de dirección inválido. Debe ser una dirección Ethereum válida.
            </p>
          )}
        </div>

        {/* Is Active */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              isActive(address wallet)
            </CardTitle>
            <CardDescription>Verificar si un empleado está activo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => refetchActive()} 
              disabled={!selectedWallet || loadingActive || !/^0x[a-fA-F0-9]{40}$/.test(selectedWallet)}
            >
              {loadingActive ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Estado"
              )}
            </Button>

            {!selectedWallet && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Requerido:</strong> Ingresa una dirección de wallet para verificar el estado.
                </AlertDescription>
              </Alert>
            )}

            {renderLoadingState(loadingActive, "Verificando estado del empleado...")}
            {renderError(errorActive, "isActive")}

            {!loadingActive && isActiveData !== undefined && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Resultado exitoso:</strong> Estado del empleado obtenido correctamente.
                </AlertDescription>
              </Alert>
            )}

            {isActiveData !== undefined && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant={isActiveData ? "default" : "secondary"}>
                    {isActiveData ? "Activo" : "Inactivo"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    El empleado está {isActiveData ? "actualmente activo" : "inactivo"} en el sistema
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Get Employee Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              getEmployeeMetadata(address wallet)
            </CardTitle>
            <CardDescription>Obtener metadatos del empleado (país, posición, habilidades)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => refetchMetadata()} 
              disabled={!selectedWallet || loadingMetadata || !/^0x[a-fA-F0-9]{40}$/.test(selectedWallet)}
            >
              {loadingMetadata ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Obtener Metadatos"
              )}
            </Button>

            {!selectedWallet && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Requerido:</strong> Ingresa una dirección de wallet para obtener los metadatos.
                </AlertDescription>
              </Alert>
            )}

            {renderLoadingState(loadingMetadata, "Obteniendo metadatos del empleado...")}
            {renderError(errorMetadata, "getEmployeeMetadata")}

            {!loadingMetadata && employeeMetadata && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Éxito:</strong> Metadatos del empleado obtenidos correctamente.
                </AlertDescription>
              </Alert>
            )}

            {employeeMetadata && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">País:</p>
                    <p className="text-sm text-muted-foreground">{employeeMetadata[0] || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Posición:</p>
                    <p className="text-sm text-muted-foreground">{employeeMetadata[1] || "No especificado"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Habilidades Principales:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {employeeMetadata[2] && <Badge variant="outline">{employeeMetadata[2]}</Badge>}
                    {employeeMetadata[3] && <Badge variant="outline">{employeeMetadata[3]}</Badge>}
                    {employeeMetadata[4] && <Badge variant="outline">{employeeMetadata[4]}</Badge>}
                  </div>
                  {employeeMetadata[5] && employeeMetadata[5].length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Habilidades Adicionales:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {employeeMetadata[5].map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Estado:</p>
                  <Badge variant={employeeMetadata[6] ? "default" : "secondary"}>
                    {employeeMetadata[6] ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Get Sensitive Employee Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              getSensitiveEmployeeData(address wallet)
            </CardTitle>
            <CardDescription>Obtener datos sensibles del empleado (nombre, email, salario)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => refetchSensitive()} 
              disabled={!selectedWallet || loadingSensitive || !/^0x[a-fA-F0-9]{40}$/.test(selectedWallet)}
            >
              {loadingSensitive ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Obtener Datos Sensibles"
              )}
            </Button>

            {!selectedWallet && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Requerido:</strong> Ingresa una dirección de wallet para acceder a los datos sensibles.
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota de Seguridad:</strong> Esta función solo está disponible para administradores o el propio empleado.
              </AlertDescription>
            </Alert>

            {renderLoadingState(loadingSensitive, "Obteniendo datos sensibles del empleado...")}
            {renderError(errorSensitive, "getSensitiveEmployeeData")}

            {!loadingSensitive && sensitiveData && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Éxito:</strong> Datos sensibles del empleado obtenidos correctamente.
                </AlertDescription>
              </Alert>
            )}

            {sensitiveData && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nombre Completo:</p>
                    <p className="text-sm text-muted-foreground">{sensitiveData[0] || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email:</p>
                    <p className="text-sm text-muted-foreground">{sensitiveData[1] || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Salario Mensual:</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {sensitiveData[2] ? `${sensitiveData[2].toString()} USD` : "No disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Wallet de Pago:</p>
                    <code className="text-xs bg-muted p-1 rounded">
                      {sensitiveData[3] || "No especificado"}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
