/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

async function generateMaskable({ inputPath, outputPath, size, inner }) {
  const pad = Math.floor((size - inner) / 2);
  if (pad * 2 + inner !== size) {
    throw new Error(`Invalid size/inner combo: size=${size} inner=${inner}`);
  }

  await sharp(inputPath)
    .resize(inner, inner, { fit: 'contain' })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outputPath);
}

async function main() {
  const jobs = [
    // NeuroBreath
    {
      inputPath: 'public/icons/neurobreath/icon-512.png',
      outputPath: 'public/icons/neurobreath/maskable-512.png',
      size: 512,
      inner: 410,
    },
    {
      inputPath: 'public/icons/neurobreath/icon-192.png',
      outputPath: 'public/icons/neurobreath/maskable-192.png',
      size: 192,
      inner: 154,
    },

    // NB-Card (currently uses same base icon artwork)
    {
      inputPath: 'public/icons/nbcard/icon-512.png',
      outputPath: 'public/icons/nbcard/maskable-512.png',
      size: 512,
      inner: 410,
    },
    {
      inputPath: 'public/icons/nbcard/icon-192.png',
      outputPath: 'public/icons/nbcard/maskable-192.png',
      size: 192,
      inner: 154,
    },
  ];

  for (const job of jobs) {
    await generateMaskable(job);
    console.log(`✅ ${job.outputPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
