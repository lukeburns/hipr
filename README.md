# HIP-R

HIP-5 but recursive

## Usage

```js
const { RecursiveServer } = require('hipr') 
const server = new RecursiveServer(options)3

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

Then to install middleware, like [hipr-hyperzone](https://github.com/lukeburns/hipr-hyperzone), run

```
hipr install hipr-hyperzone
```

Then boot up a server running the middleware with

```
hipr hipr-hyperzone
```

By default, `hipr` will create a server that listens on port 53 and expects Bob wallet to be running a root server on port 9891, but you can override these defaults. For example, if you are running [hsd](https://github.com/handshake-org/hsd), you can use the authoritative server running (by default) on port `5349`

```
hipr hipr-hyperzone:hipr-sia 127.0.0.1:53 127.0.0.1:5349
```

Middleware should be `:`-separated as the first argument. Note, order matters! In the above example, hyperzones will take priority over sia.
