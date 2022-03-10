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