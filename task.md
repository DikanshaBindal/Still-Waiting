# Stellar Integration Tasks

- [x] Initialize project with Vite.
  - [x] Generate `package.json` with npm scripts structure.
  - [x] Install `@stellar/stellar-sdk`, `@stellar/freighter-api`, and `vite`.
- [x] UI Updates in `index.html` and `index.css`.
  - [x] Add Connect / Disconnect wallet buttons.
  - [x] Create UI for dynamic XLM balance.
  - [x] Add toast notification container for errors.
- [x] Application Logic & Blockchain (`app.js`).
  - [x] Convert to an ES module logic flow.
  - [x] Implement `connectWallet` logic using Freighter API.
  - [x] Implement balance fetching from Horizon Testnet.
  - [x] Update `processPayment` to create a real Stellar transaction (0.5 XLM).
  - [x] Hand off to Freighter to sign, then submit network.
  - [x] Render transaction block hash to the receipt UI.
- [x] Ensure proper error handling and modularity.
