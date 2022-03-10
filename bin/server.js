#!/usr/bin/env node

const HOME = require('os').homedir()

let [serverHost, serverPort] = (process.argv[3] || '127.0.0.1:53').split(':')
let [rootHost, rootPort] = (process.argv[4] || '127.0.0.1:9891').split(':')
serverPort = parseInt(serverPort || 53)
rootPort = parseInt(rootPort || 53)

const requires = (process.argv[2] || '').split(':')

const { RecursiveServer, createDS } = require('../index')

const server = new RecursiveServer({ tcp: true, inet6: true, edns: true, dnssec: true })
server.parseOptions({ dnssec: true }) // todo: fix (https://discord.com/channels/822591034202521641/936327800892317766/943527417383886848)
server.resolver.setStub(rootHost, rootPort, createDS())

for (const name of requires) {
  const middleware = requireF(`${HOME}/.hipr/node_modules/${name}`)
  if (typeof middleware === 'function') {
    console.log('loading middleware:', name)
    server.use(middleware())
  } else {
    console.log('middleware not found:', name)
  }
}

server.bind(serverPort, serverHost)
console.log(`listening on ${serverHost}:${serverPort}`)
console.log(`resolving with ${rootHost}:${rootPort}`)

function requireF(modulePath) {
  try {
    return require(modulePath)
  }
  catch (e) {
    return false
  }
}