# Level 2 Upgrade execution

- [x] Smart Contract Implementation (Rust)
  - [x] Create `contracts/receipt_store/Cargo.toml`.
  - [x] Create `contracts/receipt_store/src/lib.rs` (Soroban logic storing `wallet`, `amount`, `timestamp`, `timestamp`).
- [x] Frontend Contract Interaction
  - [x] Implement `StellarSdk.Operation.invokeHostFunction` targeting a constant placeholder `CONTRACT_ID`.
  - [x] Build XDR arguments (ScVal) to pass securely.
  - [x] Add the execution to `processPayment()`.
  - [x] Display confirmation of successful on-chain receipt storing to the blockchain receipt screen.
- [x] Multi-Wallet & UI Extensibility
  - [x] Implement specific "Switch Wallet" flow (forcing reconnect status).
  - [x] Display balances dynamically for any switched wallet.
- [x] Granular Error Handling
  - [x] Handle **wallet connection rejected** errors smoothly.
  - [x] Handle **insufficient balance** pre-flight and Horizon tx failure.
  - [x] Handle **transaction rejected** (User declines Freighter).
  - [x] Handle **network failure**.
- [x] Validation Pipeline
  - [x] Verify `vite.config.js` or standard Vite root exports perfectly with `npm run build` targeting Vercel deployment.
