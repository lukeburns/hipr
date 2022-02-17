# HIP-R

HIP-5 but recursive

## Usage

```js
const { RecursiveServer } = require('hipr') 
const server = new RecursiveServer(options)

server.use(':hip5data._:protocol', async ({ hip5data, protocol }, name, type) => {
  const zone = await fetchZone(protocol, hip5data)
  return zone.resolve(name, type)
})

server.bind(53)
```
