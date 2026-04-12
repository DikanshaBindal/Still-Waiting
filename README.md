# ⏳ Still-Waiting v1.0 (Level 1 – White Belt)

A modern **decentralized self-checkout dApp** built on the **Stellar Testnet** that addresses the everyday frustration of standing in long billing queues.

**Still-Waiting** transforms the traditional checkout process into a seamless **Scan → Pay → Done** experience by integrating blockchain-based payment verification using the **Freighter wallet**.

This project demonstrates the core fundamentals of Stellar development including **wallet connection, balance retrieval, and real XLM transaction execution**.

---

# 🚀 Level 1 Major Features

### 🔗 Freighter Wallet Integration

Secure connection and disconnection of Stellar wallet using Freighter extension.
<img width="1914" height="968" alt="image" src="https://github.com/user-attachments/assets/ffbbaf1e-d6a2-4db0-b996-c6adab288242" />
<img width="1911" height="969" alt="image" src="https://github.com/user-attachments/assets/55d5524f-90c4-4303-9433-192f7aa5d1cf" />

### 💰 Live XLM Balance Display
Fetch and display real-time XLM balance from Stellar Testnet.

 <img width="450" height="749" alt="image" src="https://github.com/user-attachments/assets/373b9e4f-b10f-48bc-857b-281d1c2dc05e" />

### ⚡ Blockchain Transaction Flow

Execute real XLM transactions on Stellar Testnet using Stellar SDK.

### 🧾 Tamper-Proof Receipt

Generate immutable transaction hash as proof of payment.

### 🛒 Queue-less Checkout Simulation

Simulated retail checkout flow without traditional billing counter wait time.

### 🚨 Transaction Feedback System

Clear UI indicators for:

* transaction success
* transaction failure
* rejected signature
* insufficient balance

---

# 🛠️ Tech Stack

### Blockchain Network

Stellar Testnet

### Wallet Integration

@stellar/freighter-api

### Blockchain SDK

@stellar/stellar-sdk

### Frontend

HTML
CSS
JavaScript

### Build Tool

Vite

---

# 📸 Technical Verification (Level 1)

### Wallet Connectivity

Freighter wallet successfully connects and displays public address.

### Balance Retrieval

XLM balance fetched dynamically from Stellar Horizon Testnet API.

### Transaction Execution

User signs transaction using Freighter wallet popup.

### Receipt Confirmation

Transaction hash displayed as blockchain verification proof.

---

# 🧭 Application Flow

Connect Freighter Wallet
↓
Fetch XLM Balance
↓
Add Items to Cart
↓
Initiate Payment
↓
Sign Transaction via Freighter
↓
Submit to Stellar Testnet
↓
Display Blockchain Transaction Receipt

---

# 🛡️ Development Standards

### Modular Architecture

Wallet connection, balance handling, and transaction logic separated from UI components.

### Modern Build System

Vite used to support ES modules and Stellar SDK compatibility.

### Blockchain-first Payment Design

Transactions executed directly on Stellar Testnet.

### User-Centered UI

Minimal and intuitive flow designed to simulate fast checkout experience.

---

# 📁 Project Structure

```
still-waiting-stellar-dapp/

├── index.html              # Main app interface
├── index.css               # UI styling
├── app.js                  # App logic & Stellar integration
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

---

# ⚠️ Important Notes

This application runs on the **Stellar Testnet** — no real funds are used.

Freighter wallet must be set to **TESTNET mode**.

Fund your wallet using Stellar Friendbot before testing transactions.

Testnet XLM faucet:
[https://laboratory.stellar.org](https://laboratory.stellar.org)

Minimum balance requirement for Stellar accounts is **1 XLM (testnet)**.

---

# 💡 Innovation Insight

Still-Waiting demonstrates how blockchain can serve as a **trust layer for digital checkout systems**.

Instead of relying on centralized billing counters, payment confirmation is stored on the Stellar ledger, enabling:

tamper-proof receipts
transparent transaction validation
reduced checkout friction
scalable queue-less checkout architecture

---

# 📜 License

This project is licensed under the terms specified in the LICENSE file.
