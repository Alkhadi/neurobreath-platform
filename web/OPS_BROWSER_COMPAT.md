# Ops Verification Checklist — Cross-Browser Reachability

This checklist is for diagnosing the "works in Chrome but fails in Safari/Firefox/Tesla" class of incidents for `neurobreath.co.uk`.

## 1) DNS sanity (Cloudflare)

Verify records match Vercel guidance and there are no duplicates/conflicts.

- **Apex**: `neurobreath.co.uk`
  - Prefer Vercel-recommended A/AAAA or CNAME flattening (depending on your setup).
  - Ensure there is exactly one canonical set of records (no competing A + CNAME).
- **www**: `www.neurobreath.co.uk`
  - CNAME to apex or to Vercel target as configured.

Commands:

- `dig +short neurobreath.co.uk A`
- `dig +short neurobreath.co.uk AAAA`
- `dig +short www.neurobreath.co.uk CNAME`
- `dig +trace neurobreath.co.uk`

Multi-resolver checks (spot ISP-specific weirdness):

- `dig @1.1.1.1 neurobreath.co.uk A +short`
- `dig @8.8.8.8 neurobreath.co.uk A +short`
- `dig @9.9.9.9 neurobreath.co.uk A +short`

## 2) TLS / certificate chain

Browser-specific reachability issues are often:
- TLS chain issues (intermediate missing)
- old cert cached on one network
- Cloudflare mode mismatch (Flexible vs Full/Strict)

Cloudflare settings:
- SSL/TLS mode should be **Full (strict)**
- Universal SSL should be **active**

Commands:

- Inspect the chain:
  - `openssl s_client -connect neurobreath.co.uk:443 -servername neurobreath.co.uk -showcerts </dev/null | openssl x509 -noout -issuer -subject -dates`
- Check protocol/cipher compatibility:
  - `npx @cloudflare/ssl-verifier neurobreath.co.uk` (optional)

## 3) Redirect behavior (avoid loops)

Confirm consistent behavior for:
- `http://neurobreath.co.uk` → `https://neurobreath.co.uk`
- `https://www.neurobreath.co.uk` → `https://neurobreath.co.uk`
- Region routing (e.g. `/` redirecting to `/uk`)

Commands:

- `curl -I http://neurobreath.co.uk`
- `curl -I https://neurobreath.co.uk`
- `curl -I https://www.neurobreath.co.uk`
- `curl -I https://neurobreath.co.uk/`
- `curl -I https://neurobreath.co.uk/uk`

If you suspect loops, add `-L -v`:

- `curl -L -v https://neurobreath.co.uk 2>&1 | head -n 60`

## 4) Cloudflare proxy and caching

Common causes of "Chrome OK, Safari/Firefox failing":
- aggressive caching of HTML
- incorrect compression settings
- edge rules differing by User-Agent

Checklist:
- No HTML caching for dynamic routes unless intentional
- Brotli enabled (safe)
- No UA-based blocking or JS challenges for normal traffic

## 5) CAA / DNSSEC

- If you use **CAA**, confirm it allows your certificate issuer.
- If **DNSSEC** is enabled, verify DS records are correct at the registrar.

## 6) Vercel domain verification

In Vercel:
- Domain is verified and assigned to the correct project
- Both `neurobreath.co.uk` and `www.neurobreath.co.uk` (if used) are configured as expected

## 7) Health endpoint

Use the health endpoint for quick reachability checks:

- `https://neurobreath.co.uk/api/health`

Expected: `200` JSON with `ok: true` and `gitSha` when available.
