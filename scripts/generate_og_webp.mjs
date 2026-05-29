// Gera versões WebP das imagens Open Graph mantendo os PNGs originais como fallback.
// Plataformas modernas (Discord, LinkedIn, Twitter, Facebook) suportam WebP nativamente.
// Tamanho típico: WebP ~50-60% do PNG equivalente.
//
// Uso: node scripts/generate_og_webp.mjs

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";

const files = await glob("assets/og/*.png");
let totalPng = 0;
let totalWebp = 0;

for (const f of files) {
  const png = fs.statSync(f);
  const out = f.replace(/\.png$/, ".webp");

  await sharp(f)
    .webp({ quality: 85, effort: 6 })
    .toFile(out);

  const webp = fs.statSync(out);
  totalPng += png.size;
  totalWebp += webp.size;

  const ratio = ((1 - webp.size / png.size) * 100).toFixed(1);
  console.log(`${path.basename(f)}: ${(png.size / 1024).toFixed(1)} KB → ${(webp.size / 1024).toFixed(1)} KB (-${ratio}%)`);
}

const total = ((1 - totalWebp / totalPng) * 100).toFixed(1);
console.log(`\nTotal: ${(totalPng / 1024).toFixed(1)} KB → ${(totalWebp / 1024).toFixed(1)} KB (-${total}%)`);
