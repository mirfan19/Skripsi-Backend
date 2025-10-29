const dns = require('dns');
const net = require('net');

const host = process.env.DB_HOST || (process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : undefined);
console.log('Host to test ->', host);

if (!host) {
  console.error('No DB_HOST or DATABASE_URL found in env.');
  process.exit(1);
}

dns.lookup(host, (err, address) => {
  if (err) return console.error('DNS lookup failed:', err.message);
  console.log('Resolved address:', address);
  const sock = net.connect({ host: address, port: process.env.DB_PORT || 5432 }, () => {
    console.log('TCP connect OK');
    sock.destroy();
  });
  sock.on('error', e => console.error('TCP connect error:', e.message));
});