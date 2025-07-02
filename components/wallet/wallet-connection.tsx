"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, LogOut, Copy, Check, AlertTriangle, Network } from "lucide-react"

export function WalletConnection() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isWrongNetwork = isConnected && chain && ![bsc.id, bscTestnet.id].includes(chain.id)

  const switchToBSCTestnet = () => {
    switchChain({ chainId: bscTestnet.id })
  }

  const switchToBSCMainnet = () => {
    switchChain({ chainId: bsc.id })
  }

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>Connected to Binance Smart Chain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isWrongNetwork && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Wrong network detected. Please switch to BSC Testnet or BSC Mainnet.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network:</span>
              <Badge
                variant={isWrongNetwork ? "destructive" : "default"}
                className={chain?.id === bscTestnet.id ? "bg-orange-600" : "bg-yellow-600"}
              >
                {chain?.name || "Unknown"}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium">Address:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted p-2 rounded flex-1 break-all">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </code>
                <Button variant="outline" size="sm" onClick={copyAddress} className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Network Switching */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Switch Network:</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={switchToBSCTestnet}
                disabled={chain?.id === bscTestnet.id}
                className="flex-1 bg-transparent"
              >
                <Network className="h-4 w-4 mr-1" />
                BSC Testnet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={switchToBSCMainnet}
                disabled={chain?.id === bsc.id}
                className="flex-1 bg-transparent"
              >
                <Network className="h-4 w-4 mr-1" />
                BSC Mainnet
              </Button>
            </div>
          </div>

          <Button onClick={() => disconnect()} variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>Connect to Binance Smart Chain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert>
          <Network className="h-4 w-4" />
          <AlertDescription>This app works on BSC Testnet and BSC Mainnet only.</AlertDescription>
        </Alert>

        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            variant="outline"
            className="w-full justify-start"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {connector.name === "Injected" ? "Browser Wallet" : connector.name}
            {isPending && " (connecting...)"}
          </Button>
        ))}

        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>Supported wallets: MetaMask, Trust Wallet, Binance Wallet</p>
        </div>
      </CardContent>
    </Card>
  )
}
