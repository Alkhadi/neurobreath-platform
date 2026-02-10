import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { spawnSync } from 'child_process';

interface GateRun {
  name: string;
  command: string;
  ok: boolean;
  exitCode: number | null;
}

interface QualityGatesOutput {
  generatedAt: string;
  applyFixes: boolean;
  runs: GateRun[];
  totals: {
    critical: number;
    warning: number;
  };
  notes: string[];
}

function run(cmd: string, args: string[]): GateRun {
  const pretty = [cmd, ...args].join(' ');
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  const exitCode = res.status;
  return { name: args.join(' '), command: pretty, ok: exitCode === 0, exitCode };
}

function toMarkdown(output: QualityGatesOutput) {
  const lines: string[] = [];
  lines.push('# Quality Gates');
  lines.push('');
  lines.push(`Generated: ${output.generatedAt}`);
  lines.push('');

  lines.push('## Runs');
  lines.push('');
  lines.push('| Gate | OK | Exit |');
  lines.push('|---|---:|---:|');
  for (const r of output.runs) {
    lines.push(`| ${r.name} | ${r.ok ? 'yes' : 'no'} | ${r.exitCode ?? ''} |`);
  }
  lines.push('');

  lines.push('## Totals');
  lines.push('');
  lines.push(`- Critical: ${output.totals.critical}`);
  lines.push(`- Warnings: ${output.totals.warning}`);
  lines.push('');

  if (output.notes?.length) {
    lines.push('## Notes');
    lines.push('');
    for (const note of output.notes) lines.push(`- ${note}`);
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const webRoot = process.cwd();
  const reportsDir = join(webRoot, 'reports', 'audits');
  await mkdir(reportsDir, { recursive: true });

  const applyFixes = process.env.APPLY_FIXES === '1' || process.env.APPLY_FIXES === 'true';

  const runs: GateRun[] = [];

  // 1) Route inventory (writes both .seo and /reports/audits)
  runs.push(run('node', ['scripts/seo/route-inventory.mjs']));

  // 2) Conversion/trust audit
  runs.push(run('npx', ['tsx', 'scripts/audits/conversion-trust-audit.ts', ...(applyFixes ? ['--apply'] : [])]));

  // 3) Growth hub audit
  runs.push(run('npx', ['tsx', 'scripts/growth/hub-audit.ts']));

  const notes: string[] = [];
  const totals = { critical: 0, warning: 0 };

  // Pull totals from JSON reports when available.
  try {
    const conversion = JSON.parse(await readFile(join(reportsDir, 'conversion-trust-audit.json'), 'utf8'));
    totals.critical += conversion?.totals?.critical ?? 0;
    totals.warning += conversion?.totals?.warning ?? 0;
  } catch {
    notes.push('Could not read conversion-trust-audit.json');
  }

  try {
    const hub = JSON.parse(await readFile(join(webRoot, 'reports', 'growth', 'hub-audit.json'), 'utf8'));
    totals.critical += hub?.totals?.critical ?? 0;
    totals.warning += hub?.totals?.warning ?? 0;
  } catch {
    notes.push('Could not read growth/hub-audit.json');
  }

  const output: QualityGatesOutput = {
    generatedAt: new Date().toISOString(),
    applyFixes,
    runs,
    totals,
    notes,
  };

  await writeFile(join(reportsDir, 'quality-gates.json'), JSON.stringify(output, null, 2));
  await writeFile(join(reportsDir, 'quality-gates.md'), toMarkdown(output));

  const anyRunFailed = runs.some(r => !r.ok);
  if (anyRunFailed || totals.critical > 0) {
    // eslint-disable-next-line no-console
    console.error(`❌ Quality gates failed. Critical: ${totals.critical}.`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Quality gates passed. Warnings: ${totals.warning}.`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('❌ Quality gates crashed:', err);
  process.exit(1);
});
