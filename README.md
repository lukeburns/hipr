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

then setup the middleware directory

```
HIPR=~/.hipr
mkdir $HIPR && mkdir $HIPR/node_modules
```

Now you can install middleware. The `hipr` command will look here for middleware, so just `npm install` middleware in the `$HIPR` directory.

For example, to install the [hyperzone](https://github.com/lukeburns/hyperzone) middleware [`hipr-hyperzone`](https://github.com/lukeburns/hipr-hyperzone), run

```
npm i --prefix $HIPR hipr-hyperzone
```

Finally, to start a `hipr` recursive server on port 53 using a stub resolver on port 9891 (e.g. the default Bob wallet root server), and with the `hipr-hyperzone` and `hipr-sia` (WIP) middleware, you can run

```
sudo hipr hipr-hyperzone:hipr-sia 127.0.0.1:53 127.0.0.1:9891
```

Middleware should be `:`-separated as the first argument. Note, order matters! In the above example, hyperzones will take priority over sia.

Now, if you like, you can set your system resolver to `127.0.0.1` --- and if you're using a handshake root server as a stub resolver, set Search Domain to `.` if you want to resolve Handshake TLDs without a trailing dot.