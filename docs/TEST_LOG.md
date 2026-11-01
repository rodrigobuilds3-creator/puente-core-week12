# PUENTE Week 12 validation log

## Deterministic rule checks

`npm test` ran on 1 November 2026: 10 tests passed, 0 failed. The tests cover minimum and maximum log length, the lowest positive reserve in the presence of a zero-net day, negative and zero-net logs, a positive household floor, daily hours, lost-hours bounds, negative bridge precedence, missing and stale evidence, human-confirmed review status, and the no-double-counting rule for retained income.

`tsc --noEmit --pretty false` passed on 1 November 2026 using the installed TypeScript dependencies. The UI was bundled with esbuild and rendered once to HTML with React server rendering; the headline, form, action and five daily records were present. This is not a substitute for browser interaction testing.

## Outstanding checks

- Complete a Next.js production build and record its actual result.
- Inspect the running app on desktop and at 360 px. The automated approval review for a local preview did not complete because of an account usage limit; no browser interaction or responsive-layout pass is claimed here.
- Run the persona exercise on actual screenshots, log its observations, fix the most important issue and retest. No persona observation, user interview or redesign result is claimed in advance.
- If deployed, record an actual discovered defect, fix, redeploy, deployment URLs and commit hashes. The course requires real evidence of this cycle.
- Real demand, a current-month user, the 10:1 comparison, third-party route terms, Vercel deployment and Supabase persistence remain unverified.
