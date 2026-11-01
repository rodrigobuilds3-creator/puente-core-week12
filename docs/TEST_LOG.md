# PUENTE Week 12 validation log

## Deterministic rule checks

`npm test` ran on 1 November 2026: 10 tests passed, 0 failed. The tests cover minimum and maximum log length, the lowest positive reserve in the presence of a zero-net day, negative and zero-net logs, a positive household floor, daily hours, lost-hours bounds, negative bridge precedence, missing and stale evidence, human-confirmed review status, and the no-double-counting rule for retained income.

`tsc --noEmit --pretty false` passed on 1 November 2026 using the installed TypeScript dependencies. The UI was bundled with esbuild and rendered once to HTML with React server rendering; the headline, form, action and five daily records were present.

On 1 November the React component was also inspected in a local browser preview assembled with esbuild. The desktop landing page rendered; loading the fictional example and calculating showed a $2,400 floor, $210 reserve, $0 retained income and -$1,260 margin, with the status “Aún no disponible.” The browser displayed confirmation after saving and restoring the example, with its original cash amount of $1,800. This preview is not a Next.js production build or deployment.

A narrow browser view was also inspected: its landing content stacked vertically and the calculator was readable. The requested 360 px override yielded a reported 400 px inner width in this environment, so exact 360 px behavior remains unverified.

The committed source was copied to a clean temporary directory, dependencies were installed from the local npm cache, and `npm run build` completed successfully on 1 November 2026: Next.js compiled, passed TypeScript and generated the static pages. The resulting production server was opened locally; the example again returned “Aún no disponible” with a -$1,260 margin. No public deployment is implied by this local check.

## Outstanding checks

- Inspect the application at an actual 360 px viewport and validate the public deployment when it is available.
- Run the persona exercise on actual screenshots, log its observations, fix the most important issue and retest. No persona observation, user interview or redesign result is claimed in advance.
- If deployed, record an actual discovered defect, fix, redeploy, deployment URLs and commit hashes. The course requires real evidence of this cycle.
- Real demand, a current-month user, the 10:1 comparison, third-party route terms, Vercel deployment and Supabase persistence remain unverified.
