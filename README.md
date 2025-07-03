![deco31416](https://github.com/deco31416/deco31416/blob/main/public/31416-white.svg)

# 🏗️ Employee Registration DApp Boilerplate


[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Wagmi](https://img.shields.io/badge/Wagmi-latest-blue?logo=ethereum&logoColor=white)](https://wagmi.sh/)
[![Viem](https://img.shields.io/badge/Viem-latest-purple)](https://viem.sh/)
[![pnpm](https://img.shields.io/badge/pnpm-%F0%9F%90%99-orange?logo=pnpm&logoColor=white)](https://pnpm.io)


&#x20;   &#x20;

---

## 📄 Description

This project is a **boilerplate example** and **proof of concept** for managing and registering employees on the Binance Smart Chain (BNB Smart Chain).

It demonstrates how to use smart contracts with role-based data protection, controlling read and write access, with all information immutably and transparently stored on-chain.

> ⚠️ **Note**: This repository is *not* production-ready. It is only a **proof of concept** to validate a modular Web3 architecture pattern.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

---

## 🚀 Main Features

✅ Register employees with full data\
✅ Manage salaries, skills, and payment wallets\
✅ Activate and deactivate employees\
✅ Role-based access management (grant, revoke, verify)\
✅ Optimized queries for metadata and sensitive data\
✅ Scalable architecture to add more smart contracts\
✅ Secure role-based access using AccessControl\
✅ Connection to BSC Testnet/Mainnet\
✅ Compatible with WalletConnect and MetaMask

---

## 🧩 Project Structure

```plaintext
/web3
  /abi
    userRegistry.abi.ts
  /config
    constants.ts
    wagmi.ts
  /hooks
    useUserRegistry.ts
  /providers
    web3-provider.tsx
  /types
    index.ts
  /utils
    helpers.ts
  index.ts
/contracts
  /registry
    UserRegistry.sol
/components
  /admin
  /contract
  /employee
  /ui
  /wallet
    wallet-connection.tsx
    theme-provider.tsx
```

---

## 🛠️ Smart Contract

The `UserRegistry.sol` contract implements:

- Employee registration with wallet validation
- Updating general employee data and skills
- Employee activation and deactivation
- Managing monthly salaries
- Updating payment wallets
- Emitting events for full audit trails
- Role-based access control (Admin, Auditor, Compliance, Payroll, Operator, etc.)

All these records are saved immutably on the BNB Smart Chain.

---

## 🛡️ Roles and Permissions

The contract uses `AccessControl` to protect sensitive employee data:

- Only administrators or authorized profiles can modify information
- Roles such as Auditor or Compliance have read-only access
- Flexible role architecture to allow auditing and transaction signing

---

## 🌐 Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Web3 stack**: Wagmi, Viem, RainbowKit
- **State**: TanStack React Query
- **UI**: Radix UI (shadcn/ui)
- **Styling**: TailwindCSS 3+
- **Blockchain**: Solidity 0.8+ on BSC Testnet/Mainnet

---

## 📦 Local Installation

Requirements:

- Node.js >= 18
- pnpm >= 8

Clone the repository:

```bash
git clone https://github.com/your-user/employee-registration-dapp-boilerplate.git
cd employee-registration-dapp-boilerplate
```

Install dependencies with pnpm:

```bash
pnpm install
```

Set up your environment variables (using the provided example):

```bash
cp .env.example .env
```

Edit your `.env` with your contract addresses and WalletConnect project ID.

---

## ▶️ Local Deployment

Run the development server:

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
pnpm build
pnpm start
```

---

## 📌 Quick Network Configuration

- **Network**: Binance Smart Chain Testnet (Chain ID: 97)

- **Contract**:\
  The contract `UserRegistry.sol` located in `contracts/registry/UserRegistry.sol` must be deployed manually.\
  Example address after deployment:\
  `0xD6CCb894Eb0164a99d72F815BCb3e9f5CaC47675` *(replace with your deployed address)*

- **Deployment / Test Wallet** (should have BNB testnet funds):\
  `0x4d84cEDe688030A40Aa4500a13Dd1D7cba45d04b`

- **Roles assigned to the deployer wallet**\
  When deploying the contract from the above wallet, it will automatically have these roles with their identifiers:

  | Role             | Hash (keccak256)                                                     |
  | ---------------- | -------------------------------------------------------------------- |
  | DEFAULT\_ADMIN   | `0x0000000000000000000000000000000000000000000000000000000000000000` |
  | ADMIN\_ROLE      | `0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775` |
  | AUDITOR\_ROLE    | `0x59a1c48e5837ad7a7f3dcedcbe129bf3249ec4fbf651fd4f5e2600ead39fe2f5` |
  | COMPLIANCE\_ROLE | `0x442a94f1a1fac79af32856af2a64f63648cfa2ef3b98610a5bb7cbec4cee6985` |
  | FINANCE\_ROLE    | `0x940d6b1946ff1d2b5a9f1909219c3c81a370804b5ba0f91ec0828c99a2e6a681` |
  | OPERATOR\_ROLE   | `0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929` |
  | PAYROLL\_ROLE    | `0x7f9673717d875a205cbe95d736eb2269b7dc4fbf2b34e5f3ec698f5deec49d1d` |
  | SIGNER\_ROLE     | `0xe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07`               |

> **Note**:\
> The `DEFAULT_ADMIN_ROLE` is automatically assigned to the deployer, and from there you can distribute other roles using `grantRole`.

---

## ✅ Useful Commands

- `pnpm install` → install dependencies
- `pnpm dev` → start in development mode
- `pnpm build` → build for production
- `pnpm start` → run in production
- `pnpm lint` → run the linter

---

## 🧪 Example Flow

1️⃣ Connect your wallet to BSC Testnet\
2️⃣ Assign yourself the administrator role through the DApp\
3️⃣ Register a new employee\
4️⃣ Fetch all employees with `getAllEmployeesWithSensitiveData`\
5️⃣ Update salaries, skills, or payment wallets\
6️⃣ Deactivate or reactivate an employee as needed

---

## 🏷️ Version

- Version: 1.0.0
- Last updated: July 2025
- Compatible with: Next.js 14+, Wagmi 2+, Viem 2+, TypeScript 5+

---

## 📚 Resources

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Viem](https://viem.sh/)
- [RainbowKit](https://rainbowkit.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📝 License

This boilerplate is distributed under the MIT license as an educational resource.

---

## 🛠️ Credits

This project was developed as a proof of concept to validate an **on-chain** employee registration system using role-based access control and modern modular Web3 architecture best practices.

If you plan to take this to production, you should harden security, add automated testing, and monitor contract deployments carefully.

---

## 🌟 Contribute

Pull requests and suggestions are always welcome. Let’s keep growing Web3 together!

---

📬 **Contact:**
- **Email:** [contacto@deco31416.com](mailto:contacto@deco31416.com)
- **Website:** [https://www.deco31416.com/](https://www.deco31416.com/)

[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white)](https://www.facebook.com/deco31416)
[![Medium](https://img.shields.io/badge/Medium-%2312100E.svg?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@deco31416)
[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://x.com/deco31416)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=Discord&logoColor=white)](https://discord.com/invite/4vwQFmd2)
---
