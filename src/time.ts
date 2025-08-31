/**
 * Parses timestamps from data
 * https://datatracker.ietf.org/doc/html/rfc5905#section-6
 *
 * @param ntpTimestamp bigint
 * @returns Date
 */
export function parseTimestamp(ntpTimestamp: bigint): Date {
  if (ntpTimestamp === 0n) {
    return new Date(0);
  }

  // NTP epoch starts at January 1, 1900
  // JavaScript epoch starts at January 1, 1970
  // Difference is 70 years = 2,208,988,800 seconds
  const NTP_EPOCH_OFFSET = 2208988800n;

  // Extract seconds (upper 32 bits) and fraction (lower 32 bits)
  const seconds = ntpTimestamp >> 32n;
  const fraction = ntpTimestamp & 0xffffffffn;

  // Convert to Unix timestamp (seconds since 1970)
  const unixSeconds = seconds - NTP_EPOCH_OFFSET;

  // Convert fraction to milliseconds (fraction / 2^32 * 1000)
  const milliseconds = (fraction * 1000n) >> 32n;

  return new Date(Number(unixSeconds) * 1000 + Number(milliseconds));
}
