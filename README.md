# EL-BETH-EL The Kings' School

School website with public pages, an admissions system, and role-based portals (administrator, teacher, student, parent) built with Next.js (App Router), React 19, Tailwind CSS v4, Prisma, and PostgreSQL (hosted on Neon). Deployed on Vercel.

## Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS v4, lucide-react, recharts
- **Data:** Prisma 7 + PostgreSQL (Neon), driver adapter `@prisma/adapter-pg`
- **Auth:** NextAuth v5 (credentials + JWT sessions)
- **Email/WhatsApp notifications:** optional SMTP (Hostinger) + Twilio (best-effort, silent when unconfigured)

## Getting started

```bash
npm install
npm run dev
```

Requires a `DATABASE_URL` pointing at a PostgreSQL database (the app no longer uses SQLite). Create a free project at Neon, copy the connection string into `.env`:

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="<generate one>"
```

Apply schema and seed demo data:

```bash
npx prisma migrate deploy
npm run db:seed
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run create-admin` | Create an admin account |

## Demo accounts

Seeded accounts (password `Password123!`) — sign in at `/login`:

- Super Admin: `admin@elbethel.edu`
- Teacher: `teacher@elbethel.edu`
- Student: `student@elbethel.edu`
- Parent: `parent@elbethel.edu`

## Custom domain & email

- **Domain:** `elbethelthekings.xyz` (registered at Hostinger, attached to Vercel project)
- **Email:** `admin@elbethelthekings.xyz` (Hostinger mailbox, used as super admin login + SMTP sender)

### DNS records (Hostinger DNS Zone — do NOT change nameservers to Vercel)

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
| MX | @ | mail.elbethelthekings.xyz (10) |
| TXT | @ | v=spf1 include:hostinger.com ~all |

Keep Hostinger's default MX/SPF/DKIM records for the mailbox.

## Deployment

Connected to Vercel via Git — pushing to `main` auto-deploys to production. Required environment variables on Vercel: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`. Optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `ADMIN_NOTIFY_EMAIL`, and the `TWILIO_*` variables.

## Super admin

- **Email:** `admin@elbethelthekings.xyz`
- **Password:** `adm1nu53R_`

All other seeded accounts use password `Password123!`.