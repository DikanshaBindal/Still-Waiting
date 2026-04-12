import { isConnected, getPublicKey, signTransaction, setAllowed } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import '@splinetool/viewer';

// Initialize Stellar Testnet Horizon Client
const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

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
// Init funding asynchronously
fundMerchant();

// Mock Product Database
const mockProducts = [
  { id: '101', name: 'Cotton T-Shirt (M)', price: 19.99, sku: 'SKU-001A' },
  { id: '102', name: 'Denim Jeans (32)', price: 49.50, sku: 'SKU-092B' },
  { id: '103', name: 'Sneakers (Size 10)', price: 89.00, sku: 'SKU-441X' },
  { id: '104', name: 'Sunglasses', price: 25.00, sku: 'SKU-110C' },
  { id: '105', name: 'Winter Beanie', price: 15.00, sku: 'SKU-990Y' }
];

// App State
let cart = [];
let cartTotal = 0;
let currentStore = '';

// Wallet State
let walletConnected = false;
let userPublicKey = '';

// DOM Elements
const views = {
  storeSelect: document.getElementById('store-select-view'),
  scanner: document.getElementById('scanner-view'),
  cart: document.getElementById('cart-view'),
  payment: document.getElementById('payment-processing-view'),
  receipt: document.getElementById('receipt-view')
};

function hideAllViews() {
  Object.values(views).forEach(view => {
    view.classList.remove('active');
  });
}

function showView(viewName) {
  hideAllViews();
  views[viewName].classList.add('active');
}

function showError(msg) {
  const toast = document.getElementById('error-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// Wallet Functions
window.connectWallet = async function() {
  try {
    const connected = await isConnected();
    if (!connected) {
      showError("Freighter is not installed or not available.");
      return;
    }

    // Request user permission to connect to Freighter
    await setAllowed();

    const publicKey = await getPublicKey();
    if (!publicKey) {
      showError("Could not connect to wallet.");
      return;
    }

    userPublicKey = publicKey;
    walletConnected = true;

    // Update UI
    document.getElementById('connect-wallet-btn').style.display = 'none';
    document.getElementById('wallet-info').style.display = 'flex';
    
    // Fetch and display balance
    await fetchBalance();
  } catch (error) {
    showError("Wallet Connection Error: " + error.message);
  }
};

window.disconnectWallet = function() {
  userPublicKey = '';
  walletConnected = false;
  
  document.getElementById('connect-wallet-btn').style.display = 'block';
  document.getElementById('wallet-info').style.display = 'none';
  document.getElementById('xlm-balance').textContent = 'XLM: --';
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
    console.error("Account not found on testnet. Ensure it's funded.", err);
    document.getElementById('xlm-balance').textContent = `XLM: Unfunded`;
  }
}

// Actions
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
  scannerFrame.style.border = '2px solid var(--success-color)';
  setTimeout(() => {
    scannerFrame.style.border = ogBorder;
  }, 300);
};

window.viewCart = function() {
  if (cart.length === 0) {
    showError("Your cart is empty. Scan some items first!");
    return;
  }
  
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';
  
  cart.forEach(item => {
    container.innerHTML += `
      <div class="cart-item">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-sku">${item.sku}</div>
        </div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
    `;
  });
  
  document.getElementById('cart-total').textContent = `$${cartTotal.toFixed(2)}`;
  showView('cart');
};

window.continueShopping = function() {
  showView('scanner');
};

window.processPayment = async function() {
  if (!walletConnected) {
    showError("Please connect your Freighter wallet before paying.");
    return;
  }
  
  if (!merchantFunded) {
    // If friendbot takes time, let's just use the user's own wallet as the receiver to ensure transaction validity
    console.warn("Merchant unfunded. Routing back to user's wallet as self-payment for demo test.");
  }

  showView('payment');
  const statusText = document.getElementById('payment-status-text');
  statusText.textContent = "Requesting signature from Freighter...";
  
  try {
    const account = await server.loadAccount(userPublicKey);
    const destination = merchantFunded ? merchantPublicKey : userPublicKey;
    
    // Amount is 0.5 XLM as a test request
    const amountToCharge = "0.5";

    const fee = await server.fetchBaseFee();

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase: NETWORK_PASSPHRASE
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: destination,
      asset: StellarSdk.Asset.native(),
      amount: amountToCharge
    }))
    .setTimeout(30)
    .build();

    // Request Signature
    const signedTxXdr = await signTransaction(transaction.toXDR(), {
      network: 'TESTNET',
      networkPassphrase: NETWORK_PASSPHRASE
    });

    statusText.textContent = "Submitting to Stellar Network...";
    
    // Submit using signed XDR mapping back to transaction object
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
    const result = await server.submitTransaction(signedTx);
    
    // Success
    document.getElementById('tx-hash-display').textContent = result.hash;

    // We can also add wallet info to the receipt
    let receiptAddress = document.getElementById('receipt-wallet-addr');
    if (!receiptAddress) {
      const containerElement = document.querySelector('.qr-container');
      containerElement.innerHTML += `
        <p style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">Wallet Address:</p>
        <div class="tx-hash" style="font-size: 0.70rem;" id="receipt-wallet-addr">${userPublicKey}</div>
        <div style="font-size:0.8rem; color:var(--success-color); margin-top:10px;">Confirmed on Stellar Testnet</div>
      `;
    }

    // Update internal state
    await fetchBalance();
    
    showView('receipt');

  } catch (error) {
    console.error(error);
    showError("Transaction failed: " + (error.message || "Unknown error"));
    // Revert view
    showView('cart');
  }
};

window.resetApp = function() {
  cart = [];
  cartTotal = 0;
  currentStore = '';
  document.getElementById('cart-count').textContent = '0';
  showView('storeSelect');
};
