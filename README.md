[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/ntpc.svg)](https://www.npmjs.com/package/ntpc)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# `ntpc`

Tiny NTP client. Works with [NTP v3](https://datatracker.ietf.org/doc/html/rfc1305) and [v4](https://datatracker.ietf.org/doc/html/rfc5905)

## Installation

```sh
$ bun add ntpc
$ yarn add ntpc
$ npm install ntpc
```

## Usage

```ts
import { getTime } from 'ntpc';

const { currentTime } = await getTime('time.apple.com', 123);
console.log(currentTime); // Date(2023-06-08T06:46:08.000Z)
```

## Configuration

```ts
import { getTime } from 'ntpc';

const { currentTime } = await getTime('time.apple.com', 123, {
  version: 3,
});
console.log(currentTime); // Date(2023-06-08T06:46:08.000Z)
```

## Response Data

The `getTime` function returns detailed NTP response data:

```ts
import { getTime } from 'ntpc';

const result = await getTime('pool.ntp.org', 123);

console.log(result.currentTime); // Current time from server
console.log(result.data); // Complete NTP packet data
```

### Example Response

```ts
{
  currentTime: Date(2023-06-08T06:46:08.237Z),
  data: {
    leapIndicator: 0,               // No leap second warning
    version: 4,                     // NTP version 4
    mode: 4,                        // Server mode
    stratum: 2,                     // Secondary reference
    pollInterval: 6,                // 64 second poll interval (2^6)
    precision: -25,                 // ~30 nanosecond precision (2^-25)
    rootDelay: 26214,               // Round-trip delay to reference
    rootDispersion: 1638,           // Total dispersion
    referenceIdentifier: 134744072, // Reference source IP
    referenceTimestamp: Date(2023-06-08T06:45:32.123Z),
    originTimestamp: Date(1970-01-01T00:00:00.000Z),
    receiveTimestamp: Date(2023-06-08T06:46:08.234Z),
    transmitTimestamp: Date(2023-06-08T06:46:08.237Z)
  }
}
```

### Field Descriptions

- **leapIndicator**: Warning of impending leap second (0=no warning, 1=+1s, 2=-1s, 3=unsync)
- **version**: NTP protocol version (3 or 4)
- **mode**: Association mode (3=client, 4=server, 5=broadcast)
- **stratum**: Distance from reference clock (1=primary, 2-15=secondary)
- **pollInterval**: Maximum message interval in log₂ seconds
- **precision**: System clock precision in log₂ seconds
- **rootDelay**: Round-trip delay to primary reference source
- **rootDispersion**: Total dispersion to primary reference
- **referenceIdentifier**: Reference clock identifier or server IP
- **referenceTimestamp**: When system clock was last set/corrected
- **originTimestamp**: Client request departure time (used for delay calculation)
- **receiveTimestamp**: Server request arrival time
- **transmitTimestamp**: Server response departure time

## License

`ntpc` is [WTFPL licensed](./LICENSE).
