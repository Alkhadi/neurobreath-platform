const baseUrl = process.env.TRUST_CHECK_BASE_URL || 'http://localhost:3000';
const routes = ['/uk/trust', '/us/trust'];
const evidenceRoute = '/uk/guides/breathing-exercises-for-stress';

const checkRoute = async route => {
  const res = await fetch(`${baseUrl}${route}`);
  if (!res.ok) {
    throw new Error(`${route} returned ${res.status}`);
  }
  const html = await res.text();
  if (!html.includes('<title')) {
    throw new Error(`${route} missing <title>`);
  }
  if (!html.includes('Trust Centre')) {
    throw new Error(`${route} missing Trust Centre link text`);
  }
  if (!html.includes('hreflang="en-GB"') || !html.includes('hreflang="en-US"')) {
    throw new Error(`${route} missing hreflang alternates`);
  }
  return true;
};

const checkEvidenceRoute = async route => {
  const res = await fetch(`${baseUrl}${route}`);
  if (!res.ok) {
    throw new Error(`${route} returned ${res.status}`);
  }
  const html = await res.text();
  if (!html.includes('Last reviewed')) {
    throw new Error(`${route} missing Last reviewed text`);
  }
  if (!html.includes('Copy link')) {
    throw new Error(`${route} missing Copy link buttons`);
  }
  return true;
};

(async () => {
  try {
    for (const route of routes) {
      await checkRoute(route);
    }
    await checkEvidenceRoute(evidenceRoute);
    console.log('Trust routes check passed.');
  } catch (error) {
    console.error(`Trust routes check failed: ${error.message}`);
    process.exit(1);
  }
})();
