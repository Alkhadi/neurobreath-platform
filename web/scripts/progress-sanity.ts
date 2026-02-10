type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function parseArgs(argv: string[]) {
  const args = new Set(argv);
  const baseUrl = argv.find((a) => !a.startsWith("-")) ?? "http://localhost:3000";
  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    verbose: args.has("--verbose"),
  };
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJsonOrText(res: Response): Promise<JsonValue | string> {
  const text = await res.text();
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}

function extractDeviceCookie(setCookie: string | null): string | null {
  if (!setCookie) return null;
  const match = /(?:^|,\s*)nb_device_id=([^;]+)/.exec(setCookie);
  if (!match) return null;
  return `nb_device_id=${match[1]}`;
}

async function waitForServer(baseUrl: string) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${baseUrl}/`, { method: "GET" });
      if (res.ok) return;
    } catch {
      // ignore
    }
    await sleep(250);
  }
  throw new Error(`Server not reachable at ${baseUrl}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const { baseUrl, verbose } = parseArgs(process.argv.slice(2));

  console.log(`Progress sanity check -> ${baseUrl}`);
  await waitForServer(baseUrl);

  console.log("\n1) GET /api/progress/summary (no cookie)");
  let res = await fetch(`${baseUrl}/api/progress/summary?range=7d&subject=self`, {
    headers: { accept: "application/json" },
  });
  const summary1 = await readJsonOrText(res);
  console.log(`status ${res.status}`);
  if (verbose) console.log(summary1);
  assert(res.ok, `Expected 200 but got ${res.status} for summary (no cookie)`);

  console.log("\n2) POST /api/progress/events (capture nb_device_id)");
  res = await fetch(`${baseUrl}/api/progress/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      type: "breathing_completed",
      metadata: {
        techniqueId: "box-4444",
        durationSeconds: 180,
        category: "calm",
      },
      path: "/uk/breathing/focus",
    }),
  });
  const setCookie = res.headers.get("set-cookie");
  const cookie = extractDeviceCookie(setCookie);
  const postBody = await readJsonOrText(res);
  console.log(`status ${res.status}`);
  console.log(`cookie ${cookie ?? "(none)"}`);
  if (verbose) console.log(postBody);
  assert(res.ok, `Expected 200 but got ${res.status} for event ingestion`);
  assert(cookie, "Expected Set-Cookie for nb_device_id on first event ingestion");

  console.log("\n3) GET /api/progress/summary (with cookie)");
  res = await fetch(`${baseUrl}/api/progress/summary?range=7d&subject=self`, {
    headers: { accept: "application/json", cookie },
  });
  const summary2 = await readJsonOrText(res);
  console.log(`status ${res.status}`);
  if (verbose) console.log(summary2);
  assert(res.ok, `Expected 200 but got ${res.status} for summary (with cookie)`);

  if (typeof summary2 === "object" && summary2 !== null) {
    const totals = (summary2 as { totals?: { totalEvents?: number; minutesBreathing?: number } }).totals;
    assert(totals?.totalEvents && totals.totalEvents >= 1, "Expected totals.totalEvents >= 1 after ingest");
    assert(
      typeof totals.minutesBreathing === "number" && totals.minutesBreathing >= 3,
      "Expected totals.minutesBreathing >= 3 after ingest",
    );
  }

  console.log("\n4) GET /progress (no infinite loader)");
  res = await fetch(`${baseUrl}/progress`, {
    headers: { cookie },
  });
  const html = await res.text();
  console.log(`status ${res.status}`);
  assert(res.ok, `Expected 200 but got ${res.status} for /progress`);
  assert(!html.includes("Loading progress..."), "Found legacy 'Loading progress...' string in /progress HTML");

  console.log("\n✅ Progress sanity check passed");
}

main().catch((err) => {
  console.error("\n❌ Progress sanity check failed");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
