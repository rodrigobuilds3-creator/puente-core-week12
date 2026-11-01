# PUENTE Week 12 validation log

## Deterministic rule checks

`npm test` ran on 1 November 2026: 10 tests passed, 0 failed. The tests cover minimum and maximum log length, the lowest positive reserve in the presence of a zero-net day, negative and zero-net logs, a positive household floor, daily hours, lost-hours bounds, negative bridge precedence, missing and stale evidence, human-confirmed review status, and the no-double-counting rule for retained income.

`tsc --noEmit --pretty false` passed on 1 November 2026 using the installed TypeScript dependencies. The UI was bundled with esbuild and rendered once to HTML with React server rendering; the headline, form, action and five daily records were present.

On 1 November the React component was also inspected in a local browser preview assembled with esbuild. The desktop landing page rendered; loading the fictional example and calculating showed a $2,400 floor, $210 reserve, $0 retained income and -$1,260 margin, with the status “Aún no disponible.” The browser displayed confirmation after saving and restoring the example, with its original cash amount of $1,800. This preview is not a Next.js production build or deployment.

A narrow browser view was also inspected: its landing content stacked vertically and the calculator was readable. The requested 360 px override yielded a reported 400 px inner width in this environment, so exact 360 px behavior remains unverified.

The committed source was copied to a clean temporary directory, dependencies were installed from the local npm cache, and `npm run build` completed successfully on 1 November 2026: Next.js compiled, passed TypeScript and generated the static pages. The resulting production server was opened locally; the example again returned “Aún no disponible” with a -$1,260 margin. No public deployment is implied by this local check.

## Public deployment and date-boundary defect

On 1 November 2026 Vercel deployed commit `64f2001` to production at https://puente-core-week12.vercel.app/ (deployment `dpl_2SfzKTCsTFbGuenUjGDWGnA4bte5`). A separate browser session opened the public URL and ran the fictional example, which displayed the expected -$1,260 margin and “Aún no disponible.”

An additional regression test exposed a real date-boundary issue in that first version: at 21:00 in Mexico City on 1 November, UTC had already entered 2 November. The original code used UTC to define “today” and incorrectly accepted a source dated 2 November as current. The test failed with `LISTA_PARA_REVISAR` where `PROVISIONAL` was expected. The fix uses the browser's local calendar date; the same test then passed, as did all 11 engine tests. This is a simulated clock/time-zone test, not a user interview. A second deployment and its public verification must be recorded after they occur.

## Outstanding checks

- Inspect the application at an actual 360 px viewport and validate the public deployment when it is available.
- Run the persona exercise on actual screenshots, log its observations, fix the most important issue and retest. No persona observation, user interview or redesign result is claimed in advance.
- Record the actual second deployment, URL and commit hash, then retest the published version.
- Real demand, a current-month user, the 10:1 comparison, third-party route terms, Vercel deployment and Supabase persistence remain unverified.
