import { describe, it, expect } from 'vitest';

// Mocking the SWRT Token Logic
class MockSWRT {
    constructor() {
        this.balances = {};
        this.name = "StillWaitingReceiptToken";
        this.symbol = "SWRT";
    }

    mint(address) {
        this.balances[address] = (this.balances[address] || 0) + 1;
    }

    getBalance(address) {
        return this.balances[address] || 0;
    }
}

describe('SWRT Token Contract Logic (Simulated)', () => {
    it('should initialize with correct name and symbol', () => {
        const token = new MockSWRT();
        expect(token.name).toBe('StillWaitingReceiptToken');
        expect(token.symbol).toBe('SWRT');
    });

    it('should mint tokens correctly', () => {
        const token = new MockSWRT();
        const user = 'GB66...';
        token.mint(user);
        expect(token.getBalance(user)).toBe(1);
    });

    it('should accumulate tokens for multiple purchases', () => {
        const token = new MockSWRT();
        const user = 'GB77...';
        token.mint(user);
        token.mint(user);
        expect(token.getBalance(user)).toBe(2);
    });
});
