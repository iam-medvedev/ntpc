import { describe, it, expect } from 'bun:test';
import { getTime } from '../';
import { NTPVersion } from '../types';

const currentDate = new Date();

const versions: NTPVersion[] = [3, 4];
const hosts: [string, number][] = [
  ['pool.ntp.org', 123],
  ['time.apple.com', 123],
  ['time.google.com', 123],
  ['time.windows.com', 123],
  ['time.cloudflare.com', 123],
  ['ntp.ubuntu.com', 123],
  ['time.nist.gov', 123],
];

describe.each(versions)(`NTP v%i`, (version) => {
  it.each(hosts)('%s:%i', async (host, port) => {
    const { currentTime, data } = await getTime(host, port, { version });

    // Validate currentTime
    expect(currentTime).toBeInstanceOf(Date);
    expect(currentTime.getFullYear()).toEqual(currentDate.getFullYear());
    expect(currentTime.getDay()).toEqual(currentDate.getDay());
    expect(currentTime.getMonth()).toEqual(currentDate.getMonth());

    // Validate NTP data fields
    expect(data.leapIndicator).toBeGreaterThanOrEqual(0);
    expect(data.leapIndicator).toBeLessThanOrEqual(3);
    expect(data.version).toBeGreaterThanOrEqual(3); // Accept both v3 and v4 responses
    expect(data.version).toBeLessThanOrEqual(4);
    expect(data.mode).toBe(4); // Server mode
    expect(data.stratum).toBeGreaterThanOrEqual(0); // Allow stratum 0 (unspecified)
    expect(data.stratum).toBeLessThan(256); // 8-bit field
    expect(data.pollInterval).toBeGreaterThanOrEqual(0); // Allow 0 poll interval
    expect(data.pollInterval).toBeLessThanOrEqual(255); // 8-bit field
    expect(data.precision).toBeLessThanOrEqual(127); // 8-bit signed field max
    expect(data.precision).toBeGreaterThanOrEqual(-128); // 8-bit signed field min

    // Validate timestamps
    expect(data.referenceTimestamp).toBeInstanceOf(Date);
    expect(data.originTimestamp).toBeInstanceOf(Date);
    expect(data.receiveTimestamp).toBeInstanceOf(Date);
    expect(data.transmitTimestamp).toBeInstanceOf(Date);

    // Validate timestamp relationships
    expect(data.receiveTimestamp.getTime()).toBeGreaterThan(0); // Should be after epoch
    expect(data.transmitTimestamp.getTime()).toBeGreaterThan(0); // Should be after epoch
    expect(data.transmitTimestamp.getTime()).toBeGreaterThanOrEqual(data.receiveTimestamp.getTime()); // Transmit should be after receive

    // Validate that transmitTimestamp is close to currentTime (should be the same)
    expect(Math.abs(data.transmitTimestamp.getTime() - currentTime.getTime())).toBeLessThan(1000); // Within 1 second

    // Validate numeric fields are within reasonable ranges
    expect(data.rootDelay).toBeGreaterThanOrEqual(0);
    expect(data.rootDelay).toBeLessThan(1000000); // Reasonable delay limit
    expect(data.rootDispersion).toBeGreaterThanOrEqual(0);
    expect(data.rootDispersion).toBeLessThan(1000000); // Reasonable dispersion limit
    expect(data.referenceIdentifier).toBeGreaterThanOrEqual(0);
  });
});
