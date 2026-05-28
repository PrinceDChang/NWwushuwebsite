/**
 * GitHub project Pages serves at /REPO_NAME/ — root-absolute paths in HTML/JS break.
 * Run after `astro build` when `base` is set in astro.config.mjs.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.env.PAGES_BASE || '/NWwushuwebsite').replace(/\/$/, '');
const DIST = 'dist';
const EXT = new Set(['.html', '.js', '.css']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function fix(content) {
  return content
    .replace(/(href|src|action)="\/(?!\/|NWwushuwebsite)/g, `$1="${BASE}/`)
    .replace(/url\(\/(?!\/|NWwushuwebsite)/g, `url(${BASE}/`);
}

let count = 0;
for (const file of walk(DIST)) {
  if (!EXT.has(file.slice(file.lastIndexOf('.')))) continue;
  const next = fix(readFileSync(file, 'utf8'));
  writeFileSync(file, next);
  count += 1;
}

console.log(`fix-base-path: updated ${count} files with base "${BASE}"`);
