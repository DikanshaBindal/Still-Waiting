# Level 2 Upgrade: Soroban Smart Contract & Multi-Wallet Support

The goal is to elevate the **Still-Waiting** dApp to meet Level 2 requirements by integrating a Soroban smart contract for on-chain receipt storage and implementing robust multi-wallet switching, granular error handling, and transaction state UIs.

## User Review Required

> [!WARNING]  
> Your development environment currently lacks the `rustc` (Rust) toolchain and `stellar` CLI required to natively compile and deploy a Soroban smart contract. 
> 
> My plan is to write the complete, deployment-ready Rust smart contract inside a `contracts/` directory in your workspace. You will need to install the tools locally to compile it, or deploy it from a secondary environment. The Javascript code will be built to invoke this contract assuming it is deployed, holding a placeholder for the `CONTRACT_ID`.

## Proposed Changes

### 1. Smart Contract Development
#### [NEW] contracts/receipt_store/Cargo.toml & src/lib.rs
*   Write a `no_std` Soroban smart contract.
*   **Method**: `create_receipt(env, receipt_id: String, wallet: Address, amount: i128, timestamp: u64)`.
*   **Storage**: Save a custom `Receipt` struct into the ledger using `env.storage().instance().set()`.

### 2. Frontend Contract Interaction (`app.js`)
*   After the initial `0.5 XLM` payment transaction successfully settles, immediately trigger a secondary transaction using `StellarSdk.Operation.invokeHostFunction`.
*   Convert standard JS variables into `StellarSdk.xdr.ScVal` types.
*   Prompt Freighter to sign this interaction.
*   **UI Updates**: Append a new notification step showing that the contract is permanently verifying the receipt on-chain.

### 3. Multi-Wallet Flow (`index.html` & `app.js`)
*   Modify the wallet badge header to support active switching. Add a "Switch Wallet" interface that lets users gracefully disconnect their active session and swap to another testnet account.
*   The balance will dynamically re-fetch upon every wallet switch connection event.

### 4. Error Handling and UI States
*   **wallet connection rejected**: Handled when `setAllowed()` returns false/throws.
*   **insufficient balance**: Checked aggressively before building the transaction; verified if Horizon returns `tx_failed`.
*   **transaction rejected**: Handled when Freighter `signTransaction()` promise rejects.
*   **network failure**: Captured during `submitTransaction`, with specific timeout catches.
*   UI will display exactly which bucket the error falls into using clear notification toasts.

### 5. Deployment Readiness
*   Verify `vite.config.js` or `package.json` configurations are robust for `npm run build`. The resulting `dist` folder will be verified as Vercel-ready (no trailing root dependancies, pure static generation).

## Open Questions

1. Since you cannot compile the contract locally today without installing Rust, are you okay with me injecting a placeholder `CONTRACT_ID` into the frontend code that you must replace after deployment?
2. Freighter handles "multi-wallets" by letting the user choose the active account from the browser extension dropdown. Do you just want a "Disconnect -> Connect" flow to resync the newly active account?

## Verification Plan
1. Check that `npm run build` effectively creates a zero-error Vercel-ready export.
2. Ensure the "Connect Wallet" flow reliably fails cleanly if the user cancels.
3. Validate that `app.js` builds valid generic `ScVal` parameters targeting the Soroban entrypoint.
