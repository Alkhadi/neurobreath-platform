import fs from 'fs/promises';
import path from 'path';

export async function fetchText(url) {
  const response = await fetch(url);
  const text = await response.text();
  return { ok: response.ok, status: response.status, text };
}

export function parseSitemapUrls(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(match => match[1].trim()).filter(Boolean);
}

export function parseRobotsMeta(html) {
  const match = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  return match ? match[1].toLowerCase() : '';
}

export function parseCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : null;
}

export function parseHreflang(html) {
  const matches = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi)];
  const entries = new Map();
  matches.forEach(match => {
    entries.set(match[1], match[2]);
  });
  return Object.fromEntries(entries);
}

export function parseJsonLd(html) {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches.map(match => match[1].trim()).filter(Boolean);
}

export function markdownList(items) {
  return items.length ? items.map(item => `- ${item}`).join('\n') : '- None';
}

export async function writeReport(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}
