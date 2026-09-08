/**
 * Dev-only image optimizer.
 * Converts the large public PNGs to optimized WebP at sensible widths.
 * Run: npm run images:optimize
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

const jobs = [
  { src: "public/hero.png", width: 1600, quality: 80 },
  { src: "public/classroom.png", width: 1200, quality: 80 },
  { src: "public/excursio.png", width: 1200, quality: 80 },
  { src: "public/moment.png", width: 1200, quality: 80 },
  { src: "public/director.png", width: 900, quality: 80 },
  { src: "public/logo.png", width: 300, quality: 85 },
  { src: "public/logo-medallion.png", width: 512, quality: 85 },
];

async function main() {
  await mkdir("public", { recursive: true });
  for (const job of jobs) {
    if (!existsSync(job.src)) {
      console.log(`skip: ${job.src} not found (already optimized?)`);
      continue;
    }
    const out = job.src.replace(/\.(png|jpg)$/i, ".webp");
    const info = await sharp(job.src)
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: job.quality, effort: 6 })
      .toFile(out);
    const kb = Math.round(info.size / 1024);
    console.log(`${job.src} -> ${out} (${kb} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});