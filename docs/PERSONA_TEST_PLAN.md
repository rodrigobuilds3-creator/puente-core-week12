# Synthetic persona test

**Status: completed 1 November 2026.** The full role-play and screenshots are in `PERSONA_Rodrigo_Pena.pdf` and `PERSONA_SIMULADA_CONVERSACION.md`. This was a fresh-chat AI role-play with fictional Luis, as required by the course. It is a design review, not a real interview or evidence of adoption.

## Procedure and scope

The persona received four actual mobile screenshots in order: landing page, start of the calculator, fictional example loaded, and result before the copy fix. For each screen, the persona described its interpretation, likely next action and uncertainty. The exercise tested what was visible in those screenshots; it did not claim to exercise hidden controls or represent every screen in the full flow.

## Observations and fixes

| Screen | Observation from the synthetic role-play | Severity | Change | Retest |
|---|---|---|---|---|
| Landing | “Cuida tu piso” is metaphorical; the two start links may appear to be different paths. | Low | No change recorded. | Not retested. |
| Calculator start | “Días de ventas” may not include another kind of irregular income; the prompt does not explain what records to prepare. | Medium | No change recorded. | Not retested. |
| Example loaded | The changed cash value is visible, but the confirmation was far from the button and did not show all loaded assumptions. | Medium | Confirmation moved beside “Cargar ejemplo.” | Public flow reopened after deployment; confirmation visible beside the control. |
| Result | “Aún no disponible” could describe the job rather than the financial result; the shortfall was not visible in the screenshot. | High | Status changed to “No alcanza por ahora” and the MXN 1,260 shortfall became explicit. | Public flow reopened after deployment; status and amount visible. |

## Retest record and limits

The corrected flow was checked on the published app with the fictional example. Its result remained a -MXN 1,260 margin, the new status explained the cash constraint, and the example confirmation appeared beside its control. The 13 automated tests passed. The assistant performed this retest; it was not a second independent participant test. One synthetic persona and four screenshots do not establish demand, accessibility for all users, employment outcomes or a 10:1 advantage.
