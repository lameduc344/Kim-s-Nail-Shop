# Kim's Nails

Production website and customer-facing experience for Kim's Nails.

## Production

- Production branch: `main`
- Permanent site: `https://kim-s-nail-shop.vercel.app`
- Deployment: Vercel from `main`
- Deployment procedure: see `DEPLOYMENT.md`

`main` is the production source of truth. Do not use a Vercel preview URL as the public website.

## Local development

Use Node.js 20 and install the locked dependencies:

```bash
npm ci
npm run dev
```

Before opening a pull request or pushing a production change:

```bash
npm run lint
npm run build
```

## Change workflow

Always begin from a current copy of production:

```bash
git checkout main
git pull --ff-only origin main
git status
```

Small, low-risk content corrections can use the fast lane described in `DEPLOYMENT.md`. Booking, database, authentication, API, dependency, configuration, and larger UI work must use a short-lived branch and pull request.

GitHub Actions verifies lint and the production build on pull requests and pushes to `main`.

## Data ownership

The public service menu currently comes from `data/services.ts`. Do not duplicate that service list inside the booking UI.

The planned architecture makes Nail Source authoritative for live service records, pricing, availability, and bookings. Kim's Nails remains the customer-facing storefront.

## Environment

Use `.env.example` as the reference for required environment variables. Never commit secrets or production credentials.

## Release rule

A change is finished only after the intended commit is on `main`, CI passes, Vercel production matches that commit, and the permanent production URL has been verified.
