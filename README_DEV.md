# NeuroBreath — Dev Workflow (Stable)

This repo is a monorepo. The Next.js app lives in `web/`.

## Canonical rule

- **Run commands from the repo root** (Model A) — root scripts delegate to `web/`.
- **Install dependencies in `web/` only** (single-install policy).

## One-time setup

### 1) Pin Node version

Node is pinned via `.nvmrc` (recommended), and the repo requires Node >= 20.

```bash
nvm install
nvm use
```

If `nvm` fails with a message about `~/.npmrc` having `prefix` / `globalconfig`, temporarily move it out of the way:

```bash
mv ~/.npmrc ~/.npmrc.bak
nvm install
nvm use
mv ~/.npmrc.bak ~/.npmrc
```

### 2) Install

```bash
cd web
yarn install
```

## Daily workflow (recommended)

From repo root:

```bash
yarn doctor
yarn dev
```

Before pushing:

```bash
yarn verify
```

## Recovery commands

From repo root:

- Clean caches/artifacts (safe):
  ```bash
  yarn clean
  ```

- Full reinstall (slow — removes `web/node_modules` too):
  ```bash
  yarn reinstall
  ```

## Environment variables policy

- `web/.env.example` is committed and contains **env var names only**.
- `web/.env.local` is for your machine only and must never be committed.
- CI uses injected environment variables (not your local files).

If you add a new env var in code, add its **name** to `web/.env.example`.

## Notes

- If `yarn doctor` warns about `node_modules/` at repo root, you likely installed in the wrong directory. Run `yarn clean` and reinstall in `web/`.
