# M.J. High School Website

Full-stack Next.js 15 school website for M.J. High School, Karanja Lad, Washim, Maharashtra.

## Tech Stack
- Next.js 15 (App Router) · TypeScript
- PostgreSQL + Prisma ORM
- NextAuth v5 (credentials-based)
- Tailwind CSS + shadcn/ui
- Cloudinary (optional, for image uploads)

## Default Credentials (after seed)
| Role        | Email                          | Password     |
|-------------|-------------------------------|--------------|
| Super Admin | kishor@mjhskaranja.edu.in     | kishor@123   |
| Staff       | staff1@mjhskaranja.edu.in     | staff1@123   |

## Setup — Windows (PowerShell)
See Windows setup commands below.

## Setup — Linux / macOS
```bash
npm install --legacy-peer-deps
# Edit .env.local
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
