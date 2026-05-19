# Vercel deployment (Chattha's)

Two separate Vercel projects are required.

## 1. chatthas-platform (Next.js)

| Setting | Value |
|---------|--------|
| Root Directory | `frontend/chatthas-platform` |
| Framework | Next.js |
| Build Command | `npm run build` |

**Environment variables** (Production + Preview):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` → `https://chatthas-platform.vercel.app`
- Stripe / PayFast keys (see `.env.example`)

## 2. chatthas-website (Vite)

| Setting | Value |
|---------|--------|
| Root Directory | `frontend/chatthas-website` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment variables**:

- `VITE_PLATFORM_URL` → `https://chatthas-platform.vercel.app`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

`vercel.json` in the website project proxies `/admin` and `/api` to the platform deployment.

## CLI deploy (from repo root via Z: drive)

```bat
subst Z: "c:\Users\User\Project Chattha's"
Z:
cd Z:\frontend\chatthas-platform
vercel link
vercel env pull .env.local
vercel --prod

cd Z:\frontend\chatthas-website
vercel link
vercel --prod
```
