#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')

if (process.argv[2] === '--path') {
  return process.stdout.write(getPath())
}

if (process.argv[2] === '--install' || process.argv[2] === '-i' || process.argv[2] === 'install' || process.argv[2] === 'i') {
  if (process.argv[3]) {
    const cmd = `npm i --legacy-peer-deps --prefix ${getPath()} ${process.argv[3]}`.split(' ')
    spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' })
  } else {
    console.error('No package specified')
  }
  return
}

const HOME = require('os').homedir()

let [serverHost, serverPort] = (process.argv[3] || '127.0.0.1:53').split(':')
let [rootHost, rootPort] = (process.argv[4] || '127.0.0.1:9891').split(':')
serverPort = parseInt(serverPort || 53)
rootPort = parseInt(rootPort || 53)

const requires = (process.argv[2] || '').split(':').filter(x => !!x)

const { RecursiveServer, createDS } = require('../index')

const server = new RecursiveServer({ tcp: true, inet6: true, edns: true, dnssec: true })
server.parseOptions({ dnssec: true }) // todo: fix (https://discord.com/channels/822591034202521641/936327800892317766/943527417383886848)
server.resolver.setStub(rootHost, rootPort, createDS())
server.on('error', error => {
  if (process.env.DEBUG) {
    console.error(error)
  }
})

for (const name of requires) {
  const middleware = requireF(name)
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

function getPath () {
  return path.dirname(require.resolve('../'))
}