import { describe, it, expect } from 'bun:test';
import { createPacket } from '../create';
import { packetStruct } from '../struct';

describe('createPacket', () => {
  it('creates NTP v3 packet with correct structure', () => {
    const packet = createPacket(3);

    expect(packet).toBeInstanceOf(Buffer);
    expect(packet.length).toBe(48);

    const decoded = packetStruct.decode(packet);
    expect(decoded.leapIndicator).toBe(0);
    expect(decoded.version).toBe(3);
    expect(decoded.mode).toBe(3); // Client mode
  });

  it('creates NTP v4 packet with correct structure', () => {
    const packet = createPacket(4);

    expect(packet).toBeInstanceOf(Buffer);
    expect(packet.length).toBe(48);

    const decoded = packetStruct.decode(packet);
    expect(decoded.leapIndicator).toBe(0);
    expect(decoded.version).toBe(4);
    expect(decoded.mode).toBe(3); // Client mode
  });

  it('creates packets with different versions correctly', () => {
    const v3Packet = createPacket(3);
    const v4Packet = createPacket(4);

    const v3Decoded = packetStruct.decode(v3Packet);
    const v4Decoded = packetStruct.decode(v4Packet);

    expect(v3Decoded.version).toBe(3);
    expect(v4Decoded.version).toBe(4);

    // All other fields should be identical
    expect(v3Decoded.leapIndicator).toBe(v4Decoded.leapIndicator);
    expect(v3Decoded.mode).toBe(v4Decoded.mode);
    expect(v3Decoded.stratum).toBe(v4Decoded.stratum);
  });

  it('creates client mode packets', () => {
    const packet = createPacket(4);
    const decoded = packetStruct.decode(packet);

    expect(decoded.mode).toBe(3); // Client mode
    expect(decoded.leapIndicator).toBe(0); // No warning
  });
});
