# Week 14 verification - 13 November 2026

## Source and baseline

Branch `codex/puente-week14`; starting source commit `683ab47`. Existing 19 tests passed before application implementation. Packet, generated mockup and prompt committed at `9bafbce` before engine/UI changes. `docs/PACKET.md` is now a canonical index; it was updated after code, while the complete pre-code packet remains at its original path and commit. No chronology was rewritten.

## Automated and build checks

28 tests pass: all 19 existing checks plus 9 sponsorship tests. New checks cover manual quote/margin arithmetic; multi-month expenses; separation of expected agreements, reported signed commitments and cash; capacity shortages; an offer below cost; invalid inputs; zero cost denominator; two editable independent scenarios; malformed or excessive saved content. `git diff --check` passed.

The shared historical node_modules symlink was extremely slow at loading Next.js; that build was interrupted before a result. An isolated `/private/tmp/puente-w14-verified` copy installed the exact package-lock dependencies using `npm ci --offline --ignore-scripts --no-audit --no-fund` (47 packages). Production build and TypeScript passed there after fixes. Source/application/tests/manifests were compared byte-for-byte with the workspace; no differences. Temporary Next-generated configuration/build files are not claimed as source changes.

Routes compiled: `/`, `/pricing`, `/about`, `/api/ejemplo`. No new remote database, authentication configuration or payment integration. Server bound only to `127.0.0.1:3414` for review. This is a local compiled preview, not Vercel production or an external deployment.

## Actual defects found and corrected

1. Initial production type-check failed with TS7053: the calculated result error union could not be indexed by SponsorField in the pricing form. Added an explicit typed partial error map. Production compilation and TypeScript then passed.
2. Browser test: open scenario A, change participants to 21 without saving, then open B. The old UI silently changed the field to 30 and discarded the edit. Added a visible confirmation before opening another scenario or loading a plan while dirty. After rebuild/server restart/reload: requesting B retained 21 and showed the warning; choosing Conservar mis cambios retained 21; choosing Descartar cambios y continuar explicitly opened B with 30. Screenshot `W14_UNSAVED_CHANGES_FIX.jpg` in the W14 evidence folder. This is an observed defect, not an invented test narrative. External redeploy remains pending.

## Browser acceptance actually performed

- Created fictional A at 20 participants: MXN 2,800 derived contract quote. Created B at 30: MXN 3,175. Both remained after reload. Reopened A, changed monthly support from 2 to 3 hours, updated and opened its exact memo: price MXN 2,950, full resources MXN 3,100, ratio 1.61:1. Values were recomputed from A's saved inputs, not B's.
- Cleared required participant input: validation warning visible and quote-total absent (count 0). Restored the input; valid totals returned.
- Set conversion to 100% and capacity to 5: warning showed 195 missing forecast places and zero signed-cohort shortage. Forecast did not become signed support or cash.
- Followed free-worker link, loaded fictional data and calculated: -MXN 1,260, missing-cash explanation and unconfirmed-opportunity boundary remained intact. Existing automated tests also protect the +MXN 240 scenario.
- At viewport 390x844, page document width 375 and viewport width 390: no horizontal overflow. Inspected hero and field screenshots. Reset viewport after the test.
- Saved desktop, mobile, exact memo and post-fix screenshots in `entregas/semana_14_pricing/03_business_bending/evidence/` in the outer workspace.

Not directly browser-fault-injected: storage quota or browser storage denial. Error handlers preserve edits and offer download on failure; corrupt storage and field allowlists are covered by unit tests. Do not report a browser quota-failure experiment that was not executed.

## Evidence and security boundaries

Only fictional, bounded scenario fields and a short fictional name are stored locally. Unknown scenario fields are rejected; no participant records are added. No new form transmits data to an external endpoint, no checkout, no sponsor identity collection, no secret/configuration changes. This is a scoped review of changes, not certification of the old app's entire history or live services.

The PDF packet is a later export of the committed preimplementation source; it is not dated as if the PDF itself preceded the code. Generated mockup text/numbers are illustrative; actual calculator defaults and output are authoritative for the implemented scenario. The supplied three-page Blueprint remains preserved; the one-page companion is an editorial condensation retaining its proposed/no-live-vote status.

## Outstanding evidence, not replaced by these checks

Rodrigo confirmed no potential sponsor contact is currently available. Real budget-holder conversation, measured equivalent-task economics and sponsor acceptance are absent. No signed agreement, collected funds, actual program, employment outcome or 10:1 proof is claimed. Fresh independent screenshot-based PERSONA, full actual chat exports, DEMO/FUSION/REFLECT videos, domain verification and two external deployments remain pending. This local technical review is not the independent PERSONA test or a completed course submission.
