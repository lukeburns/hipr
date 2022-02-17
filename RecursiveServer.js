/*!
 * recursive.js - recursive dns server for bns
 * Copyright (c) 2018, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/bns
 */

'use strict';

const DNSServer = require('bns/lib/server/dns');
const RecursiveResolver = require('./RecursiveResolver');

/**
 * RecursiveServer
 * @extends EventEmitter
 */

class RecursiveServer extends DNSServer {
  constructor(options={}) {
    super(options);
    this.resolver = new RecursiveResolver(options);
    this.resolver.on('log', (...args) => this.emit('log', ...args));
    this.resolver.on('error', err => this.emit('error', err));
    this.ra = true;
    this.initOptions(options);
  }

  use (...args) {
    return this.resolver.use(...args);
  }

  get cache() {
    return this.resolver.cache;
  }

  set cache(value) {
    this.resolver.cache = value;
  }

  get hints() {
    return this.resolver.hints;
  }

  set hints(value) {
    this.resolver.hints = value;
  }
}

/*
 * Expose
 */

module.exports = RecursiveServer;
