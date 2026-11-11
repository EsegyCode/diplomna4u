#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const ROOTS = ['src', 'public', 'dist'];
const EXT = new Set(['.astro','.ts','.tsx','.js','.json','.md','.mdx','.html','.css','.yml','.yaml','.txt','.xml']);
let errors = 0;

function walk(dir, cb) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, cb);
    else cb(p);
  }
}

const badPatterns = [
  /[\u0420\u0421][\u0080-\u00BF]/g,
  /[\u00D0\u00D1][\u0080-\u00BF]/g,
  /\uFFFD/g,
];

for (const root of ROOTS) {
  walk(root, (p) => {
    if (!EXT.has(p.slice(p.lastIndexOf('.')))) return;
    let content;
    try { content = readFileSync(p, 'utf-8'); } catch { return; }
    for (const pat of badPatterns) {
      const m = content.match(pat);
      if (m) {
        console.error(`BAD encoding marker in ${p}: ${m.slice(0,5).join(' ')}`);
        errors++;
        return;
      }
    }
  });
}

if (errors > 0) {
  console.error(`check:encoding failed with ${errors} file(s)`);
  process.exit(1);
}
console.log('check:encoding passed');
