# HIP-R

A recursive resolver with middleware. Made for [HIP-5](https://github.com/handshake-org/HIPs/blob/master/HIP-0005.md) protocols.

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
hipr hipr-ipfs:hipr-hyperzone :5333 :5349
```
and listen on 127.0.0.1:5333.

Middleware should be `:`-separated as the first argument. Note that order may matter. In the above example, ipfs zone files will take priority over hyperzones.

## Middleware

- [_hyperzone](https://github.com/lukeburns/hipr-hyperzone) for resolving records from [Hyperzones](https://github.com/lukeburns/hyperzone)
- [_ipfs](https://github.com/lukeburns/hipr-ipfs) for resolving zone files from IPFS
- [_aliasing](https://github.com/lukeburns/hipr-aliasing) for trustless SLDs on Handshake
- [_eth](https://github.com/lukeburns/hipr-eth) for resolving from Ethereum via ENS

## API

```js
const { RecursiveServer } = require('hipr') 
const server = new RecursiveServer(options)

server.use(':data._:protocol.', async ({ data, protocol }, name, type) => {
  const zone = await fetchZone(protocol, data)
  return zone.resolve(name, type)
})

server.bind(53)
```
