[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/about/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/ntpc.svg)](https://www.npmjs.com/package/ntpc)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# `ntpc`

Tiny NTP client. Works with [NTP v3](https://datatracker.ietf.org/doc/html/rfc5905) and [v4](https://datatracker.ietf.org/doc/html/rfc1305)

## Installation

```sh
yarn add ntpc
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

## License

`ntpc` is [WTFPL licensed](./LICENSE).
