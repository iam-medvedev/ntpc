import { describe, it, expect } from 'bun:test';
import { parsePacket } from '../parse';
import { createPacket } from '../create';
import { packetStruct } from '../struct';

describe('parsePacket', () => {
  it('parses valid NTP packet correctly', () => {
    // Create a mock NTP server response packet
    const mockPacketData = {
      leapIndicator: 0,
      version: 4,
      mode: 4, // Server mode
      stratum: 2,
      pollInterval: 6,
      precision: -25,
      rootDelay: 26214,
      rootDispersion: 1638,
      referenceIdentifier: 134744072,
      referenceTimestamp: 0x0000000000000000n, // Will be 1970-01-01
      originTimestamp: 0x0000000000000000n, // Will be 1970-01-01
      receiveTimestamp: 0xe8c7224c8f000000n, // Sample NTP timestamp
      transmitTimestamp: 0xe8c7224c90000000n, // Sample NTP timestamp
    };

    const buffer = Buffer.from(packetStruct.encode(mockPacketData));
    const result = parsePacket(buffer);

    expect(result.leapIndicator).toBe(0);
    expect(result.version).toBe(4);
    expect(result.mode).toBe(4);
    expect(result.stratum).toBe(2);
    expect(result.pollInterval).toBe(6);
    expect(result.precision).toBe(-25);
    expect(result.rootDelay).toBe(26214);
    expect(result.rootDispersion).toBe(1638);
    expect(result.referenceIdentifier).toBe(134744072);

    // Check timestamps are parsed as Date objects
    expect(result.referenceTimestamp).toBeInstanceOf(Date);
    expect(result.originTimestamp).toBeInstanceOf(Date);
    expect(result.receiveTimestamp).toBeInstanceOf(Date);
    expect(result.transmitTimestamp).toBeInstanceOf(Date);

    // Zero timestamps should be epoch
    expect(result.referenceTimestamp.getTime()).toBe(0);
    expect(result.originTimestamp.getTime()).toBe(0);
  });

  it('throws error for invalid packet length', () => {
    const shortBuffer = Buffer.alloc(47); // Less than 48 bytes
    expect(() => parsePacket(shortBuffer)).toThrow('Invalid NTP message');

    const longBuffer = Buffer.alloc(49); // More than 48 bytes
    expect(() => parsePacket(longBuffer)).toThrow('Invalid NTP message');
  });

  it('handles zero timestamps correctly', () => {
    const mockPacketData = {
      leapIndicator: 0,
      version: 4,
      mode: 4,
      stratum: 1,
      pollInterval: 4,
      precision: -20,
      rootDelay: 0,
      rootDispersion: 0,
      referenceIdentifier: 0x47505300, // "GPS\0"
      referenceTimestamp: 0x0000000000000000n,
      originTimestamp: 0x0000000000000000n,
      receiveTimestamp: 0x0000000000000000n,
      transmitTimestamp: 0x0000000000000000n,
    };

    const buffer = Buffer.from(packetStruct.encode(mockPacketData));
    const result = parsePacket(buffer);

    expect(result.referenceTimestamp.getTime()).toBe(0);
    expect(result.originTimestamp.getTime()).toBe(0);
    expect(result.receiveTimestamp.getTime()).toBe(0);
    expect(result.transmitTimestamp.getTime()).toBe(0);
  });

  it('parses different NTP versions correctly', () => {
    const v3PacketData = {
      leapIndicator: 0,
      version: 3,
      mode: 4,
      stratum: 2,
      pollInterval: 6,
      precision: -20,
      rootDelay: 100,
      rootDispersion: 50,
      referenceIdentifier: 0xc0a80001, // IP address
      referenceTimestamp: 0x0000000000000000n,
      originTimestamp: 0x0000000000000000n,
      receiveTimestamp: 0x0000000000000000n,
      transmitTimestamp: 0x0000000000000000n,
    };

    const buffer = Buffer.from(packetStruct.encode(v3PacketData));
    const result = parsePacket(buffer);

    expect(result.version).toBe(3);
    expect(result.stratum).toBe(2);
    expect(result.referenceIdentifier).toBe(0xc0a80001);
  });

  it('round trip: create and parse packet', () => {
    const originalPacket = createPacket(4);
    const parsed = parsePacket(originalPacket);

    expect(parsed.leapIndicator).toBe(0);
    expect(parsed.version).toBe(4);
    expect(parsed.mode).toBe(3); // Client mode from createPacket
    expect(parsed.stratum).toBe(0);
    expect(parsed.pollInterval).toBe(0);
    expect(parsed.precision).toBe(0);
  });

  it('handles different stratum levels', () => {
    const stratumLevels = [0, 1, 2, 15];

    stratumLevels.forEach((stratum) => {
      const mockPacketData = {
        leapIndicator: 0,
        version: 4,
        mode: 4,
        stratum,
        pollInterval: 4,
        precision: -20,
        rootDelay: 0,
        rootDispersion: 0,
        referenceIdentifier: 0,
        referenceTimestamp: 0x0000000000000000n,
        originTimestamp: 0x0000000000000000n,
        receiveTimestamp: 0x0000000000000000n,
        transmitTimestamp: 0x0000000000000000n,
      };

      const buffer = Buffer.from(packetStruct.encode(mockPacketData));
      const result = parsePacket(buffer);

      expect(result.stratum).toBe(stratum);
    });
  });
});
