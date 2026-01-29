# Docker dev (local)

If registration shows “Server database is not configured yet”, it means the running server process does not have a working `DATABASE_URL`.

This repo already includes a Compose setup in `web/compose.yml`.

## Quick start

From `web/`:

```bash
docker compose up -d
```

- App: `http://localhost:3000`
- Postgres: `localhost:5432`

## Environment variables

The Compose file provides safe development defaults for:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET` (dev-only)
- `PASSWORD_PEPPER` (dev-only)

For any real deployment, set `NEXTAUTH_SECRET` and `PASSWORD_PEPPER` to strong values in your hosting provider’s env vars (never commit them).

## Common fixes

- If port 3000 is taken: stop whatever is using it or change the `ports:` mapping in `compose.yml`.
- If migrations fail: run `docker compose logs -f db` to confirm Postgres is healthy.

## Useful commands

```bash
# Show logs
docker compose logs -f web

# Run Prisma migrations manually
docker compose exec web yarn prisma migrate deploy

# Stop containers
docker compose down

# Reset DB volume (DATA LOSS)
docker compose down -v
```
