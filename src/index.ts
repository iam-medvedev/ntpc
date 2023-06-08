import type { NTPData, NTPVersion } from './types';
import assert from 'assert';
import { createSocket } from 'dgram';
import { createRequestPacket, readMessage } from './packet';

interface GetTimeResult {
  currentTime: Date;
  data: NTPData;
}

interface GetTimeOptions {
  version?: NTPVersion;
}

/**
 * Retrieves the time from an NTP server using the provided host and port
 *
 * @docs NTP v4 https://datatracker.ietf.org/doc/html/rfc5905
 * @docs NTP v3 https://datatracker.ietf.org/doc/html/rfc1305
 *
 * @param host NTP server host
 * @param port NTP server port
 * @returns timestamp retrieved from the NTP server
 */
export function getTime(host: string, port: number, options: GetTimeOptions = {}): Promise<GetTimeResult> {
  const version: NTPVersion = options.version || 4;
  assert.ok(version === 3 || version === 4, `Unsupported NTP version: ${version}`);
  assert.ok(typeof host === 'string', 'Please provide correct NTP host');
  assert.ok(typeof port === 'number', 'Please provide correct NTP port');

  return new Promise((resolve, reject) => {
    const client = createSocket('udp4');

    client.on('message', (data) => {
      const packet = readMessage(data);

      client.close();
      resolve({
        currentTime: packet.transmitTimestamp,
        data: packet,
      });
    });

    client.on('error', (error) => {
      client.close();
      reject(error);
    });

    const requestPacket = createRequestPacket(version);
    client.send(requestPacket, 0, requestPacket.length, port, host);
  });
}
