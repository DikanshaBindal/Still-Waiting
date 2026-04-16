import { describe, it, expect } from 'vitest';
import { calculateTotal, shortenAddress, buildTransactionData } from '../utils.js';

// Test 1 — Cart Total Calculation
describe('Cart Total Calculation', () => {
    it('should correctly sum item prices to calculate total', () => {
        const items = [
            { name: 'T-Shirt', price: 100 },
            { name: 'Jeans', price: 50 },
            { name: 'Sunglasses', price: 25 },
        ];
        expect(calculateTotal(items)).toBe(175);
    });
});

// Test 2 — Wallet Address Formatter
describe('Wallet Address Formatter', () => {
    it('should shorten address and contain ellipsis', () => {
        const addr = 'GB66XTP7D5HC23ABCDEF123456789XYZ123456789';
        const shortened = shortenAddress(addr);
        expect(shortened).toContain('...');
        expect(shortened.startsWith('GB66X')).toBe(true);
    });
});

// Test 3 — Transaction Data Structure
describe('Transaction Data Structure', () => {
    it('should create transaction object with correct amount and XLM asset type', () => {
        const destination = 'GDEST1234567890ABCDEF';
        const tx = buildTransactionData(destination, 0.5);
        expect(tx).toHaveProperty('amount', '0.5');
        expect(tx).toHaveProperty('asset', 'XLM');
    });
});
