# Migrations (Prisma Postgres + Vercel)

This app uses Prisma Migrate. Production runs on Prisma Postgres.

## Recommended workflow (manual, safe)

Use this when a change to `web/prisma/schema.prisma` has been merged to `main` and you are ready to apply DB changes.

### 1) Ensure Vercel project is linked

```bash
cd web
npx vercel link
```

### 2) Pull Production env vars locally

This ensures Prisma points at the Production database.

```bash
cd web
npx vercel env pull .env.local --environment=production
```

### 3) Apply migrations to Production

```bash
cd web
npx prisma migrate deploy
```

## Notes

- Additive migrations (add tables/columns) are typically safe to deploy alongside code.
- Destructive migrations (drop/rename columns) should be done in phases:
  1) Deploy code that is backward-compatible.
  2) Run migration.
  3) Deploy cleanup that removes the old path.

## Troubleshooting

- If your editor shows missing Prisma fields after a schema change:
  - Run `cd web && yarn prisma generate`
  - Then restart the TypeScript server in VS Code.
