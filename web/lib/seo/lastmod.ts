import fs from 'fs/promises';
import path from 'path';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';

const APP_DIR = path.resolve(process.cwd(), 'app');

export async function resolveLastmod(route: string, filePath?: string): Promise<string | undefined> {
  const evidence = evidenceByRoute[route];
  if (evidence?.reviewedAt) {
    return new Date(evidence.reviewedAt).toISOString();
  }

  const resolvedPath = filePath ? filePath : routeToFilePath(route);
  if (!resolvedPath) return undefined;

  try {
    const stats = await fs.stat(resolvedPath);
    return stats.mtime.toISOString();
  } catch {
    return undefined;
  }
}

function routeToFilePath(route: string): string | undefined {
  const cleaned = route === '/' ? '' : route.replace(/^\//, '');
  const filePath = path.join(APP_DIR, cleaned, 'page.tsx');
  return filePath;
}
