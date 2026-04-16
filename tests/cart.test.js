import { describe, it, expect } from 'vitest';
import { calculateTotal, shortenAddress } from '../utils.js';

describe('Still-Waiting Logic Tests', () => {
    it('should calculate the correct cart total', () => {
        const mockCart = [
            { price: 10.50 },
            { price: 20.00 },
            { price: 5.25 }
        ];
        expect(calculateTotal(mockCart)).toBe(35.75);
    });

    it('should shorten a stellar address correctly', () => {
        const addr = 'GB66XSKCNNH6GUYA7BENANHHUKCHZVEFIBVVFJHAP4DHJ62HVANQEEZ';
        expect(shortenAddress(addr)).toBe('GB66X...NQEEZ');
    });

    it('should return empty string for null address', () => {
        expect(shortenAddress(null)).toBe('');
    });
});
