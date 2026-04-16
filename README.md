# 🛒 Still-Waiting (Stellar dApp)

A decentralized **zero-queue checkout experience** built on the **Stellar Testnet**.
Still-Waiting removes the need to stand in billing lines by enabling users to scan items, pay instantly via blockchain, and receive an on-chain verifiable receipt.

This project demonstrates real blockchain integration using **Stellar SDK**, **Freighter Wallet**, and a **Soroban Smart Contract** for receipt verification.

---

# 🌐 Live Demo

👉 [https://still-waiting-one.vercel.app/](https://still-waiting-one.vercel.app/)
## 🎥 Demo Video

1-minute walkthrough showing:

• wallet connect  
• product scan simulation  
• payment transaction via Stellar  
• transaction confirmation  
• QR receipt generation  

👉 Video:
https://github.com/user-attachments/assets/1c5a30ff-c0ba-4e0d-b895-a6574afa97a6

---

# 🚀 Problem Statement

In supermarkets and retail stores (Zara, Zudio, etc.), customers waste significant time waiting in billing queues.

Even self-checkout systems still create bottlenecks due to:

• Limited scanning counters
• Payment delays
• Manual verification
• Centralized billing systems

Still-Waiting eliminates queues completely by enabling **decentralized checkout directly from the user’s device**.

---

# ⚡ Solution Overview

Still-Waiting provides a **blockchain-powered checkout flow**:

1. User enters store digitally
2. Scans products using mobile/web interface
3. Items are added to cart instantly
4. User pays via Stellar blockchain
5. Transaction recorded on-chain
6. Soroban smart contract stores receipt hash
7. QR receipt shown for exit verification

No billing counter required.

---

# 🧠 Key Features

### Multi-Wallet Support

Users can connect and switch between multiple Stellar wallets using Freighter.

### Real Blockchain Payments

Payments executed on **Stellar Testnet** using XLM transactions.

### Soroban Smart Contract Integration

On-chain receipt storage for tamper-proof purchase verification.

### Transaction Status Visibility

Users receive clear feedback:
• awaiting signature
• transaction success
• transaction hash generated
• receipt verification status

### Error Handling System

Handles common blockchain interaction errors:

• wallet connection rejected
• insufficient balance
• transaction rejected
• network failure

### Zero Queue Experience (Concept Prototype)

Simulated scanner removes need for physical billing counter.

---
## ⚙️ CI/CD Pipeline

Automated build and test pipeline runs on every push using GitHub Actions.
<img width="1900" height="1052" alt="image" src="https://github.com/user-attachments/assets/f0f06f02-0cdb-4a13-b2a4-c0108476167e" />

Pipeline steps:
- install dependencies
- run tests (Vitest)
- build project

Workflow status:

![CI Status](https://github.com/DikanshaBindal/Still-Waiting/actions/workflows/main.yml/badge.svg)

View pipeline details:
https://github.com/DikanshaBindal/Still-Waiting/actions

# 🛠 Tech Stack

### Blockchain Layer

• Stellar Testnet
• Soroban Smart Contracts (Rust)
• Stellar SDK
• Horizon API

### Wallet Integration

• Freighter Wallet
• @stellar/freighter-api

### Frontend

• HTML
• CSS (glassmorphism UI)
• JavaScript (modular structure)
• Vite bundler

### Deployment

• Vercel (production hosting)
• GitHub (version control)

---

# 📸 Application Flow

### 1️⃣ Store Selection

User selects a store connected to Stellar node.
<img width="1919" height="1040" alt="image" src="https://github.com/user-attachments/assets/9a0e088e-2f62-4cdc-814a-0277041a5742" />
<img width="1918" height="1048" alt="image" src="https://github.com/user-attachments/assets/cd1f05ff-303b-4929-a8e8-b2ba0523d512" />
<img width="1919" height="1046" alt="image" src="https://github.com/user-attachments/assets/26a0948c-1674-448c-a63f-a6c28a8a83c5" />

### 2️⃣ Product Scanning

Simulated scanning system adds items to cart.
<img width="1918" height="1034" alt="image" src="https://github.com/user-attachments/assets/8e6ccc1d-f8d5-4307-bd10-398048b93b2b" />

### 3️⃣ Cart Summary

Total price calculated dynamically.
<img width="1919" height="1048" alt="image" src="https://github.com/user-attachments/assets/3b06403b-7277-4f24-8cd5-bf0ac473cf85" />

### 4️⃣ Payment via Stellar

Freighter wallet prompts transaction signature.
<img width="1919" height="1044" alt="image" src="https://github.com/user-attachments/assets/e12c4673-2735-4b19-87cc-a6966fec510d" />
<img width="1913" height="1037" alt="image" src="https://github.com/user-attachments/assets/ac84fa4a-322e-43da-8777-45a31400b870" />
<img width="1919" height="1135" alt="image" src="https://github.com/user-attachments/assets/60df86a8-8f8e-427b-acd8-cf4405b0c029" />

### 5️⃣ On-chain Receipt

Transaction hash stored using Soroban contract.
<img width="1919" height="1039" alt="image" src="https://github.com/user-attachments/assets/7eafd960-78fa-489c-bb54-5e5387884833" />

### 6️⃣ Exit Verification QR

Blockchain receipt acts as proof of purchase.
<img width="1919" height="1035" alt="image" src="https://github.com/user-attachments/assets/05fbade3-0c14-4ee6-b3e8-7c2256809e79" />
---
## 📱 Mobile Responsive View (Level 4)

Still-Waiting UI adapts seamlessly across mobile devices.

Mobile UI : <img width="527" height="967" alt="image" src="https://github.com/user-attachments/assets/8c760899-09b4-4fcd-85c2-7f323a08acd8" />

---

# 📜 Smart Contract

Contract stores receipt metadata on-chain:

```rust
create_receipt(
    receipt_id: String,
    wallet: Address,
    amount: i128,
    timestamp: u64
)
```

Ensures:

tamper-proof receipt
verifiable transaction history
decentralized purchase record

---
## 🪙 Receipt Token Contract (Level 4 Upgrade)

Still-Waiting now includes a Soroban token contract that mints a blockchain-based receipt token after successful payment.

Token Name:
StillWaitingReceiptToken

Symbol:
SWRT

Each successful checkout triggers an inter-contract call from the receipt_store contract to the receipt_token contract.

Purpose:
• acts as digital proof of purchase
• enables loyalty programs
• enables future NFT receipt upgrade
• demonstrates Soroban composability

### Contract Architecture

payment confirmed
↓
receipt_store contract
↓
inter-contract call
↓
receipt_token contract
↓
token minted to wallet

# 🏗 Project Structure

```
Still-Waiting
│
├── contracts/
│   └── receipt_store/
│       ├── Cargo.toml
│       └── src/lib.rs
│
├── src (if modularized)
│
├── index.html
├── app.js
├── index.css
├── package.json
├── vite.config.js
└── README.md
```
## 🧪 Tests

This project includes automated unit tests using **Vitest** to verify core functionality of the mini dApp.
<img width="1307" height="607" alt="Screenshot 2026-04-15 103951" src="https://github.com/user-attachments/assets/5191da3e-94c2-430d-bef1-3b99c19c877c" />
### Tests included
- cart calculation logic
- transaction object validation
- wallet formatting checks
- basic application flow validation

### Run tests locally

```bash
npm run test

# 🧪 How to Run Locally

Clone repository:

```
git clone https://github.com/DikanshaBindal/Still-Waiting
cd Still-Waiting
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build production version:

```
npm run build
```

---
---

```
## 🔗 Stellar Testnet Setup

Requirements:

Freighter wallet installed
Freighter network set to TESTNET
Testnet XLM funded via Friendbot

Friendbot:

[https://friendbot.stellar.org/](https://friendbot.stellar.org/)

Minimum balance required: 1 XLM (testnet)

---

## 🔮 Future Scope

real barcode scanning via camera API
store inventory integration
NFT-based purchase receipts
loyalty rewards smart contract
offline sync architecture
merchant dashboard
zk-proof based purchase validation

---

# 📄 License

This project is developed for educational and research purposes as part of Stellar Bootcamp.

