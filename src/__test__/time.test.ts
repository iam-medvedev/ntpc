import { describe, it, expect } from 'bun:test';
import { parseTimestamp } from '../time';

describe('parseTimestamp', () => {
  it('handles zero timestamp correctly', () => {
    const result = parseTimestamp(0n);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(0); // Unix epoch
  });

  it('converts NTP epoch to Unix epoch correctly', () => {
    const ntpUnixEpoch = 2208988800n << 32n; // Shift to upper 32 bits (seconds)
    const result = parseTimestamp(ntpUnixEpoch);

    expect(result.getTime()).toBe(0); // Should be Unix epoch
  });

  it('handles fractional seconds correctly', () => {
    // NTP timestamp: 1 second after Unix epoch with 0.5 second fraction
    const ntpEpochOffset = 2208988800n;
    const seconds = (ntpEpochOffset + 1n) << 32n; // 1 second after Unix epoch
    const fraction = 0x80000000n; // 0.5 in NTP fraction format (2^31 / 2^32)
    const ntpTimestamp = seconds | fraction;

    const result = parseTimestamp(ntpTimestamp);

    // Should be 1500ms (1.5 seconds after Unix epoch)
    expect(result.getTime()).toBe(1500);
  });

  it('handles precise fractional seconds', () => {
    // Test with quarter second (0.25)
    const ntpEpochOffset = 2208988800n;
    const seconds = ntpEpochOffset << 32n; // Unix epoch
    const fraction = 0x40000000n; // 0.25 in NTP fraction format (2^30 / 2^32)
    const ntpTimestamp = seconds | fraction;

    const result = parseTimestamp(ntpTimestamp);

    // Should be 250ms (0.25 seconds after Unix epoch)
    expect(result.getTime()).toBe(250);
  });

  it('handles future timestamps correctly', () => {
    // NTP timestamp for 2023-06-08 06:46:08 UTC
    // This is approximately 1686208568 seconds since Unix epoch
    const ntpEpochOffset = 2208988800n;
    const unixSeconds = 1686208568n;
    const ntpSeconds = (ntpEpochOffset + unixSeconds) << 32n;
    const fraction = 0x3c000000n; // ~0.234375 seconds
    const ntpTimestamp = ntpSeconds | fraction;

    const result = parseTimestamp(ntpTimestamp);

    // Should be close to the expected timestamp
    expect(result.getTime()).toBe(1686208568234); // 234ms fraction
  });

  it('handles maximum fraction correctly', () => {
    // Test with maximum fraction value
    const ntpEpochOffset = 2208988800n;
    const seconds = ntpEpochOffset << 32n; // Unix epoch
    const fraction = 0xffffffffn; // Maximum fraction (~0.999999999)
    const ntpTimestamp = seconds | fraction;

    const result = parseTimestamp(ntpTimestamp);

    // Should be very close to 999ms but not quite 1000ms
    expect(result.getTime()).toBeGreaterThan(990);
    expect(result.getTime()).toBeLessThan(1000);
  });

  it('handles past timestamps correctly', () => {
    // NTP timestamp for a date before Unix epoch should work
    // Test with a date in 1950 (20 years before Unix epoch)
    const ntpEpochOffset = 2208988800n;
    const secondsBefore1970 = 20n * 365n * 24n * 60n * 60n; // Rough 20 years
    const ntpSeconds = (ntpEpochOffset - secondsBefore1970) << 32n;
    const ntpTimestamp = ntpSeconds;

    const result = parseTimestamp(ntpTimestamp);

    // Should be a valid date before Unix epoch (negative timestamp)
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeLessThan(0);
  });

  it('preserves millisecond precision', () => {
    const ntpEpochOffset = 2208988800n;
    const seconds = ntpEpochOffset << 32n; // Unix epoch

    // Test various millisecond values
    const testCases = [
      { ms: 0, expected: 0 },
      { ms: 100, expected: 100 },
      { ms: 500, expected: 500 },
      { ms: 999, expected: 999 },
    ];

    testCases.forEach(({ ms, expected }) => {
      // Convert milliseconds to NTP fraction
      const fraction = BigInt(Math.floor((ms * 0x100000000) / 1000));
      const ntpTimestamp = seconds | fraction;

      const result = parseTimestamp(ntpTimestamp);

      // Allow for small rounding differences
      expect(Math.abs(result.getTime() - expected)).toBeLessThanOrEqual(1);
    });
  });

  it('handles year 2036 NTP era rollover correctly', () => {
    // NTP timestamps have a 32-bit seconds field that will overflow in 2036
    // Test with a timestamp that would represent the rollover point
    const maxNtpSeconds = 0xffffffffn;
    const ntpTimestamp = maxNtpSeconds << 32n;

    const result = parseTimestamp(ntpTimestamp);

    // Should be a valid date (around 2036-02-07)
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2036);
  });
});
