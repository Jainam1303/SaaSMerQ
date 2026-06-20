/**
 * Generates MerQPrime brand raster assets from assets/merqprime-logo.svg
 * Run: node scripts/generate-brand-assets.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ico from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const svgPath = join(root, "assets", "merqprime-logo.svg");

const svg = await readFile(svgPath);

async function png(size, filename) {
  const out = join(publicDir, filename);
  await sharp(svg).resize(size, size).png().toFile(out);
  console.log(`✓ ${filename} (${size}x${size})`);
}

await png(512, "logo.png");
await png(512, "logo-512.png");
await png(192, "logo-192.png");
await png(180, "apple-touch-icon.png");
await png(32, "favicon-32x32.png");
await png(16, "favicon-16x16.png");

const favicon16 = await sharp(svg).resize(16, 16).png().toBuffer();
const favicon32 = await sharp(svg).resize(32, 32).png().toBuffer();
const favicon48 = await sharp(svg).resize(48, 48).png().toBuffer();
const icoBuffer = await ico([favicon16, favicon32, favicon48]);
await writeFile(join(publicDir, "favicon.ico"), icoBuffer);
console.log("✓ favicon.ico");

// Keep a vector fallback for browsers that prefer SVG favicons
await writeFile(join(publicDir, "icon.svg"), svg);
console.log("✓ icon.svg");
