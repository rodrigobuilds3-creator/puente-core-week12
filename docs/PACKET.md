# PUENTE Week 16 hardening packet

26 November 2026 · Rodrigo Peña de León Pérez · Operator, Team 3

## Problem and exact user

A person working by the day in Mexico City is considering a job whose first-pay date is uncertain. They use a phone to decide whether they can cover essentials during the transition and which paid hours to keep. A modeled surplus can look like a decision even when payroll is unconfirmed. Week 15 fieldwork reported a 14-day window misread as a pay date and an expectation that PUENTE would decide whether the job is worth accepting. The November 22 wording has yet to be tested with people.

## Success and scope

Make the result status and the immediate action visible together after calculation, before the financial breakdown. Keyboard activation of the existing Calculate button should place focus on the resulting heading. Blank or invalid inputs should keep the result incomplete and suppress saving or downloading. Preserve the existing synthetic cases, evidence rules, 14-day horizon and sponsor independence. Use the current calculator, campaign and deployment history. Scope excludes new product features, payroll verification, account creation, real personal data and claims of measured impact. The five-part defense on /about is course material attached to the current memo.

## Existing architecture and stack

Vercel serves a Next.js and React app. A pure TypeScript engine validates the five-to-seven-day example and produces the status, margin and next action. The calculation runs client-side. The optional read-only Supabase route supplies one invented fixture, with an in-app fixture fallback. Saved examples and opt-in feedback use browser-local or in-memory state. Week 15 materials export guarded fictional method outputs and use a founder editorial review before outreach. Keep the current storage keys, RLS, input limits and public-demo boundary.

~~~mermaid
flowchart LR
  W[Worker on phone] --> U[Existing fictional calculator]
  U --> E[TypeScript cash and evidence rules]
  E --> R[Status and immediate next step]
  R --> M[Worker reviews margin details]
  R --> C[Worker asks employer to confirm first pay]
  C --> W
  O[Operator] --> P[Week 15 creative draft]
  P --> Q{Evidence and editorial check}
  E --> Q
  Q -->|Unsupported| X[Hold draft and correct]
  Q -->|Supported and reviewed| Y[Candidate for publication]
~~~

## Mockup, benchmark and direction

Reuse the [image-generated Week 12 mockup](assets/puente-week12-mockup.png) as the visual reference. The Week 16 change orders the existing result as status, immediate action and then numbers. The [CFPB cash-flow worksheet](https://files.consumerfinance.gov/f/documents/cfpb_creating-cash-flow-budget_tool_2021-08.pdf) carries weekly balances forward. Localize its timing discipline to a Spanish phone task in pesos, with an employer-confirmation step and room for irregular informal income. Over three years, build toward opt-in handoffs through accountable community partners only if comprehension, operational capacity and measured value support them. See [Charter](CHARTER.md), [Week 14 economics](PACKET_WEEK14.md) and [Week 15 distribution](PACKET_WEEK15.md).

## Tests and response

| Check | Expected | Baseline on the published Week 15 release |
| --- | --- | --- |
| Core task on phone | Fixture A returns −MXN 1,260. Changing only cash to MXN 3,300 returns +MXN 240 with missing evidence still provisional. | Both passed at 390 × 844 px. |
| Safe failure in PUENTE | Blanking cash after loading the fictional fixture produces an incomplete result, no margin and no save/download buttons. | Passed at 390 × 844 px with the amount cleared and Enter used. |
| Accessibility and realistic constraint | After Calculate, show the next action before the breakdown and make the result discoverable to the keyboard. No horizontal overflow. | Failed the action and focus checks: provisional next action began at y=1,367 in an 844 px viewport. Focus stayed on Calculate. Width 381 px within the viewport. |
| Week 15 creative safe failure | An invented promise of a verified first payday must be held before release. Run on a private copy with the existing numerical builder and editorial review. Correct the checking step if it misses the claim and rerun the same input. | Planned. Store expected and actual results in the existing test log. |

Use the same inputs and viewport for before/after. Preserve a real fresh-chat synthetic persona walkthrough and label it as simulation. Later invite three suitable workers to try the revised flow without coaching. Record the first answer before prompting about payroll or a paid shift. Automated and browser checks address behavior of the product. The human comprehension claim remains open.

## Shadow and release

At scale, a person might give up income based on a conditional projection. Put the reversible action beside the uncertainty and before the margin breakdown. Leave the decision with the worker and keep sponsor access independent of any result or warning. Keep the demo on fictional inputs and preserve the security floor. Keep the existing commit and deployment history. Verify any candidate locally and use an evaluator-accessible deployment through the existing project when authorized.
