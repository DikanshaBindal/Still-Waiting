// --- Persistence Helpers ---
export const saveToCache = (key, value) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`sw_${key}`, JSON.stringify(value));
    }
};

export const loadFromCache = (key) => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(`sw_${key}`));
    }
    return null;
};

// --- Formatting Helpers ---
export const shortenAddress = (addr) => addr ? `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}` : '';

// --- Math Helpers ---
export const calculateTotal = (items) => items.reduce((sum, item) => sum + item.price, 0);

// --- Transaction Builder Helper ---
export const buildTransactionData = (destination, amount, asset = 'XLM') => ({
    destination,
    amount: String(amount),
    asset,
});
