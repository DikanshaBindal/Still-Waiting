# 🛒 Still-Waiting — Decentralized Zero-Queue Checkout (Stellar dApp)

> **Still-Waiting** is a decentralized retail checkout experience built on the **Stellar Testnet**. It eliminates billing queues by letting customers scan items, pay instantly via blockchain, and receive a tamper-proof on-chain receipt — all from their own device.

[![CI Pipeline](https://github.com/DikanshaBindal/Still-Waiting/actions/workflows/ci.yml/badge.svg)](https://github.com/DikanshaBindal/Still-Waiting/actions)
[![Live on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://still-waiting-one.vercel.app/)
[![Stellar Testnet](https://img.shields.io/badge/Blockchain-Stellar%20Testnet-blue?logo=stellar)](https://testnet.stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
---

## 🌐 Quick Links

| Resource | Link |
|---|---|
| 🔗 Live Demo | [still-waiting-one.vercel.app](https://still-waiting-one.vercel.app/) |
| 🎥 1-Minute Walkthrough | [Watch on GitHub](https://github.com/user-attachments/assets/27f15073-d504-4c52-8d54-00969e84ffc4) |
| ⚙️ CI/CD Pipelines | [GitHub Actions](https://github.com/DikanshaBindal/Still-Waiting/actions) |
| 🪙 Developer Wallet | `GB66XSKCNNHE6GUYA7BENANHHUKCHZVEFIBVVFJHAP4OHJ62HVANQEEZ` |

---

## 🚨 Problem Statement

Customers in retail stores (Zara, Zudio, DMart, etc.) lose significant time standing in billing queues — especially during peak hours. Even modern **self-checkout systems** fail to solve the root problem:

| Issue | Impact |
|---|---|
| Limited self-checkout counters | Queue shifts, not eliminated |
| Slow payment terminals | Bottleneck at every transaction |
| Manual barcode verification | Requires staff intervention |
| Centralized payment infrastructure | Single point of failure |

**Still-Waiting** removes the queue entirely by moving checkout to the **customer's device**, with payments settled on the **Stellar blockchain**.

---

## ⚡ Solution Overview

The checkout flow is entirely decentralized and device-native:

```
Customer enters store
        ↓
Opens Still-Waiting dApp
        ↓
Connects Freighter Wallet
        ↓
Scans / selects products
        ↓
Cart calculates total in XLM
        ↓
Authorizes payment via Freighter
        ↓
Stellar blockchain settles transaction
        ↓
Soroban smart contract stores receipt
        ↓
SWRT token minted to customer wallet
        ↓
QR code generated for store exit
```

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (Vite + JS)                   │
│                                                           │
│   ┌─────────────┐    ┌──────────────┐   ┌─────────────┐  │
│   │ Store Select │──▶│ Product Scan │──▶│ Cart Summary│  │
│   └─────────────┘    └──────────────┘   └──────┬──────┘  │
│                                                 │         │
│                                         ┌───────▼──────┐  │
│                                         │ Payment Page │  │
│                                         └───────┬──────┘  │
└─────────────────────────────────────────────────┼────────┘
                                                  │
                        ┌─────────────────────────▼──────────┐
                        │        Freighter Wallet API         │
                        │  (@stellar/freighter-api)           │
                        └─────────────────────────┬──────────┘
                                                  │ Signs Transaction
                        ┌─────────────────────────▼──────────┐
                        │         Stellar SDK (JS)            │
                        │  Builds & submits transaction       │
                        └─────────────────────────┬──────────┘
                                                  │ Submits to Network
              ┌───────────────────────────────────▼────────────────────┐
              │                 Stellar Testnet (Horizon API)           │
              │                                                         │
              │   ┌────────────────────────┐  ┌─────────────────────┐  │
              │   │   ReceiptStore Contract │─▶│ ReceiptToken Contract│  │
              │   │   (Soroban / Rust)     │  │ (Mints SWRT Token)  │  │
              │   └────────────────────────┘  └─────────────────────┘  │
              └─────────────────────────────────────────────────────────┘
                                                  │
                        ┌─────────────────────────▼──────────┐
                        │   On-chain Receipt + SWRT Token     │
                        │   QR code generated for exit scan   │
                        └────────────────────────────────────┘
```

---

## 📜 Smart Contracts

The project uses **two Soroban smart contracts** deployed on Stellar Testnet.

### 1. `ReceiptStore` Contract

Handles payment receipt, stores transaction data on-chain.

| Function | Signature | Description |
|---|---|---|
| `initialize` | `initialize(admin: Address)` | Sets contract admin on deployment |
| `store_receipt` | `store_receipt(buyer: Address, items: Vec<String>, total: i128, tx_hash: String)` | Records a purchase receipt on-chain |
| `get_receipt` | `get_receipt(buyer: Address) → Receipt` | Returns the latest receipt for a given wallet address |
| `get_all_receipts` | `get_all_receipts() → Vec<Receipt>` | Returns all receipts (admin only) |
| `verify_receipt` | `verify_receipt(tx_hash: String) → bool` | Verifies if a receipt exists for a given transaction hash |

**Receipt Data Structure:**
```rust
pub struct Receipt {
    pub buyer: Address,
    pub items: Vec<String>,
    pub total: i128,        // in stroops (1 XLM = 10,000,000 stroops)
    pub tx_hash: String,
    pub timestamp: u64,
}
```

---

### 2. `ReceiptToken` Contract (SWRT)

Mints the **StillWaiting Receipt Token (SWRT)** to the buyer's wallet upon successful payment. Implements the Soroban token interface.

| Function | Signature | Description |
|---|---|---|
| `initialize` | `initialize(admin: Address, decimal: u32, name: String, symbol: String)` | Initializes the SWRT token metadata |
| `mint` | `mint(to: Address, amount: i128)` | Mints 1 SWRT token to the buyer after verified payment |
| `balance` | `balance(id: Address) → i128` | Returns SWRT token balance for a wallet |
| `transfer` | `transfer(from: Address, to: Address, amount: i128)` | Transfers SWRT tokens between addresses |
| `burn` | `burn(from: Address, amount: i128)` | Burns SWRT tokens (for redemption/refund use cases) |
| `name` | `name() → String` | Returns token name: `"StillWaiting Receipt Token"` |
| `symbol` | `symbol() → String` | Returns token symbol: `"SWRT"` |
| `decimals` | `decimals() → u32` | Returns `7` (Stellar standard) |

---

## 🔗 Inter-Contract Calls & Transaction Reference

### Call Flow

```
User Wallet (Freighter)
      │
      │  XLM Payment
      ▼
ReceiptStore::store_receipt()
      │
      │  Internal cross-contract call
      ▼
ReceiptToken::mint(buyer_address, 1)
      │
      │  SWRT token credited to wallet
      ▼
User receives QR receipt
```

### Deployed Contract Addresses (Stellar Testnet)

| Contract | Contract ID |
|---|---|
| `ReceiptStore` | *(add your deployed contract ID here)* |
| `ReceiptToken` | *(add your deployed contract ID here)* |

> 💡 To find your contract IDs, run:
> ```bash
> stellar contract deploy --wasm target/wasm32-unknown-unknown/release/receipt_store.wasm --network testnet
> stellar contract deploy --wasm target/wasm32-unknown-unknown/release/receipt_token.wasm --network testnet
> ```

### Sample Transactions (Testnet)

| Description | Transaction Hash |
|---|---|
| Payment + receipt stored on-chain | [`6c6919...a070f`](https://testnet.stellar.expert/explorer/testnet/tx/6c691955fbd07d9c09dae81efd8c4cc510feb90db273746d8cd3b0d8b35a070f) |
| SWRT token mint call | *(add contract mint tx hash)* |
| Contract initialization | *(add contract deploy tx hash)* |

> 🔍 View all developer wallet transactions on [Stellar Expert Testnet](https://testnet.stellar.expert/explorer/testnet/account/GB66XSKCNNHE6GUYA7BENANHHUKCHZVEFIBVVFJHAP4OHJ62HVANQEEZ)

---

## 🧠 Key Features

### 🔐 Multi-Wallet Support
Connect and switch between multiple wallets using the **Freighter** browser extension. The app gracefully handles wallet not installed, rejected connections, and account switching.

### 💸 Real Blockchain Payments
All transactions are submitted to the **Stellar Testnet** using native **XLM**. Each payment is a real Stellar transaction — verifiable on Stellar Expert or Horizon API.

### 📋 Smart Contract Receipts
Post-payment, the `ReceiptStore` contract records: buyer address, item list, total amount in stroops, transaction hash, and timestamp. This creates a **tamper-proof, on-chain proof of purchase**.

### 🪙 SWRT Token Minting
Every successful purchase triggers a cross-contract call that mints **1 SWRT token** to the buyer's wallet — enabling loyalty programs and future NFT receipt upgrades.

### 📡 Transaction Status Feedback

The UI provides real-time feedback at every step:

| State | UI Feedback |
|---|---|
| Awaiting wallet signature | Spinner + "Waiting for Freighter..." |
| Transaction submitted | "Transaction submitted to Stellar..." |
| Confirmed on-chain | Transaction hash displayed + copy button |
| Receipt verified | QR code generated |
| Error: wallet rejected | "Transaction was rejected in wallet" |
| Error: insufficient funds | "Insufficient XLM balance" |
| Error: network failure | "Network error — please retry" |

---

## 🛠 Tech Stack

### Blockchain
| Technology | Purpose |
|---|---|
| Stellar Testnet | Payment settlement layer |
| Soroban (Rust) | Smart contract runtime |
| Stellar SDK (JS) | Transaction building & submission |
| Horizon API | Network queries & transaction lookups |

### Wallet
| Technology | Purpose |
|---|---|
| Freighter | Browser wallet extension |
| @stellar/freighter-api | JS library for wallet connection |

### Frontend
| Technology | Purpose |
|---|---|
| HTML / CSS / JS | Core UI |
| CSS Glassmorphism | Visual design system |
| Vite | Build tool & dev server |

### Deployment & DevOps
| Technology | Purpose |
|---|---|
| Vercel | Production deployment |
| GitHub Actions | CI/CD automation |
| Vitest | Unit testing |

---

## 📸 Application Flow

### 1️⃣ Store Selection
User opens the app and selects a store to begin the shopping session.
<img width="1919" height="1046" alt="image" src="https://github.com/user-attachments/assets/58925776-0587-4014-a01d-c3295b1ac0bf" />
<img width="1918" height="1041" alt="image" src="https://github.com/user-attachments/assets/909efe4d-d9a0-442b-b4ec-a3c7a340e11f" />
<img width="1919" height="1039" alt="image" src="https://github.com/user-attachments/assets/b64af36f-ddea-4ff1-b9cc-dd09047142db" />
<img width="1919" height="1042" alt="image" src="https://github.com/user-attachments/assets/d66feb48-c712-4e7e-a957-cd947f891bc0" />
### 2️⃣ Product Scanning
Items are scanned / selected. Each product is added to the cart with its price in XLM.
<img width="1919" height="1048" alt="image" src="https://github.com/user-attachments/assets/1a659241-f8c0-4764-9660-3467b5ea7809" />
### 3️⃣ Cart Summary
Full cart view with itemized list and total in XLM.
<img width="1919" height="1046" alt="image" src="https://github.com/user-attachments/assets/f5813497-136f-4720-a52e-41b305823bfd" />
### 4️⃣ Payment
User connects Freighter wallet. The app builds a Stellar payment transaction and requests signing.
<img width="1919" height="1045" alt="image" src="https://github.com/user-attachments/assets/dfa1e40d-a4ba-466d-b1f5-62cb2ec6e690" />
### 5️⃣ Transaction Confirmation
Signed transaction is submitted to Stellar Testnet. The confirmed transaction hash is shown.
<img width="1919" height="1052" alt="image" src="https://github.com/user-attachments/assets/2655a1f9-8d3c-4598-a040-191451366e28" />
### 6️⃣ QR Receipt Generation
Post-confirmation, the `ReceiptStore` contract stores the receipt, and a **QR code** is generated encoding the tx hash for exit verification by store staff.
<img width="1915" height="1043" alt="image" src="https://github.com/user-attachments/assets/b80ba0e4-ff1a-4747-84a0-cb9977c1896f" />
<img width="1918" height="1036" alt="image" src="https://github.com/user-attachments/assets/cf85389e-b155-4042-a7b5-b8fa7950ac79" />

---

## 🪙 SWRT Receipt Token

**StillWaiting Receipt Token (SWRT)** is minted to the customer's wallet upon every successful purchase.

| Property | Value |
|---|---|
| Token Name | StillWaiting Receipt Token |
| Symbol | SWRT |
| Decimals | 7 (Stellar standard) |
| Network | Stellar Testnet |
| Mint trigger | Successful payment via ReceiptStore contract |

### Future Roadmap for SWRT
- 🏷 Loyalty points system (accumulate SWRT → redeem for discounts)
- 🖼 NFT receipt upgrades (unique per-purchase artwork)
- 🔄 Cross-store interoperability

---

## ⚙️ CI/CD Pipeline

### Continuous Integration (GitHub Actions)

Every push to any branch triggers:

```yaml
# .github/workflows/ci.yml
- Install Node.js dependencies (npm ci)
- Run unit tests (npm run test — Vitest)
- Build project (npm run build — Vite)
```
### CI Status

![CI Status](https://github.com/DikanshaBindal/Still-Waiting/actions/workflows/main.yml/badge.svg)

### CI Pipeline Screenshot

![CI Pipeline](https://github.com/user-attachments/assets/f0f06f02-0cdb-4a13-b2a4-c0108476167e)

👉 https://github.com/DikanshaBindal/Still-Waiting/actions

### Continuous Deployment (Vercel)
<img width="1893" height="1082" alt="image" src="https://github.com/user-attachments/assets/2d3842d5-e293-4b93-a6a2-26fe2c31c00c" />

---

## 🧪 Testing

Automated tests written with **Vitest** cover the core business logic:

| Test Suite | Coverage |
|---|---|
| Cart Logic | Add/remove items, quantity updates, total calculation |
| Transaction Validation | Payment amount, address format, fee estimation |
| Wallet Formatting | Stellar address validation, public key format |
| Flow Validation | Full checkout state machine transitions |

**Run tests locally:**
```bash
npm run test
```

**Run with coverage:**
```bash
npm run test -- --coverage
```

---

## 💻 Run Locally

### Prerequisites
- Node.js 18+
- [Freighter Wallet](https://www.freighter.app/) browser extension
- A funded Stellar Testnet account ([Get test XLM via Friendbot](https://laboratory.stellar.org/#account-creator))

### Setup

```bash
# Clone the repository
git clone https://github.com/DikanshaBindal/Still-Waiting
cd Still-Waiting

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
Still-Waiting/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── contracts/
│   ├── receipt_store/
│   │   └── src/lib.rs          # ReceiptStore Soroban contract
│   └── receipt_token/
│       └── src/lib.rs          # ReceiptToken (SWRT) Soroban contract
├── src/
│   ├── index.html              # Entry point
│   ├── styles/
│   │   └── main.css            # Glassmorphism UI styles
│   ├── js/
│   │   ├── wallet.js           # Freighter wallet integration
│   │   ├── payment.js          # Stellar transaction builder
│   │   ├── cart.js             # Cart state management
│   │   ├── receipt.js          # QR receipt generation
│   │   └── contract.js         # Soroban contract interaction
│   └── tests/
│       ├── cart.test.js
│       ├── transaction.test.js
│       └── wallet.test.js
├── vite.config.js
├── package.json
└── README.md
```

---


## 👥 User Testing

> 📊 **[View Full User Testing Sheet](https://docs.google.com/spreadsheets/d/1znXnkH3gAw_LQhPIAHh-duoRdAE1_TEUpEGvnIaFNuc/edit?usp=sharing)**

| User Name | User Email | User Wallet Address |
|---|---|---|
| Subhranil Baul | subhranil97@icloud.com | `GBTOPBOVCF5652TCZMN4YDMSBTMYKX7HAA7LBMBBFFDBARZJIY5DHGINT` |
| Tanuja Sharma | tanujasharma0987@gmail.com | `GDTJVOWCKRN6TGFZQRHO6ANQL5PRNYRUWY7GBYM2PBPF7QPG2ULXUIIJ` |
| Abhishek Kumar | abhishekkumar086038@gmail.com | `GCO527YCC6DNDK3K6FN654WXAINDGNB35FUFAN3LURDENIIBD7ZFAJN6` |
| Jayant Vaibhav | jayantvaibhavspj@gmail.com | `GBQI6DPFRFZMTDO4KFUPB5D2F6WCQOZEGEBE7OTBHVXXLD76BJFQN4SR` |
| Shashank Rai | shashankrai283@gmail.com | `GD5CCTX45O4DWDT3OQ6IYDH2SK55AGNNSPGWSQMPO5S2WFAIIVTUSWCU` |

---

## 📝 User Feedback & Implementation

> 📋 **[View Feedback Form](https://forms.gle/2kso9YvZbbDfGaKd8)**

| User Name | User Email | User Wallet Address | Feedback | Commit ID |
|---|---|---|---|---|
| Subhranil Baul | subhranil97@icloud.com | `GBTOPBOVCF5652TCZMN4YDMSBTMYKX7HAA7LBMBBFFDBARZJIY5DHGINT` | Wallet connection took a few seconds with no indication | *(commit hash)* |
| Tanuja Sharma | tanujasharma0987@gmail.com | `GDTJVOWCKRN6TGFZQRHO6ANQL5PRNYRUWY7GBYM2PBPF7QPG2ULXUIIJ` | Multi-wallet support would be a plus | *(commit hash)* |
| Abhishek Kumar | abhishekkumar086038@gmail.com | `GCO527YCC6DNDK3K6FN654WXAINDGNB35FUFAN3LURDENIIBD7ZFAJN6` | Real barcode scanning via camera would feel like an actual store | *(commit hash)* |
| Jayant Vaibhav | jayantvaibhavspj@gmail.com | `GBQI6DPFRFZMTDO4KFUPB5D2F6WCQOZEGEBE7OTBHVXXLD76BJFQN4SR` | A product catalog would be nice | *(commit hash)* |
| Shashank Rai | shashankrai283@gmail.com | `GD5CCTX45O4DWDT3OQ6IYDH2SK55AGNNSPGWSQMPO5S2WFAIIVTUSWCU` | Transaction history section to view past purchases | *(commit hash)* |

---

## 🚀 Next Phase Improvements

Based on feedback collected via feedback form all improvements are **completed and live** at [still-waiting-one.vercel.app](https://still-waiting-one.vercel.app/).

| # | Feedback | What Was Implemented | Commit |
|---|---|---|---|
| 1 | New users don't understand what the dApp does | Added 3-step onboarding screen (Connect → Scan → Pay), tooltips on key actions, and descriptive labels throughout | [view commit](https://github.com/DikanshaBindal/Still-Waiting/commit/REPLACE_COMMIT) |
| 2 | Wallet connection took a few seconds with no feedback | Added instant loading spinner + "Connecting to Freighter..." message on click; timeout fallback after 5s | [view commit](https://github.com/DikanshaBindal/Still-Waiting/commit/REPLACE_COMMIT) |
| 3 | Better UI/UX needed for first-time users | Improved visual hierarchy, cleaner layout, contextual hints on cart and payment steps | [view commit](https://github.com/DikanshaBindal/Still-Waiting/commit/REPLACE_COMMIT) |
| 4 | Product catalog missing | New Catalog tab with glassmorphism card grid — name, XLM price, Add to Cart per item | [view commit](https://github.com/DikanshaBindal/Still-Waiting/commit/REPLACE_COMMIT) |
| 5 | Overall UI needs improvement | Full UI polish pass — typography, color contrast, spacing, glassmorphism depth | [view commit](https://github.com/DikanshaBindal/Still-Waiting/commit/REPLACE_COMMIT) |


---

## 📄 License

This project was developed for educational purposes as part of the **Stellar Bootcamp**.

Built with ❤️ by [Dikansha Bindal](https://github.com/DikanshaBindal)

---

> ⭐ If you found this project useful, please consider starring the repository!
