# 🛒 Still-Waiting (Stellar dApp)

A decentralized **zero-queue checkout experience** built on the **Stellar Testnet**.
Still-Waiting removes the need to stand in billing lines by enabling users to scan items, pay instantly via blockchain, and receive an on-chain verifiable receipt.

This project demonstrates real blockchain integration using **Stellar SDK**, **Freighter Wallet**, and **Soroban Smart Contracts**.

---

# 🌐 Live Demo

👉 https://still-waiting-one.vercel.app/

---

# 🎥 Demo Video

1-minute walkthrough showing:

* wallet connection
* product scan simulation
* payment via Stellar
* transaction confirmation
* QR receipt generation

👉 https://github.com/user-attachments/assets/1c5a30ff-c0ba-4e0d-b895-a6574afa97a6

---

# 🚀 Problem Statement

Customers in retail stores (Zara, Zudio, etc.) waste time standing in billing queues.

Even self-checkout systems suffer from:

* limited counters
* slow payments
* manual verification
* centralized bottlenecks

Still-Waiting eliminates queues through **decentralized checkout from user devices**.

---

# ⚡ Solution Overview

1. User enters store digitally
2. Scans products
3. Cart updates instantly
4. Payment via Stellar blockchain
5. Transaction recorded on-chain
6. Smart contract stores receipt
7. QR receipt for exit verification

---

# 🧠 Key Features

### Multi-Wallet Support

Connect and switch between multiple wallets using Freighter.

### Real Blockchain Payments

Transactions executed on **Stellar Testnet (XLM)**.

### Smart Contract Integration

Receipts stored on-chain for tamper-proof verification.

### Transaction Feedback

* awaiting signature
* success confirmation
* transaction hash
* receipt verification

### Error Handling

* wallet rejection
* insufficient balance
* network failure
* transaction rejection

---

# ⚙️ CI/CD Pipeline

Automated pipeline runs on every push using GitHub Actions.

### CI Workflow

* Install dependencies
* Run tests (Vitest)
* Build project

### CI Status

![CI Status](https://github.com/DikanshaBindal/Still-Waiting/actions/workflows/main.yml/badge.svg)

### CI Pipeline Screenshot

![CI Pipeline](https://github.com/user-attachments/assets/f0f06f02-0cdb-4a13-b2a4-c0108476167e)

👉 https://github.com/DikanshaBindal/Still-Waiting/actions

---

# 🚀 Continuous Deployment (CD)

The app is deployed using **Vercel**.

Every push to `main` triggers:

* automatic build
* production deployment
* live updates

### Deployment Proof

![Vercel Deployment](https://github.com/user-attachments/assets/35289565-0f33-44fb-ae31-786df9140df0)

![Deployment History](https://github.com/user-attachments/assets/8ac5b1fa-eb87-4380-b97f-a30e66ac6164)

---

# 🛠 Tech Stack

### Blockchain

* Stellar Testnet
* Soroban (Rust)
* Stellar SDK
* Horizon API

### Wallet

* Freighter
* @stellar/freighter-api

### Frontend

* HTML
* CSS (Glassmorphism UI)
* JavaScript
* Vite

### Deployment

* Vercel
* GitHub

---

# 📸 Application Flow

### 1️⃣ Store Selection

![Store](https://github.com/user-attachments/assets/9a0e088e-2f62-4cdc-814a-0277041a5742)

### 2️⃣ Product Scanning

![Scan](https://github.com/user-attachments/assets/8e6ccc1d-f8d5-4307-bd10-398048b93b2b)

### 3️⃣ Cart Summary

![Cart](https://github.com/user-attachments/assets/3b06403b-7277-4f24-8cd5-bf0ac473cf85)

### 4️⃣ Payment

![Payment](https://github.com/user-attachments/assets/e12c4673-2735-4b19-87cc-a6966fec510d)

### 5️⃣ Receipt

![Receipt](https://github.com/user-attachments/assets/7eafd960-78fa-489c-bb54-5e5387884833)

### 6️⃣ QR Verification

![QR](https://github.com/user-attachments/assets/05fbade3-0c14-4ee6-b3e8-7c2256809e79)

---

# 📱 Mobile Responsive View

![Mobile View](https://github.com/user-attachments/assets/8c760899-09b4-4fcd-85c2-7f323a08acd8)

---

# 🪙 SWRT Receipt Token (Level 4)

Each purchase mints a **StillWaiting Receipt Token (SWRT)**:

* digital proof of purchase
* loyalty tracking
* future NFT upgrade potential

---

# 🔗 Inter-Contract Architecture

1. ReceiptStore contract receives payment
2. Calls ReceiptToken contract
3. Token minted to user wallet

---

# 🧪 Testing

Automated tests using **Vitest**:

* cart logic
* transaction validation
* wallet formatting
* flow validation

### Run tests locally

```bash
npm run test
```

---

# 🧪 How to Run Locally

```bash
git clone https://github.com/DikanshaBindal/Still-Waiting
cd Still-Waiting
npm install
npm run dev
```

---

# 📄 License

This project is developed for educational purposes as part of Stellar Bootcamp.
