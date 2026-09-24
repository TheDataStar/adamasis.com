import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['src', 'public/manifest.webmanifest'];
const markers = [
  /\[[A-Z][^\]\n]*\](?!\()/,
  /\bTip:/,
  /\bYYYY\b/,
  /999\.999\.9999/,
  /Your Name|your-handle|you@yourdomain|example\.com/,
];

const files = (path) =>
  statSync(path).isDirectory() ? readdirSync(path).flatMap((f) => files(join(path, f))) : [path];

let count = 0;
for (const file of roots.flatMap(files).filter((f) => /\.(md|ya?ml|ts|astro|webmanifest)$/.test(f))) {
  if (file.endsWith('placeholders.mjs') || file.includes('content.config')) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (markers.some((m) => m.test(line))) {
      console.log(`${file}:${i + 1}  ${line.trim().slice(0, 100)}`);
      count++;
    }
  });
}
console.log(count ? `\n${count} placeholder lines left to fill in.` : 'No placeholders left.');
