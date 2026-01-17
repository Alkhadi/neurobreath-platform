import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildLinkIntelReport } from './link-intel-engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const reportDir = path.join(rootDir, 'reports');
const jsonReportPath = path.join(reportDir, 'link-suggestions.json');
const mdReportPath = path.join(reportDir, 'link-suggestions.md');
const overridesFile = path.join(rootDir, 'lib', 'content', 'link-intel-overrides.ts');

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const writeReports = (report: ReturnType<typeof buildLinkIntelReport>) => {
  ensureDir(reportDir);
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

  const lines: string[] = [
    '# Link Suggestions Report',
    '',
    `Run at: ${report.runAt}`,
    `Pages analyzed: ${report.summary.pages}`,
    `Orphan pages: ${report.summary.orphans}`,
    '',
    '## Global summary',
    '### Orphan pages',
    ...(report.summary.orphanPages?.length ? report.summary.orphanPages.map((url: string) => `- ${url}`) : ['- None']),
    '',
    '### Pages with weak internal linking',
    ...(report.summary.weakPages?.length ? report.summary.weakPages.map((url: string) => `- ${url}`) : ['- None']),
    '',
    '### Pages with too many outgoing links',
    ...(report.summary.overlinkedPages?.length ? report.summary.overlinkedPages.map((url: string) => `- ${url}`) : ['- None']),
    '',
    '### Best linking opportunities by pillar',
    ...Object.entries(report.summary.opportunitiesByPillar || {}).flatMap(([pillar, urls]: [string, string[]]) => [
      `- ${pillar}`,
      ...(urls.length ? urls.map(url => `  - ${url}`) : ['  - None']),
    ]),
    '',
  ];

  report.pages.slice(0, 10).forEach(page => {
    lines.push(`## ${page.url}`);
    page.recommendations.forEach(rec => {
      lines.push(`- ${rec.label} (${rec.url}) — ${rec.reason}, score ${rec.score}`);
    });
    if (!page.recommendations.length) {
      lines.push('- No recommendations available.');
    }
    lines.push('');
  });

  const orphanList = report.pages.filter(page => page.recommendations.length === 0).map(page => `- ${page.url}`);
  if (orphanList.length) {
    lines.push('## Orphan pages');
    lines.push(...orphanList);
  }

  fs.writeFileSync(mdReportPath, lines.join('\n'));
};

const applyOverrides = (report: ReturnType<typeof buildLinkIntelReport>) => {
  const mapLines: string[] = [];
  const formatBadge = (value: string) => {
    if (value === 'cluster' || value === 'pillar') return 'Guide';
    if (value === 'tool') return 'Tool';
    if (value === 'trust') return 'Trust';
    return value;
  };

  report.pages.forEach(page => {
    if (!page.recommendations.length) return;
    mapLines.push(`  '${page.url}': [`);
    page.recommendations.forEach(rec => {
      mapLines.push(`    { href: '${rec.url}', label: '${rec.label}', description: '${rec.description}', typeBadge: '${formatBadge(rec.typeBadge)}' },`);
    });
    mapLines.push('  ],');
  });

  const file = fs.readFileSync(overridesFile, 'utf-8');
  const start = file.indexOf('// AUTO_LINKS_START');
  const end = file.indexOf('// AUTO_LINKS_END');
  if (start === -1 || end === -1) {
    throw new Error('AUTO_LINKS markers not found in link-intel-overrides.ts');
  }
  const updated = `${file.slice(0, start + '// AUTO_LINKS_START'.length)}\n${mapLines.join('\n')}\n  ${file.slice(end)}`;
  fs.writeFileSync(overridesFile, updated);
};

const report = buildLinkIntelReport();
writeReports(report);

if (process.argv.includes('--apply')) {
  applyOverrides(report);
  console.log('Link suggestions applied to link-intel-overrides.ts');
} else {
  console.log('Link suggestions report generated.');
}
