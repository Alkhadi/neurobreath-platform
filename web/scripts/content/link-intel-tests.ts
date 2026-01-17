import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildRouteRegistry } from './route-registry';
import { buildLinkIntelReport, scoreCandidate } from './link-intel-engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const snapshotPath = path.join(rootDir, 'tests', 'link-intel.snapshot.json');

const registry = buildRouteRegistry();
const report = buildLinkIntelReport();

const getEntry = (url: string) => registry.find(entry => entry.url === url);

const a = getEntry('/guides/breathing/box-breathing');
const b = getEntry('/guides/breathing/coherent-breathing');
const c = getEntry('/tools/breath-tools');

assert(a && b && c, 'Required test fixtures missing in registry.');

const scoreAB = scoreCandidate(a!, b!);
const scoreAC = scoreCandidate(a!, c!);
assert(scoreAB >= scoreAC, 'Expected sibling guides to score higher than tool.');

const samplePages = report.pages.filter(page =>
  ['/guides/breathing/box-breathing', '/guides/breathing/coherent-breathing', '/tools/breath-tools'].includes(page.url),
);

const snapshotPayload = samplePages.map(page => ({
  url: page.url,
  recommendations: page.recommendations.slice(0, 3).map(rec => rec.url),
}));

if (!fs.existsSync(snapshotPath)) {
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshotPayload, null, 2));
  console.log('Snapshot created at tests/link-intel.snapshot.json');
  process.exit(0);
}

const expected = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
assert.deepStrictEqual(snapshotPayload, expected, 'Link intel snapshot does not match.');

console.log('Link intel tests passed.');
