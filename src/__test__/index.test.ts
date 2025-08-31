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
];

describe.each(versions)(`NTP v%i`, (version) => {
  it.each(hosts)('%s:%i', async (host, port) => {
    const { currentTime } = await getTime(host, port, { version });
    expect(currentTime).toBeInstanceOf(Date);

    expect(currentTime.getFullYear()).toEqual(currentDate.getFullYear());
    expect(currentTime.getDay()).toEqual(currentDate.getDay());
    expect(currentTime.getMonth()).toEqual(currentDate.getMonth());
  });
});
