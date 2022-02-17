const { RecursiveServer } = require('./index')
const { wire, dnssec } = require('bns')
const { SOARecord, Record, codes, types, typesByVal } = wire

const server = new RecursiveServer({
  tcp: true,
  inet6: true,
  edns: true,
  dnssec: true
})

server.parseOptions({ dnssec: true })

server.resolver.setStub('149.248.21.56', 53, createDS())

server.resolver.use(':data._alias.', async (params, name, type, res) => {
  const { data } = params

  console.log('[alias]', name, type, data)
  
  res.code = codes.REFUSED

  return res
})

server.resolver.use(':data.:protocol(_hyper|ns.direct)(.*)', async (params, name, type, res) => {
  const { protocol, data } = params

  console.log(`[${protocol}]`, name, type, data)
  
  res.code = codes.REFUSED

  return res
})

server.bind(5333, '127.0.0.1')


// ---


function createDS () {
  const ksk = Record.fromJSON({
    name: '.',
    ttl: 10800,
    class: 'IN',
    type: 'DNSKEY',
    data: {
      flags: 257,
      protocol: 3,
      algorithm: 13,
      publicKey: ''
        + 'T9cURJ2M/Mz9q6UsZNY+Ospyvj+Uv+tgrrWkLtPQwgU/Xu5Yk0l02Sn5ua2x'
        + 'AQfEYIzRO6v5iA+BejMeEwNP4Q=='
    }
  })
  return dnssec.createDS(ksk, dnssec.hashes.SHA256)
}

// ---

const DEFAULT_TTL = 21600;

const serial = () => {
  const date = new Date();
  const y = date.getUTCFullYear() * 1e6;
  const m = (date.getUTCMonth() + 1) * 1e4;
  const d = date.getUTCDate() * 1e2;
  const h = date.getUTCHours();
  return y + m + d + h;
}


function toSOA () {
    const rr = new Record();
    const rd = new SOARecord();

    rr.name = '.';
    rr.type = types.SOA;
    rr.ttl = 86400;
    rr.data = rd;
    rd.ns = '.';
    rd.mbox = '.';
    rd.serial = serial();
    rd.refresh = 1800;
    rd.retry = 900;
    rd.expire = 604800;
    rd.minttl = DEFAULT_TTL;

    return rr;
}

function sendSoa () {
  const res = new wire.Message()
  res.aa = true
  res.authority.push(toSOA())

  // this.ns.signRRSet(res.authority, wire.types.SOA) // get signing right

  return res
}
