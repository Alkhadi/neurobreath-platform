# Serverless Backend (Cloudflare Workers)

**Purpose**: API proxy layer and backend services for NeuroBreath, deployed on Cloudflare Workers for edge computing.

---

## 📁 Directory Structure

```
serverless/
├── README.md           # This file
└── worker/             # Cloudflare Worker source code
    ├── src/
    │   └── index.ts    # Main Worker entry point
    ├── wrangler.toml   # Wrangler configuration
    └── package.json    # Worker dependencies
```

---

## 🎯 Purpose

### **Phase 1** (Current)
- No serverless functions yet (web app uses LocalStorage only)

### **Phase 2** (Q1 2025)
- User authentication API (NextAuth.js integration)
- Progress sync endpoints (GET/POST user data)
- Email notifications (session reminders)

### **Phase 3** (Q2 2025)
- Cloudflare D1 Database integration
- Admin dashboard API (usage analytics)
- Third-party integrations (Stripe, SendGrid)

---

## 🚀 Deployment

### **Prerequisites**
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Cloudflare account with Workers plan ($5/month)

### **Local Development**
```bash
cd serverless/worker
npm install
npx wrangler dev    # Start local dev server on http://localhost:8787
```

### **Production Deployment**
```bash
cd serverless/worker
npx wrangler deploy    # Deploy to Cloudflare edge network
```

---

## 📦 Planned API Endpoints

### **Authentication** (`/auth`)
- `POST /auth/signup` — Create new user account
- `POST /auth/login` — Email/password login
- `POST /auth/logout` — Invalidate session
- `GET /auth/session` — Verify current session

### **User Data** (`/api/user`)
- `GET /api/user/profile` — Fetch user profile
- `PUT /api/user/profile` — Update user profile
- `GET /api/user/progress` — Fetch progress data
- `POST /api/user/progress` — Sync progress from device
- `DELETE /api/user/account` — Delete account + data

### **Content** (`/api/content`)
- `GET /api/content/challenges` — Fetch challenge definitions
- `GET /api/content/badges` — Fetch badge metadata
- `GET /api/content/resources` — Fetch downloadable resources

### **Admin** (`/api/admin`)
- `GET /api/admin/analytics` — Usage statistics
- `POST /api/admin/content` — Update content (CMS)

---

## 🔧 Technology Stack

### **Runtime**
- **Cloudflare Workers**: V8-based edge runtime (50ms CPU limit)
- **Wrangler**: CLI for local dev + deployment

### **Database**
- **Cloudflare D1**: SQLite-compatible serverless SQL database
- **Cloudflare KV**: Key-value store for caching
- **Cloudflare R2**: S3-compatible object storage (media files)

### **Language**
- **TypeScript**: Typed JavaScript for Workers
- **Hono**: Lightweight web framework (Express-like API)

### **Authentication**
- **NextAuth.js**: Integrated with Workers adapter
- **JWT Tokens**: Stateless authentication

---

## 🔒 Security

### **Best Practices**
- Store secrets in `.dev.vars` (local) and Cloudflare dashboard (production)
- Validate all inputs (Zod schemas)
- Rate limiting via Cloudflare Workers KV
- CORS headers for web app origin only
- HTTPS-only (enforced by Cloudflare)

### **Environment Variables**
```bash
# .dev.vars (local development - DO NOT COMMIT)
DATABASE_ID=your_d1_database_id
NEXTAUTH_SECRET=your_secret_here
EMAIL_API_KEY=your_sendgrid_key
```

---

## 📊 Performance

### **Cloudflare Workers Limits**
- **CPU Time**: 50ms per request (Workers Paid plan)
- **Memory**: 128 MB
- **Request Size**: 100 MB
- **Subrequest Limit**: 50 per request

### **Optimization Strategies**
- Cache responses in Cloudflare KV (TTL: 1 hour)
- Use Cloudflare Cache API for static content
- Minimize database queries (batch reads)
- Offload heavy processing to Durable Objects

---

## 🚧 Status

**Current**: Placeholder directory (no code yet)  
**Next Steps** (Phase 2):
1. Initialize Wrangler project: `wrangler init`
2. Set up D1 database: `wrangler d1 create neurobreath-db`
3. Create authentication endpoints
4. Integrate with NextAuth.js in `/web`
5. Deploy to Cloudflare Workers

---

## 📚 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Hono Framework](https://hono.dev/)

---

**Last Updated**: December 25, 2024
