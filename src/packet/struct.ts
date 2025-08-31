import { struct, bits, U8, I8, U32BE, U64BE } from 'micro-packed';

/**
 * NTP packet structure (48 bytes total)
 * Defines the binary layout of NTP protocol messages according to RFC 5905
 *
 * @see https://datatracker.ietf.org/doc/html/rfc5905#section-7.3
 */
export const packetStruct = struct({
  /**
   * Leap Indicator (2 bits)
   * Warning of impending leap second insertion/deletion
   * - 0: No warning
   * - 1: Last minute has 61 seconds
   * - 2: Last minute has 59 seconds
   * - 3: Alarm condition (clock not synchronized)
   */
  leapIndicator: bits(2),

  /**
   * Version Number (3 bits)
   * NTP version number (3 or 4)
   */
  version: bits(3),

  /**
   * Mode (3 bits)
   * NTP association mode:
   * - 0: Reserved
   * - 1: Symmetric active
   * - 2: Symmetric passive
   * - 3: Client
   * - 4: Server
   * - 5: Broadcast
   * - 6: NTP control message
   * - 7: Reserved for private use
   */
  mode: bits(3),

  /**
   * Stratum (8 bits)
   * Stratum level of the local clock:
   * - 0: Unspecified or invalid
   * - 1: Primary reference (GPS, atomic clock, etc.)
   * - 2-15: Secondary reference (via NTP)
   * - 16-255: Reserved
   */
  stratum: U8,

  /**
   * Poll Interval (8 bits)
   * Maximum interval between successive messages in log2 seconds
   * Typical values: 4-17 (16 seconds to 36 hours)
   */
  pollInterval: U8,

  /**
   * Precision (8 bits)
   * Precision of the system clock in log2 seconds
   * Negative values indicate sub-second precision
   */
  precision: I8,

  /**
   * Root Delay (32 bits)
   * Total round-trip delay to primary reference source in NTP short format
   * Upper 16 bits: seconds, Lower 16 bits: fractional seconds
   */
  rootDelay: U32BE,

  /**
   * Root Dispersion (32 bits)
   * Total dispersion to primary reference source in NTP short format
   * Maximum error due to all causes
   */
  rootDispersion: U32BE,

  /**
   * Reference Identifier (32 bits)
   * Identifies the reference source:
   * - Stratum 0: 4-character ASCII string
   * - Stratum 1: 4-character reference clock identifier
   * - Stratum 2+: IPv4 address of reference server
   */
  referenceIdentifier: U32BE,

  /**
   * Reference Timestamp (64 bits)
   * Time when system clock was last set or corrected
   * NTP timestamp format: seconds since Jan 1, 1900 UTC + fractional seconds
   */
  referenceTimestamp: U64BE,

  /**
   * Origin Timestamp (64 bits)
   * Time at client when request departed for server
   * Used for round-trip delay calculation
   */
  originTimestamp: U64BE,

  /**
   * Receive Timestamp (64 bits)
   * Time at server when request arrived from client
   * Used for round-trip delay and clock offset calculation
   */
  receiveTimestamp: U64BE,

  /**
   * Transmit Timestamp (64 bits)
   * Time at server when response departed for client
   * This becomes the client's origin timestamp in subsequent requests
   */
  transmitTimestamp: U64BE,
});
