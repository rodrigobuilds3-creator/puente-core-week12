# Week 13 verification log

Date: November 4, 2026. Branch: codex/puente-week13. These are assistant technical checks; the five initial human sessions are documented separately in Rodrigo's research report.

## Baseline and specification

Baseline: 8ae3199. Packet committed before application changes: efdf819. The three priorities are false approval from a positive margin, misreading retained income of zero, and loading/restoring confusion. The economic 10:1 model remains conditional.

## Automated verification

- Node test runner: 19 tests passed, zero failed. Includes 13 existing engine/demo tests and six new regressions.
- Blank required numerical fields remain empty in the UI and produce incomplete input rather than a valid zero-valued result.
- The original demonstration retains net MXN 1,160, reserve MXN 210, margin -MXN 1,260; setting cash to MXN 3,300 retains provisional state and margin MXN 240.
- Optional feedback requires opt-in; event/reason allowlists reject arbitrary content; maximum 200 events; relative time is bounded; financial values and free text are excluded.
- Production build: Next.js 16.2.6 webpack compiled, TypeScript completed and static page generation succeeded. Build used a temporary source copy and a fresh npm-ci installation from the unchanged package-lock because the original node_modules checks stalled. No project secrets were copied.

## Browser checks on local production build

URL: http://127.0.0.1:3013 . These are local checks, not a public deployment.

1. Load the fictional fallback example and calculate: -MXN 1,260 and a cash-shortfall state.
2. Change cash to 3,300 and calculate: provisional result, MXN 240, heading “La oportunidad sigue sin confirmar”, and explicit warning that PUENTE has not checked the opportunity or payment.
3. Save 3,300, edit to 3,400, restore: 3,300 restored. The first immediate read in the automation sequence was premature; a settled UI observation confirmed restoration. Do not treat the premature read as a participant result.
4. Clear cash and calculate: incomplete-input heading, no cash amount interpreted from an empty control.
5. Request clearing and cancel: existing saved record remains restorable.
6. At 386 × 844, the provisional state is visible before the numerical result; saved screenshot is in the Week 13 evidence folder. Mobile daily fields use two columns and 44 px controls.
7. Enable optional feedback, record a calculation and a fixed reason, and download. The browser's download-event wait timed out, but the resulting file was located and inspected locally: schema puente.feedback.v1, ten technical events, only event/elapsedMs/reason fields. The file is saved as W13_TECHNICAL_FEEDBACK_LOG.json, not a participant log.

## Limits and next check

Publication was stopped by automatic approval review for the external Git push. No Week 13 preview or production deployment is claimed. Repeat affected tasks with real participants after deployment; technical text/layout checks do not establish a human comprehension gain. Three initial participants expressed verbal intent; no subsequent return artifact was supplied.

Next move: obtain explicit authorization to push this branch to the existing GitHub repository, verify the preview deployment, repeat T3/T4 and capture an actual return signal. The course's real-domain requirement, two deployments, recordings and final build transcript still need completion.
