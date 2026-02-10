export const runtime = 'nodejs';

function shortSha(sha: string | undefined): string | null {
  if (!sha) return null;
  const cleaned = sha.trim();
  if (!cleaned) return null;
  return cleaned.slice(0, 12);
}

export async function GET() {
  const sha = shortSha(process.env.VERCEL_GIT_COMMIT_SHA);
  const vercelEnv = process.env.VERCEL_ENV || null;

  return Response.json(
    {
      ok: true,
      sha,
      vercelEnv,
      time: new Date().toISOString(),
    },
    {
      headers: {
        'cache-control': 'no-store',
      },
    }
  );
}
