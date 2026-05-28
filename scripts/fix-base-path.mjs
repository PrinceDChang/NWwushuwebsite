/**
 * Rewrite root-absolute paths to relative paths so assets work on:
 * - https://princedchang.github.io/NWwushuwebsite/
 * - https://northwestwushu.com/ (custom domain at repo root)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, relative, sep } from 'node:path';

const DIST = 'dist';
const EXT = new Set(['.html', '.js', '.css']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = `${dir}/${name}`;
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function depthFromDist(file) {
  const dir = relative(DIST, dirname(file));
  if (!dir || dir === '.') return 0;
  return dir.split(sep).length;
}

function relPrefix(depth) {
  return depth === 0 ? './' : '../'.repeat(depth);
}

function fixAttributes(content, prefix) {
  return content.replace(
    /(href|src|action)="\/(?!\/|https?:|mailto:|tel:|#)([^"]*)"/g,
    (_, attr, path) => `${attr}="${prefix}${path}"`,
  );
}

function fixCssUrls(content, prefix) {
  return content.replace(/url\(\/(?!\/)([^)]+)\)/g, (_, path) => `url(${prefix}${path})`);
}

let count = 0;
for (const file of walk(DIST)) {
  const ext = file.slice(file.lastIndexOf('.'));
  if (!EXT.has(ext)) continue;

  const depth = depthFromDist(file);
  const prefix = relPrefix(depth);
  let content = readFileSync(file, 'utf8');
  content = fixAttributes(content, prefix);
  if (ext === '.css') content = fixCssUrls(content, prefix);
  writeFileSync(file, content);
  count += 1;
}

console.log(`fix-base-path: rewrote ${count} files with relative asset paths`);
