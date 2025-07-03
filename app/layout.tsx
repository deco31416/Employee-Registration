import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Registration",
  description: "Employee registry and payroll management on BSC",
    generator: 'Deco31416',
  applicationName: "Employee Registry",
  keywords: [
    "employee registry",
    "payroll management",
    "blockchain",
    "BSC",
    "smart contracts",
    "web3",
    "decentralized application",
    "employee management",
    "crypto payroll",
    "web3 payroll",
    "decentralized finance",
    "dapp",
    "employee onboarding",
    "employee management system",
    "web3 employee registry",
    "blockchain payroll",
    "smart contract payroll",
    "employee data management",
    "decentralized employee registry",]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
