import http from 'node:http';
import { URL } from 'node:url';

const base = process.argv[2] || 'http://localhost:8788';
const live = process.argv.includes('--live');

function request(body, origin='http://localhost:4321') {
  return new Promise((resolve) => {
    const u = new URL('/api/lead', base);
    const data = JSON.stringify(body);
    const req = http.request(u, { method: 'POST', headers: {
      'Content-Type': 'application/json',
      'Origin': origin,
      'Content-Length': Buffer.byteLength(data),
    } }, (res) => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(out) }); }
        catch { resolve({ status: res.statusCode, json: out }); }
      });
    });
    req.on('error', e => resolve({ status: 0, json: { error: e.message } }));
    req.write(data);
    req.end();
  });
}

const started = Date.now() - 5000;
const valid = { name: 'Тест', contact: '@test_user', consent: true, source: 'contact', formStartedAt: started, website: '', pageUrl: '/' };
const calc = { ...valid, source: 'quick-order', workType: 'Дипломна робота', direction: 'H1', topic: 'Тема тесту', pages: 60, deadline: 'long', estimatedPrice: '14800 грн', comment: 'Коментар', utm: {} };

let pass = 0, fail = 0;
async function check(name, fn) {
  try { await fn(); console.log('PASS', name); pass++; }
  catch (e) { console.error('FAIL', name, e.message); fail++; }
}

await check('valid contact', async () => {
  const r = await request(valid);
  if (r.status !== 200) throw new Error('status ' + r.status + ' ' + JSON.stringify(r.json));
});
await check('valid calculator', async () => {
  const r = await request(calc);
  if (r.status !== 200) throw new Error('status ' + r.status + ' ' + JSON.stringify(r.json));
});
await check('missing name', async () => {
  const r = await request({ ...valid, name: '' });
  if (r.status !== 400 || !r.json.fields?.name) throw new Error(JSON.stringify(r));
});
await check('invalid contact', async () => {
  const r = await request({ ...valid, contact: '!!!' });
  if (r.status !== 400 || !r.json.fields?.contact) throw new Error(JSON.stringify(r));
});
await check('missing consent', async () => {
  const r = await request({ ...valid, consent: false });
  if (r.status !== 400 || !r.json.fields?.consent) throw new Error(JSON.stringify(r));
});
await check('honeypot', async () => {
  const r = await request({ ...valid, website: 'spam' });
  if (r.status !== 200) throw new Error('status ' + r.status);
});
await check('too fast', async () => {
  const r = await request({ ...valid, formStartedAt: Date.now() });
  if (r.status !== 200) throw new Error('status ' + r.status);
});
await check('wrong origin', async () => {
  const r = await request(valid, 'https://evil.example');
  if (r.status !== 403) throw new Error('status ' + r.status);
});
await check('wrong method', async () => {
  const u = new URL('/api/lead', base);
  const res = await new Promise((resolve) => {
    const req = http.request(u, { method: 'GET' }, (r) => { let o=''; r.on('data',c=>o+=c); r.on('end',()=>resolve(r.statusCode)); }); req.end();
  });
  if (res !== 405) throw new Error('status ' + res);
});

if (live) {
  const livePayload = { ...valid, name: 'TEST: Перевірка форми', comment: 'LIVE TEST submission', formStartedAt: Date.now() - 5000 };
  const r = await request(livePayload);
  console.log('LIVE:', r.status, JSON.stringify(r.json));
}

console.log(`done: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);