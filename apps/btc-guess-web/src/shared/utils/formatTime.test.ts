import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
  it('formats a timestamp in milliseconds', () => {
    const timestamp = new Date('2024-03-01T12:00:00Z').getTime();
    const result = formatTime(timestamp);
    
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('formats different timestamps consistently', () => {
    const timestamp1 = new Date('2024-01-15T10:30:00Z').getTime();
    const timestamp2 = new Date('2024-12-25T23:59:00Z').getTime();
    
    const result1 = formatTime(timestamp1);
    const result2 = formatTime(timestamp2);
    
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result1).not.toBe(result2);
  });

  it('handles current timestamp', () => {
    const now = Date.now();
    const result = formatTime(now);
    
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('handles zero timestamp (epoch)', () => {
    const result = formatTime(0);
    
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
