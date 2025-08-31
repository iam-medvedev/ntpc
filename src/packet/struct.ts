import { struct, bits, U8, I8, U32BE, U64BE } from 'micro-packed';

/** NTP packet structure (48 bytes) */
export const packetStruct = struct({
  /** Leap Indicator (2 bits) */
  leapIndicator: bits(2),
  /** Version Number (3 bits) */
  version: bits(3),
  /** Mode (3 bits) */
  mode: bits(3),
  /** Stratum (8 bits) */
  stratum: U8,
  /** Poll Interval (8 bits)  */
  pollInterval: U8,
  /** Precision (8 bits) */
  precision: I8,
  /** Root Delay (32 bits) */
  rootDelay: U32BE,
  /** Root Dispersion (32 bits) */
  rootDispersion: U32BE,
  /** Reference Identifier (32 bits) */
  referenceIdentifier: U32BE,
  /** Reference Timestamp (64 bits) */
  referenceTimestamp: U64BE,
  /** Origin Timestamp (64 bits) */
  originTimestamp: U64BE,
  /** Receive Timestamp (64 bits) */
  receiveTimestamp: U64BE,
  /** Transmit Timestamp (64 bits) */
  transmitTimestamp: U64BE,
});
