#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const source = path.join(publicDir, 'brand', 'logo.webp');

if (!fs.existsSync(source)) {
  console.error(`Source logo not found: ${source}`);
  process.exit(1);
}

async function render(size, outName, padding = 0) {
  const resizeSize = size - padding * 2;
  const logoBuf = await sharp(source).resize(resizeSize, resizeSize, { fit: 'contain', background: '#FFFDF8' }).png().toBuffer();
  if (padding === 0) {
    await sharp(logoBuf).resize(size, size, { fit: 'contain', background: '#FFFDF8' }).png().toFile(path.join(publicDir, outName));
  } else {
    await sharp({ create: { width: size, height: size, channels: 4, background: '#FFFDF8' } })
      .composite([{ input: logoBuf, gravity: 'center' }])
      .png()
      .toFile(path.join(publicDir, outName));
  }
  console.log(`generated ${outName}`);
}

async function main() {
  fs.mkdirSync(publicDir, { recursive: true });

  await render(180, 'apple-touch-icon.png');
  await render(192, 'icon-192.png');
  await render(512, 'icon-512.png');
  await render(512, 'icon-maskable-512.png', 80);

  // Optimized logo copies
  await sharp(source).resize(512, 512, { fit: 'contain', background: '#FFFDF8' }).png().toFile(path.join(publicDir, 'logo.png'));
  await sharp(source).resize(512, 512, { fit: 'contain', background: '#FFFDF8' }).webp().toFile(path.join(publicDir, 'logo.webp'));
  await sharp(source).resize(512, 512, { fit: 'contain', background: '#5D0D18' }).png().toFile(path.join(publicDir, 'logo-dark.png'));
  console.log('generated logo.png / logo.webp / logo-dark.png');

  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => sharp(source).resize(s, s, { fit: 'contain', background: '#FFFDF8' }).png().toBuffer()));
  const ico = buildIco(pngs, sizes);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
  console.log('generated favicon.ico');
}

function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = [];
  for (let i = 0; i < count; i++) {
    const dim = sizes[i] >= 256 ? 0 : sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(dim, 0);
    entry.writeUInt8(dim, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(pngBuffers[i].length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += pngBuffers[i].length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
