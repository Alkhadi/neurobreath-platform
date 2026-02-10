/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

async function generateAppleIcon({ inputPath, outputPath }) {
  await sharp(inputPath)
    .resize(180, 180, { fit: 'contain' })
    .png()
    .toFile(outputPath);
}

async function main() {
  const jobs = [
    {
      inputPath: 'public/icons/neurobreath/icon-512.png',
      outputPath: 'public/icons/neurobreath/apple-icon.png',
    },
    {
      inputPath: 'public/icons/nbcard/icon-512.png',
      outputPath: 'public/icons/nbcard/apple-icon.png',
    },
  ];

  for (const job of jobs) {
    await generateAppleIcon(job);
    console.log(`✅ ${job.outputPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
