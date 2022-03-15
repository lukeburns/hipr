# HIP-R

HIP-5 but recursive

## Usage

```js
const { RecursiveServer } = require('hipr') 
const server = new RecursiveServer(options)

server.use(':data._:protocol.', async ({ data, protocol }, name, type) => {
  const zone = await fetchZone(protocol, data)
  return zone.resolve(name, type)
})

server.bind(53)
```

## CLI Usage

First install the `hipr` CLI

```
npm i -g hipr
```

Then to install middleware, like [hipr-hyperzone](https://github.com/lukeburns/hipr-hyperzone) and [hipr-ipfs](https://github.com/lukeburns/hipr-ipfs), run
```
hipr install hipr-hyperzone hipr-ipfs
```
Then boot up a server running the middleware with

```
hipr hipr-hyperzone:hipr-ipfs
```

By default, `hipr` will create a server that listens on port 53 and expects Bob wallet to be running a root server on port 9891, but you can override these defaults. For example, if you are running [hsd](https://github.com/handshake-org/hsd) or [hnsd](https://github.com/handshake-org/hnsd), you can use the authoritative server running (by default) on port `5349`
```
hipr hipr-hyperzone:hipr-ipfs 127.0.0.1:5333 127.0.0.1:5349
```
and listen on port 5333.

Middleware should be `:`-separated as the first argument. Note that order matters. In the above example, hyperzones will take priority over ipfs zone files.

## Middleware

- [_hyperzone](https://github.com/lukeburns/hipr-hyperzone) for resolving from [Hyperzones](https://github.com/lukeburns/hyperzone)
- [_ipfs](https://github.com/lukeburns/hipr-ipfs) for resolving zone files from IPFS
- [_aliasing](https://github.com/lukeburns/hipr-aliasing) for trustless SLDs
