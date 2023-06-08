const NTP_EPOCH_START = Date.UTC(1900, 0, 1);
const UNIX_EPOCH_START = Date.UTC(1970, 0, 1);

/**
 * Parses timestamps from data
 * https://datatracker.ietf.org/doc/html/rfc5905#section-6
 *
 * @param data Buffer
 * @returns Date
 */
export function parseTimestamp(data: Buffer): Date {
  const timestamp = data.readUInt32BE();

  // Convert the NTP timestamp to milliseconds since January 1, 1900
  const ntpTimestamp = NTP_EPOCH_START + timestamp * 1000;

  // Get diff between January 1, 1970 and January 1, 1900
  const unixTimestamp = ntpTimestamp - UNIX_EPOCH_START;

  // Return Date object
  return new Date(unixTimestamp);
}
