# NeuroBreath Web (local dev)

## Quick start (local Postgres)

1. Start Docker Desktop (the `docker` CLI must be able to connect to the Docker daemon).
2. Start Postgres:

```bash
yarn db:up
```

3. Create a local `.env` file (Prisma/Next will read it automatically):

```bash
cp config/env.example .env
```

4. Generate Prisma client + push schema:

```bash
yarn prisma:generate
yarn db:push
```

5. Run the app:

```bash
yarn dev -p 3000
```

## Notes

- If the database is down/unreachable, the API routes now **fail fast** and return a safe “empty state” response (instead of stalling for ~10s and returning repeated 500s).

