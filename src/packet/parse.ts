import type { NTPData } from '../types';
import assert from 'assert';
import { packetStruct } from './struct';
import { parseTimestamp } from '../time';

/**
 * Parses data from NTP message
 */
export function parsePacket(data: Buffer): NTPData {
  assert.equal(data.length, 48, 'Invalid NTP message');

  // Parse the basic 48-byte packet
  const parsed = packetStruct.decode(data.subarray(0, 48));
  return {
    ...parsed,
    originTimestamp: parseTimestamp(parsed.originTimestamp),
    receiveTimestamp: parseTimestamp(parsed.receiveTimestamp),
    transmitTimestamp: parseTimestamp(parsed.transmitTimestamp),
    referenceTimestamp: parseTimestamp(parsed.referenceTimestamp),
  };
}
