import type { NTPData, NTPVersion } from './types';
import assert from 'assert';
import { parseTimestamp } from './time';

/**
 * Creates request packet with configuration
 *
 * @param version NTP protocol version (v3 | v4)
 * @returns Buffer
 */
export function createRequestPacket(version: NTPVersion): Buffer {
  // Leap Indicator = No Warning
  const leapIndicator = 0;

  // Mode = Client
  const mode = 3;

  // The NTP protocol uses a 48-byte message format
  const buffer = Buffer.alloc(48);
  buffer[0] = 0;
  buffer[0] += leapIndicator << 6;
  buffer[0] += version << 3;
  buffer[0] += mode << 0;

  return buffer;
}

/**
 * Reads data from NTP message
 *
 * NTP packet structure (48 bytes):
 * - Leap Indicator (2 bits) | Version Number (3 bits) | Mode (3 bits)
 * - Stratum (8 bits) | Poll Interval (8 bits) | Precision (8 bits)
 * - Root Delay (32 bits)
 * - Root Dispersion (32 bits)
 * - Reference Identifier (32 bits)
 * - Reference Timestamp (64 bits)
 * - Origin Timestamp (64 bits)
 * - Receive Timestamp (64 bits)
 * - Transmit Timestamp (64 bits)
 * - Extension Field 1 (variable)
 * - Extension Field 2 (variable)
 * - Key Identifier
 * - Digest (128 bits)
 */
export function readMessage(data: Buffer): NTPData {
  assert.equal(data.length, 48, 'Invalid message from server');

  return {
    leapIndicator: (data[0] >> 6) & 0x03,
    version: (data[0] >> 3) & 0x07,
    mode: data[0] & 0x07,
    stratum: data[1],
    pollInterval: data[2],
    precision: data[3],
    rootDelay: data.subarray(4, 8),
    rootDispersion: data.subarray(8, 12),
    referenceIdentifier: data.subarray(12, 16),
    referenceTimestamp: parseTimestamp(data.subarray(16, 24)),
    originTimestamp: parseTimestamp(data.subarray(24, 32)),
    receiveTimestamp: parseTimestamp(data.subarray(32, 40)),
    transmitTimestamp: parseTimestamp(data.subarray(40, 48)),
    extensionField1: data.subarray(48, 52),
    extensionField2: data.subarray(52, 56),
    keyIdentifier: data.subarray(56, 60),
    digest: data.subarray(60, 76),
  };
}
