# PUENTE Week 12 validation log

## Deterministic rule checks

`npm test` ran on 1 November 2026: 10 tests passed, 0 failed. The tests cover minimum and maximum log length, the lowest positive reserve in the presence of a zero-net day, negative and zero-net logs, a positive household floor, daily hours, lost-hours bounds, negative bridge precedence, missing and stale evidence, human-confirmed review status, and the no-double-counting rule for retained income.

`tsc --noEmit --pretty false` passed on 1 November 2026 using the installed TypeScript dependencies. The UI was bundled with esbuild and rendered once to HTML with React server rendering; the headline, form, action and five daily records were present.

On 1 November the React component was also inspected in a local browser preview assembled with esbuild. The desktop landing page rendered; loading the fictional example and calculating showed a $2,400 floor, $210 reserve, $0 retained income and -$1,260 margin, with the status “Aún no disponible.” The browser displayed confirmation after saving and restoring the example, with its original cash amount of $1,800. This preview is not a Next.js production build or deployment.

A narrow browser view was also inspected: its landing content stacked vertically and the calculator was readable. The requested 360 px override yielded a reported 400 px inner width in this environment, so exact 360 px behavior remains unverified.

The committed source was copied to a clean temporary directory, dependencies were installed from the local npm cache, and `npm run build` completed successfully on 1 November 2026: Next.js compiled, passed TypeScript and generated the static pages. The resulting production server was opened locally; the example again returned “Aún no disponible” with a -$1,260 margin. No public deployment is implied by this local check.

## Public deployment and date-boundary defect

On 1 November 2026 Vercel deployed commit `64f2001` to production at https://puente-core-week12.vercel.app/ (deployment `dpl_2SfzKTCsTFbGuenUjGDWGnA4bte5`). A separate browser session opened the public URL and ran the fictional example, which displayed the expected -$1,260 margin and “Aún no disponible.”

An additional regression test exposed a real date-boundary issue in that first version: at 21:00 in Mexico City on 1 November, UTC had already entered 2 November. The original code used UTC to define “today” and incorrectly accepted a source dated 2 November as current. The test failed with `LISTA_PARA_REVISAR` where `PROVISIONAL` was expected. The fix uses the browser's local calendar date; the same test then passed, as did all 11 engine tests. This is a simulated clock/time-zone test, not a user interview. The second production deployment, commit `b227fc3` (Vercel deployment `Gd1e5hqSpb4LMv3gn5w5gseYy5dL`), reached Ready and the fictional calculation was repeated on the public URL.

## Supabase demonstration integration

On 1 November a dedicated project quoted at $0 per month was created with the account owner's authorization. A table with RLS stores one fictional example; `anon` has SELECT but not INSERT, UPDATE or DELETE. Supabase security advisors reported no findings. Commit `d7d3cdc` added the read-only endpoint and a local fallback; all 13 tests passed and the production build succeeded. Deployment `DHUsQf7JbBhdWqGE49Kh3kgtsXLt` reached Ready. In a separate browser, the public application reported that it loaded the fictional example from the database and calculated the expected -$1,260 margin. Visitor inputs and results are not stored in Supabase.

## Outstanding checks

- Obtain instructor confirmation that the live Vercel hostname satisfies the venture-domain requirement, or connect a venture-owned domain.
- The synthetic-persona exercise and retest are complete; see `PERSONA_TEST_PLAN.md`. Do not treat that role-play as a real-user interview.
- Real demand, a current-month user, the 10:1 comparison and third-party route terms remain unverified. Server-side persistence of visitor inputs is not implemented.

## Fresh delivery check — 1 November 2026

- `npm test` in the repository checkout passed all 13 tests (0 failures).
- A direct `npm run build` from this checkout failed while Webpack tried to read a dependency through `node_modules`, which is a symlink into the Week 4 project. The source itself was then archived at `HEAD` into an isolated temporary directory, dependencies were installed with `npm ci --offline`, and `npm run build` completed successfully there. This distinguishes the checkout's dependency-link problem from the clean production build.
- The public URL was opened in a separate browser session. PUENTE's landing page and calculator loaded, and the fictional-data notice was visible. No personal financial data was entered.
- The final demo file is 3:39 in 1920 × 1080 and contains a separate audio track. The voice is synthetic and the demonstration figures remain fictional.
- The free Vercel hostname is live. A venture-owned custom domain has not been connected; verify whether the instructor accepts the Vercel hostname before treating the domain condition as complete.
