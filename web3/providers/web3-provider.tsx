"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { wagmiConfig, queryClientConfig } from "../config/wagmi"
import { validateEnvironment } from "../config/constants"

// Create QueryClient with centralized configuration
const queryClient = new QueryClient(queryClientConfig)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Validate environment variables on mount
    validateEnvironment()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-foreground">Loading Payroll Manager...</div>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
