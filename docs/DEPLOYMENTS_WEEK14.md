# Week 14 publication record

13 November 2026, America/Mexico_City. Rodrigo explicitly authorized pushing the reviewed branch to GitHub and publishing to the existing Vercel project. No Brightspace submission is included in that authorization or this record.

## Source

- Repository: https://github.com/rodrigobuilds3-creator/puente-core-week12
- Branch: https://github.com/rodrigobuilds3-creator/puente-core-week12/tree/codex/puente-week14
- Application commit: `4c6c1406f375558f72436c58c538f5b46f157602`.
- W14 implementation sequence: `9bafbce` pre-code packet/mockup; `0e80e1c` economics; `fe79191` pricing/scenarios; `0ffb18c` memo/navigation; `4c6c140` observed defect fix and verification.
- Git push succeeded and origin/codex/puente-week14 tracks the branch. The default branch was not merged or changed.

## Preview

- ID: `F7rYDhN5N2ykPwVtYVHaVUnJ8YsG`.
- Dashboard: https://vercel.com/rodrigo-builds3/puente-core-week12/F7rYDhN5N2ykPwVtYVHaVUnJ8YsG
- URL: https://puente-core-week12-ohl85h1uo-rodrigo-builds3.vercel.app/
- Vercel showed Ready, source branch codex/puente-week14 and application commit 4c6c140. `/pricing` opened and showed the three offers, default derived quote MXN 2,800, zero signed agreements, zero cash and hypothetical ratio 1.68:1.

## Production

- ID: `67oGkVrh6WXvYyDtB3jPv7QjKSje`.
- Dashboard: https://vercel.com/rodrigo-builds3/puente-core-week12/67oGkVrh6WXvYyDtB3jPv7QjKSje
- Deployment URL: https://puente-core-week12-1fo4be7a0-rodrigo-builds3.vercel.app/
- Intended existing alias: https://puente-core-week12.vercel.app/
- Promoted the verified preview through the signed-in Vercel UI. Vercel creates a separate production-environment build rather than claiming that the preview itself is production. Final status and alias verification are recorded below after inspection.

## Final production verification

Vercel showed **Ready**, environment **Production**, application source commit `4c6c140`, and the assigned alias `puente-core-week12.vercel.app`. Dashboard timestamp: 13 November 2026, 20:31:03, GMT-6; build approximately 24 seconds. Preview and production are two distinct completed external deployments.

Direct checks performed on https://puente-core-week12.vercel.app/ :

- `/pricing` displayed the free worker offer and cost-derived sponsored pilot/program examples. Initial hypothetical quote: MXN 2,800; zero signed agreements and zero cash; default resource-cost ratio 1.68:1, explicitly not demonstrated 10:1.
- Saved fictional public A at 20 participants, then public B at 30 participants. B showed MXN 3,175. After reload, B was available; reopening A and following its exact memo yielded full resource cost MXN 2,980 and ratio 1.68:1. Storage is local to that browser/device/domain, not remote or cross-device.
- Opened `/pricing` and `/about` in a separate in-app browser with no Vercel owner login flow. Both loaded and the memo ratio was visible. The external web fetch tool could not retrieve the URLs; that fetch failure is not used as evidence of accessibility. The separate browser check is the evidence.
- Worker calculator: after the example-loading state completed, fictional cash MXN 1,800 produced -MXN 1,260; changing cash to MXN 3,300 produced +MXN 240 and the unconfirmed-opportunity heading. An early automated click before interactive/example load completion did not populate valid data; the final checks waited for the loading state to end. Existing saved worker records were not deleted or overwritten.
- Evidence in `evidence/`: `W14_VERCEL_PRODUCTION_READY.jpg`, `W14_PRODUCTION_PRICING.jpg`, `W14_PRODUCTION_MEMO.jpg`, `W14_PRODUCTION_WORKER_PROVISIONAL.jpg`.

No application change was made after the reviewed commit during publication, so no unrelated test suites or rebuilds were repeated. The deployment record is a later documentation update; the production application commit remains the explicitly identified release above.

## Submission links

- Product/pricing: https://puente-core-week12.vercel.app/pricing
- One-page memo route: https://puente-core-week12.vercel.app/about
- Worker calculation: https://puente-core-week12.vercel.app/#calculadora
- Exact application source: https://github.com/rodrigobuilds3-creator/puente-core-week12/tree/4c6c1406f375558f72436c58c538f5b46f157602
- Current W14 branch: https://github.com/rodrigobuilds3-creator/puente-core-week12/tree/codex/puente-week14

Remaining: actual budget-holder conversation (Rodrigo has no contact yet), measured economics, independent fresh visual PERSONA, full actual conversation exports, videos and course-domain requirement clarification. None is replaced by successful publication. No files were submitted to Brightspace.

## Boundaries

The CLI lacked a login; publication used the existing signed-in browser session and normal Vercel identity verification. No credentials, tokens or one-time codes are included here. No authentication, environment variables, sharing, RLS or deployment protections were changed. No new service or paid plan was purchased. The project and domain are the existing ones; a separately registered custom domain remains unconfirmed against the course rubric.
