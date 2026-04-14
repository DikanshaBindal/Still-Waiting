import { isConnected, getPublicKey, signTransaction, setAllowed } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import '@splinetool/viewer';

// Initialize Stellar Testnet Horizon & RPC Clients
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
// Note: Real Soroban interactions often require passing through stellar-rpc. 
// For demo purposes and horizon ingestion, we construct standard transactions using stellar-sdk.
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

// Placeholder for the manually deployed contract.
// This is a dummy validly-formatted contract ID for UI demo purposes.
const RECEIPT_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJQ";

// Wait for DOM to load before setting contract address
document.addEventListener("DOMContentLoaded", () => {
    const uiContract = document.getElementById('ui-contract-address');
    if (uiContract) {
        uiContract.textContent = RECEIPT_CONTRACT_ID.substring(0, 5) + '...' + RECEIPT_CONTRACT_ID.substring(RECEIPT_CONTRACT_ID.length - 5);
    }
});

// Create a mock merchant wallet automatically and fund it on Testnet via Friendbot
const merchantKeypair = StellarSdk.Keypair.random();
const merchantPublicKey = merchantKeypair.publicKey();
let merchantFunded = false;

async function fundMerchant() {
  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(merchantPublicKey)}`);
    if (res.ok) {
        merchantFunded = true;
        console.log("Merchant wallet successfully funded by Friendbot.");
    }
  } catch (err) {
    console.warn("Friendbot funding failed.", err);
  }
}
fundMerchant();

const mockProducts = [
  { id: '101', name: 'Cotton T-Shirt (M)', price: 19.99, sku: 'SKU-001A' },
  { id: '102', name: 'Denim Jeans (32)', price: 49.50, sku: 'SKU-092B' },
  { id: '103', name: 'Sneakers (Size 10)', price: 89.00, sku: 'SKU-441X' },
  { id: '104', name: 'Sunglasses', price: 25.00, sku: 'SKU-110C' },
  { id: '105', name: 'Winter Beanie', price: 15.00, sku: 'SKU-990Y' }
];

let cart = [];
let cartTotal = 0;
let currentStore = '';

let walletConnected = false;
let userPublicKey = '';

const views = {
  storeSelect: document.getElementById('store-select-view'),
  scanner: document.getElementById('scanner-view'),
  cart: document.getElementById('cart-view'),
  payment: document.getElementById('payment-processing-view'),
  receipt: document.getElementById('receipt-view')
};

function hideAllViews() {
  Object.values(views).forEach(view => view.classList.remove('active'));
}

function showView(viewName) {
  hideAllViews();
  views[viewName].classList.add('active');
}

function showError(msg) {
  const toast = document.getElementById('error-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 4500);
}

window.showWalletModal = function() {
  document.getElementById('wallet-modal-overlay').style.display = 'flex';
};

window.closeWalletModal = function() {
  document.getElementById('wallet-modal-overlay').style.display = 'none';
};

// --- Multi-Wallet Functions ---

window.connectWallet = async function() {
  try {
    const connected = await isConnected();
    if (!connected) {
      showError("ERROR: Wallet connection rejected (Freighter missing)");
      closeWalletModal();
      return;
    }

    await setAllowed();

    const publicKey = await getPublicKey();
    if (!publicKey) {
      showError("ERROR: wallet connection rejected (Access Denied)");
      closeWalletModal();
      return;
    }

    userPublicKey = publicKey;
    walletConnected = true;

    // Update UI Elements
    document.getElementById('wallet-address').textContent = userPublicKey.substring(0, 5) + '...' + userPublicKey.substring(51);
    document.getElementById('connect-wallet-btn').style.display = 'none';
    document.getElementById('wallet-info').style.display = 'flex';
    closeWalletModal();
    
    await fetchBalance();
  } catch (error) {
    showError("ERROR: wallet connection rejected - " + error.message);
    closeWalletModal();
  }
};

window.disconnectWallet = function() {
  userPublicKey = '';
  walletConnected = false;
  
  document.getElementById('connect-wallet-btn').style.display = 'block';
  document.getElementById('wallet-info').style.display = 'none';
  document.getElementById('wallet-address').textContent = '';
  document.getElementById('xlm-balance').textContent = 'XLM: --';
  
  // Directly open modal to allow fast switching to another wallet
  window.showWalletModal();
};

async function fetchBalance() {
  if (!walletConnected) return;
  try {
    const account = await server.loadAccount(userPublicKey);
    const nativeBal = account.balances.find(b => b.asset_type === 'native');
    if (nativeBal) {
      document.getElementById('xlm-balance').textContent = `XLM: ${Number(nativeBal.balance).toFixed(2)}`;
    }
  } catch (err) {
    console.error("Account missing", err);
    document.getElementById('xlm-balance').textContent = `XLM: Unfunded`;
  }
}

// --- App Actions ---

window.startShopping = function(storeName) {
  currentStore = storeName;
  document.getElementById('store-title').textContent = `${storeName} Scanner`;
  showView('scanner');
};

window.mockScanItem = function() {
  const randomIdx = Math.floor(Math.random() * mockProducts.length);
  const item = mockProducts[randomIdx];
  cart.push(item);
  cartTotal += item.price;
  document.getElementById('cart-count').textContent = cart.length;
  
  const scannerFrame = document.querySelector('.scanner-frame');
  const ogBorder = scannerFrame.style.border;
  scannerFrame.style.border = '3px solid var(--success-color)';
  setTimeout(() => scannerFrame.style.border = ogBorder, 300);
};

window.viewCart = function() {
  if (cart.length === 0) {
    showError("Your cart is empty. Scan items first!");
    return;
  }
  
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';
  cart.forEach(item => {
    container.innerHTML += `
      <div class="cart-item">
        <div><div class="item-name">${item.name}</div><div class="item-sku">${item.sku}</div></div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
    `;
  });
  document.getElementById('cart-total').textContent = `$${cartTotal.toFixed(2)}`;
  showView('cart');
};

window.continueShopping = function() { showView('scanner'); };

window.resetApp = function() {
  cart = []; cartTotal = 0; currentStore = '';
  document.getElementById('cart-count').textContent = '0';
  document.getElementById('contract-confirm').textContent = '[ Soroban Receipt Anchored ]';
  showView('storeSelect');
};

// --- Transaction & Soroban Integration ---

window.processPayment = async function() {
  if (!walletConnected) {
    showError("Please connect wallet first.");
    return;
  }

  showView('payment');
  const titleText = document.getElementById('payment-status-title');
  const statusText = document.getElementById('payment-status-text');
  
  try {
    titleText.textContent = "Processing Payment";
    statusText.textContent = "Checking balances & generating signature request...";

    const account = await server.loadAccount(userPublicKey).catch((e) => {
       throw new Error("unfunded");
    });
    
    // Check Insufficient Balance visually
    const nativeBal = account.balances.find(b => b.asset_type === 'native');
    if (!nativeBal || parseFloat(nativeBal.balance) < 0.5) {
       throw new Error("insufficient balance");
    }

    const destination = merchantFunded ? merchantPublicKey : userPublicKey;
    const amountToCharge = "0.5";
    const fee = await server.fetchBaseFee();
    
    // 1. Payment Operation
    const paymentOp = StellarSdk.Operation.payment({
      destination: destination,
      asset: StellarSdk.Asset.native(),
      amount: amountToCharge
    });

    // 2. Soroban Contract Invocation (creating the receipt on ledger)
    // We attempt to construct the invokeHostFunction even if ID is a placeholder. 
    // If the contract is undefined, we catch the build error or network error cleanly.
    let contractOp;
    try {
        const contract = new StellarSdk.Contract(RECEIPT_CONTRACT_ID);
        const receiptId = Math.floor(Date.now() / 1000).toString();
        
        contractOp = contract.call("create_receipt", 
            StellarSdk.nativeToScVal(receiptId, { type: 'string' }),
            StellarSdk.nativeToScVal(userPublicKey, { type: 'address' }),
            StellarSdk.nativeToScVal(500, { type: 'i128' }), // Represent 0.5 XLM as integer stroops internally or arbitrary value
            StellarSdk.nativeToScVal(Math.floor(Date.now() / 1000), { type: 'u64' })
        );
    } catch(e) {
        console.warn("Soroban build error (possibly missing real CONTRACT_ID). Reverting to simple memo for demo fallback.");
    }

    let builder = new StellarSdk.TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: NETWORK_PASSPHRASE
    }).addOperation(paymentOp);
    
    if (contractOp) builder.addOperation(contractOp);

    const transaction = builder.setTimeout(30).build();

    titleText.textContent = "Awaiting Signature";
    statusText.textContent = "Please confirm the transaction via Freighter popup.";

    // Wait for Freighter Interaction
    let signedTxXdr;
    try {
        signedTxXdr = await signTransaction(transaction.toXDR(), { network: 'TESTNET', networkPassphrase: NETWORK_PASSPHRASE });
        if (!signedTxXdr) throw new Error("cancelled");
    } catch (e) {
        throw new Error("transaction rejected");
    }

    titleText.textContent = "Broadcasting";
    statusText.textContent = "Anchoring to Stellar Testnet...";
    
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
    let result;
    try {
        result = await server.submitTransaction(signedTx);
    } catch (e) {
        throw new Error("network failure");
    }
    
    // Success State
    document.getElementById('tx-hash-display').textContent = result.hash;
    document.getElementById('receipt-wallet-addr').textContent = userPublicKey;
    
    // Check if Soroban was cleanly embedded
    if (!contractOp) {
       document.getElementById('contract-confirm').textContent = "[ Payment successful | Soroban Receipt logic simulated ]";
       document.getElementById('contract-confirm').style.color = "#8b949e"; // Muted secondary color
    } else {
       document.getElementById('contract-confirm').textContent = "[ Success: Receipt Anchored to Soroban Contract! ]";
       document.getElementById('contract-confirm').style.color = "var(--success-color)";
    }

    await fetchBalance();
    showView('receipt');

  } catch (error) {
    console.error(error);
    const msg = error.message.toLowerCase();
    
    // Error Handling categorizations
    if (msg.includes("insufficient balance") || msg.includes("unfunded")) {
        showError("ERROR: Insufficient balance to execute transaction!");
    } else if (msg.includes("transaction rejected") || msg.includes("cancelled")) {
        showError("ERROR: Transaction rejected by User.");
    } else if (msg.includes("network failure")) {
        showError("ERROR: Network failure communicating with Horizon.");
    } else {
        showError("ERROR: Transaction failed: " + error.message);
    }
    
    // Revert view
    showView('cart');
  }
};
