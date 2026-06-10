// Rogne les marges transparentes de public/logo/salaatu.png en ignorant
// les pixels parasites isolés, et produit public/logo/salaatu-trim.png
// (utilisé en mask CSS dans le Hero).
import sharp from "sharp";

const src = "public/logo/salaatu.png";
const out = "public/logo/salaatu-trim.png";

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
// Densité alpha par ligne / colonne — un trait de calligraphie a des dizaines
// de pixels par ligne, un parasite isolé en a 1 ou 2.
const MIN_ALPHA = 30;
const MIN_COUNT = 8;

const rowCount = new Array(height).fill(0);
const colCount = new Array(width).fill(0);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = data[(y * width + x) * channels + 3];
    if (a > MIN_ALPHA) {
      rowCount[y]++;
      colCount[x]++;
    }
  }
}

const top = rowCount.findIndex((c) => c >= MIN_COUNT);
const bottom = rowCount.length - 1 - [...rowCount].reverse().findIndex((c) => c >= MIN_COUNT);
const left = colCount.findIndex((c) => c >= MIN_COUNT);
const right = colCount.length - 1 - [...colCount].reverse().findIndex((c) => c >= MIN_COUNT);

const pad = 6;
const region = {
  left: Math.max(0, left - pad),
  top: Math.max(0, top - pad),
  width: Math.min(width, right + pad) - Math.max(0, left - pad),
  height: Math.min(height, bottom + pad) - Math.max(0, top - pad),
};

await sharp(src).extract(region).png().toFile(out);
console.log(`OK ${out} — ${region.width}x${region.height} (depuis ${width}x${height})`);
