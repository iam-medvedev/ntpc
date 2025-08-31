import type { NTPVersion } from '../types';
import { packetStruct } from './struct';

/**
 * Creates NTP packet
 *
 * @param version NTP protocol version (v3 | v4)
 * @returns Buffer
 */
export function createPacket(version: NTPVersion): Buffer {
  const packetData = {
    leapIndicator: 0, // No Warning
    version,
    mode: 3, // Client mode
    stratum: 0,
    pollInterval: 0,
    precision: 0,
    rootDelay: 0,
    rootDispersion: 0,
    referenceIdentifier: 0,
    referenceTimestamp: 0n,
    originTimestamp: 0n,
    receiveTimestamp: 0n,
    transmitTimestamp: 0n,
  };

  return Buffer.from(packetStruct.encode(packetData));
}
