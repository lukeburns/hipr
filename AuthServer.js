/*!
 * auth.js - authoritative dns server for bns
 * Copyright (c) 2018, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/bns
 */

'use strict';

const DNSServer = require('bns/lib/server/dns');
const StubResolver = require('bns/lib/resolver/stub');
const Zone = require('bns/lib/zone');
const { types, typesByVal } = require('bns/lib/wire');
const { match } = require('path-to-regexp');

/**
 * AuthServer
 * @extends EventEmitter
 */

class AuthServer extends DNSServer {
  constructor (options) {
    super(options);
    this.ra = false;
    this.zones = new Set();
    this.layers = [];
    this.resolver = new StubResolver(options);
    this.stub = this.resolver;
    this.initOptions(options);
  }

  async use (hostname, handler) {
    if (!handler && typeof hostname === 'object') {
      handler = hostname.handler;
      hostname = hostname.hostname;
    }

    const fn = typeof hostname === 'function' ? hostname : match(hostname);
    const layer = async (ns, rc, record) => {
      const claim = fn(ns);
      if (!claim) return false;

      const qs = rc.qs;
      const name = qs.name.toLowerCase();
      const type = typesByVal[qs.type];

      this.resolver.emit('intercept:req', claim, name, type, record, rc);
      const res = await handler.call(this, claim.params, name, type, rc.res, rc, record);
      this.resolver.emit('intercept:res', claim, name, type, record, res, rc);

      if (res) {
        rc.res = res;
        rc.res.question = [qs];
        return true;
      } else {
        return false;
      }
    };
    layer.hostname = hostname;
    this.layers.push(layer);
  }

  async middleware (rc) {
    for await (const layer of this.layers) {
      const name = rc.qs.name.toLowerCase();
      if (await layer(name, rc, rc.qs)) {
        return false;
      }

      if (rc.res.authority.length) {
        for (const record of rc.res.authority) {
          if (record.type === types.NS) {
            const ns = record.data.ns.toString();
            if (await layer(ns, rc, record)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  async resolve (req, rinfo) {
    const [qs] = req.question;
    const { name, type } = qs;
    const res = await this.resolver.resolve(qs);
    const rc = { qs, res };
    await this.middleware(rc);
    return rc.res;
  }
}

/*
 * Expose
 */

module.exports = AuthServer;
