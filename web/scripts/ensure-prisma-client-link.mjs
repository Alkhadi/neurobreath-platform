import fs from 'node:fs';
import path from 'node:path';

function exists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

function ensureSymlink() {
  const webRoot = process.cwd();

  const prismaClientPkg = path.join(webRoot, 'node_modules', '@prisma', 'client');
  const linkPath = path.join(prismaClientPkg, '.prisma');
  const targetPath = path.join(webRoot, 'node_modules', '.prisma');

  // If @prisma/client isn't installed, nothing to do.
  if (!exists(prismaClientPkg)) return;

  // If already present, leave it.
  if (exists(linkPath)) return;

  // If the target doesn't exist, nothing to link.
  if (!exists(targetPath)) return;

  fs.symlinkSync(path.relative(prismaClientPkg, targetPath), linkPath, 'dir');
}

try {
  ensureSymlink();
} catch (err) {
  // Never fail install over this; Prisma still works in some environments.
  // This is primarily to help tooling resolve generated types consistently.
  // eslint-disable-next-line no-console
  console.warn('[ensure-prisma-client-link] skipped:', err?.message || err);
}
