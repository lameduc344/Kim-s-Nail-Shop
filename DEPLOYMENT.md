# Kim's Nails Deployment Contract

## Source of truth

- `main` is the production source of truth.
- The permanent customer URL is `https://kim-s-nail-shop.vercel.app`.
- Vercel preview URLs are for testing only and must not be shared as the public site.
- Never treat a local working tree or an agent branch as production truth.

## Before every change

```bash
git checkout main
git pull --ff-only origin main
git status
```

Start feature or risky work from the freshly synchronized `main` branch.

## Change lanes

### Fast lane

Use only for small, low-risk content changes such as copy, confirmed contact details, hours, or a simple image/content correction.

Requirements before pushing to `main`:

```bash
npm run lint
npm run build
```

Keep the commit narrowly scoped and verify production immediately after Vercel finishes deploying.

### Standard lane

Use a short-lived branch and pull request for:

- booking or availability
- Supabase/database changes
- authentication or authorization
- careers/applicant data
- API routes
- dependencies
- routing or configuration
- multi-file UI changes

Suggested branch names: `fix/...`, `feature/...`, or `chore/...`.

Before merging:

```bash
npm run lint
npm run build
```

CI must also pass.

## Production verification

After a merge or direct production commit:

1. Confirm GitHub `main` contains the intended commit.
2. Confirm the Vercel production deployment was built from that same commit.
3. Open the permanent customer URL, not a preview URL.
4. Verify the changed page on desktop and mobile.
5. For booking, forms, auth, or data changes, run the affected customer flow end-to-end.

If GitHub and Vercel commit SHAs differ, stop. Do not debug the browser first; resolve the deployment mismatch.

## Business data

- Public service-menu data currently lives in `data/services.ts`.
- Do not create a second hard-coded service list for booking.
- Nail Source is the planned authoritative source for live services, prices, availability, and bookings once that integration is enabled.
- Until owner details are confirmed, do not replace placeholders with guessed business information.

## Emergency rollback

If a production update breaks the site:

1. Identify the last known-good commit on `main`.
2. Revert the bad commit rather than stacking speculative fixes.
3. Let Vercel deploy the revert.
4. Verify the permanent URL.
5. Repair the original change on a branch and send it through CI.

## Definition of done

A change is not complete when the code is written. It is complete when lint/build pass, the intended commit is on `main`, Vercel production matches that commit, and the permanent site has been verified.
