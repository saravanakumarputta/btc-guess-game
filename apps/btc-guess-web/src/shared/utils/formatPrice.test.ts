import { describe, it, expect } from 'vitest';
import { formatPrice } from './fomatPrice';

describe('formatPrice', () => {
  it('formats a whole number with two decimal places', () => {
    expect(formatPrice(45000)).toBe('45,000.00');
  });

  it('formats a number with decimals', () => {
    expect(formatPrice(45123.56)).toBe('45,123.56');
  });

  it('rounds to two decimal places', () => {
    expect(formatPrice(45123.567)).toBe('45,123.57');
  });

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('0.00');
  });

  it('formats negative numbers', () => {
    expect(formatPrice(-1234.56)).toBe('-1,234.56');
  });

  it('formats large numbers with commas', () => {
    expect(formatPrice(1234567.89)).toBe('1,234,567.89');
  });

  it('formats small decimal numbers', () => {
    expect(formatPrice(0.99)).toBe('0.99');
  });

  it('pads single decimal digit', () => {
    expect(formatPrice(123.5)).toBe('123.50');
  });
});
