/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

function clampByte(n) {
  if (n < 0) return 0;
  if (n > 255) return 255;
  return n;
}

function rgbDistance(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function sampleCornerAverageRgb({ data, width, height, channels }, sampleSize = 5) {
  const s = Math.max(1, Math.min(sampleSize, width, height));
  const corners = [
    { x0: 0, y0: 0 },
    { x0: width - s, y0: 0 },
    { x0: 0, y0: height - s },
    { x0: width - s, y0: height - s },
  ];

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  for (const c of corners) {
    for (let y = c.y0; y < c.y0 + s; y++) {
      for (let x = c.x0; x < c.x0 + s; x++) {
        const idx = (y * width + x) * channels;
        totalR += data[idx];
        totalG += data[idx + 1];
        totalB += data[idx + 2];
        count++;
      }
    }
  }

  if (count === 0) return { r: 0, g: 0, b: 0 };
  return {
    r: clampByte(Math.round(totalR / count)),
    g: clampByte(Math.round(totalG / count)),
    b: clampByte(Math.round(totalB / count)),
  };
}

async function analyze(file) {
  const image = sharp(file);
  const meta = await image.metadata();
  const width = meta.width;
  const height = meta.height;
  if (!width || !height) throw new Error('Missing dimensions');

  const out = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = out.data;
  const channels = out.info.channels;
  const raw = { data, width, height, channels };

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = data[idx + 3];
      if (a !== 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const hasOpaque = maxX >= 0;

  const alphaPadding = hasOpaque
    ? {
        left: minX,
        top: minY,
        right: width - 1 - maxX,
        bottom: height - 1 - maxY,
      }
    : { left: width, top: height, right: width, bottom: height };

  const alphaMinPad = Math.min(
    alphaPadding.left,
    alphaPadding.top,
    alphaPadding.right,
    alphaPadding.bottom
  );
  const minSide = Math.min(width, height);
  const alphaMinPadPct = Math.round((alphaMinPad / minSide) * 10000) / 100;

  // Content padding: infer a background color from the corners, then find the
  // bounding box of pixels that differ from that background by a threshold.
  const bg = sampleCornerAverageRgb(raw, 5);
  const threshold = 18; // RGB euclidean distance; tuned for typical logo-on-solid background

  let cMinX = width;
  let cMinY = height;
  let cMaxX = -1;
  let cMaxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = data[idx + 3];
      if (a === 0) continue;

      const px = { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
      if (rgbDistance(px, bg) > threshold) {
        if (x < cMinX) cMinX = x;
        if (y < cMinY) cMinY = y;
        if (x > cMaxX) cMaxX = x;
        if (y > cMaxY) cMaxY = y;
      }
    }
  }

  const hasContent = cMaxX >= 0;
  const contentPadding = hasContent
    ? {
        left: cMinX,
        top: cMinY,
        right: width - 1 - cMaxX,
        bottom: height - 1 - cMaxY,
      }
    : { left: width, top: height, right: width, bottom: height };

  const contentMinPad = Math.min(
    contentPadding.left,
    contentPadding.top,
    contentPadding.right,
    contentPadding.bottom
  );
  const contentMinPadPct = Math.round((contentMinPad / minSide) * 10000) / 100;

  return {
    file,
    width,
    height,
    hasOpaque,
    alphaPadding,
    alphaMinPad,
    alphaMinPadPct,
    background: bg,
    threshold,
    hasContent,
    contentPadding,
    contentMinPad,
    contentMinPadPct,
  };
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: node web/scripts/icon-analyze.js <file1> <file2> ...');
    process.exit(2);
  }

  for (const f of files) {
    try {
      const result = await analyze(f);
      console.log(JSON.stringify(result));
    } catch (e) {
      console.log(JSON.stringify({ file: f, error: String(e?.message ?? e) }));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
