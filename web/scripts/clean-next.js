/**
 * Cleans Next.js build caches that can cause runtime ENOENT errors
 * like: ".next/server/pages/_document.js" missing.
 *
 * Safe to run any time (dev/prod). It only removes generated artifacts.
 */

const fs = require('fs')
const path = require('path')

function rmRF(targetPath) {
  try {
    fs.rmSync(targetPath, { recursive: true, force: true })
    return true
  } catch (err) {
    // If rmSync is not available (very old Node), fall back.
    try {
      fs.rmdirSync(targetPath, { recursive: true })
      return true
    } catch {
      return false
    }
  }
}

function main() {
  const root = process.cwd()
  const targets = [
    path.join(root, '.next'),
    path.join(root, '.turbo'),
    path.join(root, 'node_modules', '.cache'),
  ]

  let removedAny = false
  for (const t of targets) {
    const removed = rmRF(t)
    if (removed) removedAny = true
  }

  // eslint-disable-next-line no-console
  console.log(removedAny ? '✅ Cleaned Next.js caches.' : 'ℹ️ Nothing to clean.')
}

main()





