import * as StellarSdk from '@stellar/stellar-sdk';
import '@splinetool/viewer';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

const views = {
  scan: document.getElementById('scan-view'),
  processing: document.getElementById('processing-view'),
  result: document.getElementById('result-view')
};

function hideAllViews() {
  Object.values(views).forEach(v => v.classList.remove('active'));
}

function showView(name) {
  hideAllViews();
  views[name].classList.add('active');
}

function showError(msg) {
  const toast = document.getElementById('error-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

window.verifyTransaction = async function() {
  const hashInput = document.getElementById('tx-hash-input').value.trim();
  
  if (!hashInput) {
    showError("Please enter a Transaction Hash to verify.");
    return;
  }

  showView('processing');

  try {
    const tx = await server.transactions().transaction(hashInput).call();
    
    // Check if recent (within last 30 minutes)
    const txDate = new Date(tx.created_at);
    const now = new Date();
    const diffMs = now - txDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins > 30) {
      renderResult(false, `Transaction is too old. Settled ${diffMins} minutes ago.`);
      return;
    }

    if (tx.successful) {
      // Look up operations to verify amount and receiver if needed
      // For MVP we just check if it's successful and recent
      const ops = await tx.operations();
      let amountPaid = "Unknown";
      
      if (ops.records && ops.records.length > 0) {
        const paymentOp = ops.records.find(o => o.type === 'payment');
        if (paymentOp) {
          amountPaid = paymentOp.amount + " XLM";
        }
      }

      renderResult(true, `Payment verified!`, amountPaid, tx.created_at);
    } else {
      renderResult(false, "Transaction failed on the ledger.");
    }
    
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 404) {
      renderResult(false, "Transaction Hash not found. Fake receipt!");
    } else {
      renderResult(false, "Network error querying the ledger.");
    }
  }
};

function renderResult(isValid, message, amount = null, time = null) {
  showView('result');
  const card = document.getElementById('status-card-inner');
  
  if (isValid) {
    card.innerHTML = `
      <div class="check-icon valid">✓</div>
      <h2 class="valid">Valid Receipt</h2>
      <p style="color: var(--text-primary); font-weight: bold; margin-bottom: 5px;">${message}</p>
      ${amount ? `<p style="font-size: 1.2rem; color: var(--accent-color); margin: 10px 0;">Paid: ${amount}</p>` : ''}
      <p style="font-size: 0.8rem;">Timestamp: ${new Date(time).toLocaleTimeString()}</p>
    `;
  } else {
    card.innerHTML = `
      <div class="check-icon invalid">✕</div>
      <h2 class="invalid">Invalid Receipt</h2>
      <p style="color: var(--text-primary); font-weight: bold;">${message}</p>
      <p style="font-size: 0.8rem; margin-top: 15px;">Do not allow customer to exit.</p>
    `;
  }
}

window.resetScanner = function() {
  document.getElementById('tx-hash-input').value = '';
  showView('scan');
};
