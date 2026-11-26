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

## Week 16 hardening checks

26 November 2026 · Start from Week 15, commit 51aa7c3. Browser: Chrome. Data: invented fixtures only. Device constraint: emulated 390 × 844 CSS-pixel viewport, not a physical phone.

| Check | Expected | Published baseline observed |
| --- | --- | --- |
| Core task | Sample A returns a shortfall of MXN 1,260. Changing only cash to MXN 3,300 returns a margin of MXN 240 and leaves the result provisional. | Passed both cases. |
| Safe failure | Clear cash and calculate. Result stays incomplete with no visible margin, save or download. | Passed. Save and download controls were absent. |
| Mobile and keyboard | The immediate step is visible without another scroll after Calculate and keyboard focus reaches the result. No horizontal overflow. | Failed for the step and focus. In the positive case the result heading began at y=605, the margin at y=920 and the next-step box at y=1,367. Focus stayed on the button. Document scroll width 381 px. |

### Week 15 creative process safe failure

- Expected: withhold any draft claiming the sample confirms the first payday. The synthetic engine fixture has no first-pay-date input and the positive result is provisional.
- Baseline numerical and rendering steps: injected one unsupported assertion into slide C1.3 in a private copy, ran the original numerical builder and generated the assets privately. All eight numerical checks passed. The assertion reached both the PDF and readable carousel. The figures gate does not verify authored language. No test asset was published.
- Editorial process response: use the following stop rule before rendering release assets or handing off a candidate for publication. Read the proposed claim as a standalone assertion, identify its evidence in the method output, and check whether a reader could interpret it as a confirmed date, verification, guaranteed outcome, funding or measured savings. Hold any claim without backing and record the correction. Treat direct verification of a payday as unsupported whenever the method has no first-pay-date input.
- Same-input retest at the editorial gate: first-pay assertion held because firstPayDateInputSupported is false and the synthetic status is PROVISIONAL. Supported replacement: “La cuenta cubre 14 días. Confirma con la empresa cuándo recibirías el primer pago.” Accepted for this claim check as a time horizon plus an independent action. This was an offline, operator-run editorial check. It does not test publication automation.

### Candidate verification

- Existing automated suite: 28 passed. Includes missing and stale evidence, blank input, shortfall precedence, opt-in event validation and browser-local scenario invariants.
- Retested in a fresh Chrome tab at 390 × 844 CSS px. A local React bundle ran the exact candidate Home component, its handwritten styles and the app's built-in fictional fallback. This component check did not exercise the Next.js server, Tailwind processing, the Supabase route or an external release.

| Candidate check | Observed | Result |
| --- | --- | --- |
| Core task | Sample A returned −MXN 1,260. Changing only cash to MXN 3,300 returned +MXN 240 and “La oportunidad sigue sin confirmar.” | Pass |
| Safe failure | Clearing cash and pressing Enter showed the incomplete heading. There was no margin and no save or download control. | Pass |
| Mobile and keyboard | Pressing Enter focused the result heading. The full provisional action box appeared at y=666–781, before the margin (y=1,013). The shortfall action was also visible at y=691–805. No horizontal overflow (381 px). | Pass |

- The full Next.js build and deployment have not been verified. The Chrome result is technical evidence for the component at the tested breakpoint. It does not establish screen-reader behavior or worker comprehension.
- Fresh-browser visual persona and uncoached worker retest are pending. Prior results do not demonstrate how workers will interpret the revised flow.
