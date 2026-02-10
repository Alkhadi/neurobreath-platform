#!/usr/bin/env ts-node
/**
 * Evidence Ingestion Script
 * Fetches evidence from credible sources and stores locally for deterministic answers
 * 
 * Usage: yarn evidence:ingest
 */

import fs from 'fs';
import path from 'path';

interface EvidenceSource {
  title: string;
  url: string;
  publisher: string;
  dateAccessed: string;
  keyFindings?: string[];
  pmid?: string;
  levelOfEvidence?: 'high' | 'moderate' | 'low';
}

interface TopicEvidence {
  topic: string;
  sources: EvidenceSource[];
  lastUpdated: string;
}

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'public', 'generated', 'evidence');
const ALLOWED_DOMAINS = [
  'nhs.uk',
  'nice.org.uk',
  'pubmed.ncbi.nlm.nih.gov',
  'ncbi.nlm.nih.gov',
  'cdc.gov',
  'medlineplus.gov',
  'who.int'
];

async function verifyLink(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return response.status === 200;
  } catch {
    return false;
  }
}

function isAllowedDomain(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ALLOWED_DOMAINS.some((domain) => url.hostname.includes(domain));
  } catch {
    return false;
  }
}

async function ingestPTSDEvidence() {
  console.log('[Evidence] Ingesting PTSD evidence...');

  const sources: EvidenceSource[] = [
    {
      title: 'Post-traumatic Stress Disorder (PTSD): Clinical Guideline',
      url: 'https://www.nice.org.uk/guidance/ng26',
      publisher: 'NICE',
      dateAccessed: new Date().toISOString(),
      levelOfEvidence: 'high',
      keyFindings: [
        'PTSD develops in 5-10% of trauma-exposed individuals',
        'Higher prevalence in neurodivergent populations',
        'Trauma-focused CBT and EMDR are evidence-based treatments'
      ]
    },
    {
      title: 'Post-traumatic Stress Disorder',
      url: 'https://www.nhs.uk/mental-health/conditions/post-traumatic-stress-disorder-ptsd/',
      publisher: 'NHS',
      dateAccessed: new Date().toISOString(),
      levelOfEvidence: 'high'
    },
    {
      title: 'MedlinePlus: PTSD Overview',
      url: 'https://medlineplus.gov/posttraumaticstressdisorder.html',
      publisher: 'MedlinePlus',
      dateAccessed: new Date().toISOString(),
      levelOfEvidence: 'high'
    }
  ];

  // Verify links
  console.log('[Evidence] Verifying PTSD evidence links...');
  const verified: EvidenceSource[] = [];

  for (const source of sources) {
    if (!isAllowedDomain(source.url)) {
      console.warn(`[Evidence] ⚠️  Skipping non-allowlisted domain: ${source.url}`);
      continue;
    }

    const isValid = await verifyLink(source.url);
    if (isValid) {
      verified.push(source);
      console.log(`[Evidence] ✓ Verified: ${source.title}`);
    } else {
      console.warn(`[Evidence] ✗ Could not verify: ${source.url}`);
    }
  }

  const evidence: TopicEvidence = {
    topic: 'ptsd',
    sources: verified,
    lastUpdated: new Date().toISOString()
  };

  // Ensure directory exists
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }

  const outputFile = path.join(EVIDENCE_DIR, 'ptsd.json');
  fs.writeFileSync(outputFile, JSON.stringify(evidence, null, 2));

  console.log(`[Evidence] ✓ PTSD evidence saved to ${outputFile}`);
  console.log(`[Evidence] Sources: ${verified.length}`);
}

async function main() {
  try {
    console.log('[Evidence] Starting evidence ingestion...');
    await ingestPTSDEvidence();
    console.log('[Evidence] Done!');
  } catch (error) {
    console.error('[Evidence] Error:', error);
    process.exit(1);
  }
}

main();
