export type NTPVersion = 3 | 4;

export interface NTPData {
  /**
   * 2-bit integer warning of an impending leap second to be inserted or deleted
   * in the last minute of the current month with values defined in Figure 9.
   */
  leapIndicator: number;
  /**
   * 3-bit integer representing the NTP version number
   */
  version: number;
  /**
   * 3-bit integer representing the mode, with values defined in Figure 10.
   */
  mode: number;
  /**
   * 8-bit integer representing the stratum, with values defined in Figure 11.
   */
  stratum: number;
  /**
   * 8-bit signed integer representing the maximum interval between
   * successive messages, in log2 seconds.
   */
  pollInterval: number;
  /**
   * 8-bit signed integer representing the precision of the system clock, in log2 seconds.
   */
  precision: number;
  /**
   * Total round-trip delay to the reference clock, in NTP short format.
   */
  rootDelay: Buffer;
  /**
   * Total dispersion to the reference clock, in NTP short format.
   */
  rootDispersion: Buffer;
  /**
   * 32-bit code identifying the particular server or reference clock.
   */
  referenceIdentifier: Buffer;
  /**
   * Time when the system clock was last set or corrected, in NTP timestamp format.
   */
  referenceTimestamp: Date;
  /**
   * Time at the client when the request departed for the server, in NTP timestamp format.
   */
  originTimestamp: Date;
  /**
   * Time at the server when the request arrived from the client, in NTP timestamp format.
   */
  receiveTimestamp: Date;
  /**
   * Time at the server when the response left for the client, in NTP timestamp format.
   */
  transmitTimestamp: Date;
  /**
   * The extension fields are used to add optional capabilities
   */
  extensionField1: Buffer;
  extensionField2: Buffer;
  /**
   * 32-bit unsigned integer used by the client and server to designate a secret 128-bit MD5 key.
   */
  keyIdentifier: Buffer;
  /**
   * 128-bit MD5 hash computed over the key followed by the NTP packet header and extensions fields
   * (but not the Key Identifier or Message Digest fields).
   */
  digest: Buffer;
}
