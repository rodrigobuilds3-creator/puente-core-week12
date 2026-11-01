# PUENTE Product Charter

**Owner:** Rodrigo Peña de León Pérez · **Week:** 12 · **Source venture:** PUENTE, Week 4  
**Status:** Design for a synthetic prototype; user demand, route availability, the real-user gate and 10:1 advantage remain unverified.

## Mission

Give a person earning informal income a clear way to examine whether a work or training transition can be pursued without putting their short-term household cash at risk. PUENTE is a decision aid: the person keeps the decision, and the calculation exposes missing terms, a next action and an existing fallback.

## Problem and the person

An attractive monthly salary can conceal a first-pay delay, onboarding expenses and the loss of informal earning hours. A worker needs to see the protected household amount during that gap, not merely the salary after it. The candidate initial user is a person with irregular daily earnings and little room to absorb a missed payment, using a phone in Spanish.

This is a product hypothesis based on prior course work. **Luis is an invented persona; the October interviews and economic calculations in the synthetic annex are simulations.** They are suitable for exercising the interface and are not evidence of real demand, an actual offer or a 10:1 improvement.

## The Method becomes the product

> Step 5 of my Method becomes PUENTE's function that turns a worker's cash constraints and dated work-route evidence into an explainable route status, one safe next action, and a fallback while leaving the choice with the worker.

The product turns entered constraints into a deterministic calculation, readable state, action and editable record. Sources and dates travel with the route. A person can review or correct entries and reject every route; no score or recommendation decides for them.

## Week 12 objective and scope

Deliver a phone-friendly core flow in Spanish: enter a synthetic cash log and protected expenses, enter a single illustrative route, inspect the calculation and state, and save or export a clearly labeled result. The method is successful as a **software exercise** when a person can reproduce the calculation, understand the blocking reason, find the next action and return to the fallback. A working UI does not prove employment outcomes or that this is the right venture.

### Inputs and outputs

| Inputs | Output |
|---|---|
| Available cash; 5–7 daily selling records containing sales, stock, transport, other costs and hours; weekly household minimum | Daily net, weekly net and hours, 7/14-day household floor and a conservative reserve |
| Retained informal hours, transition costs and first-pay timing | Cash projected during the bridge, the protected total, gap or margin, and an explanation |
| Route description, owner, requirements, source and evidence date | Status and reason, one next action and an editable saved summary; unknown or outdated information remains visible |

## Safety and evidence rules

1. Daily net = sales minus stock, transport and other day costs. Fewer than five complete valid days or missing required inputs cannot produce a complete route result.
2. Protect a household floor of `weekly minimum × 2` over 14 days plus the lowest **positive** daily net as reserve. If a positive reserve cannot be calculated, explain what is missing and do not claim a complete safety assessment.
3. The bridge calculation starts with available cash and adds only conservative informal income the person can still earn during the period, then subtracts transition costs and the protected total. Estimate retained informal income from the recorded net hourly rate and retained hours. Lost informal income is already reflected by reduced retained hours: show it as opportunity cost, but do not subtract it again.
4. Treat formal income that is unconfirmed or arrives after the protected period as zero during the bridge. Do not add a monthly salary as if it were cash already in hand.
5. A negative bridge margin is **NO DISPONIBLE** regardless of a route's apparent attractiveness. Missing, undated or expired route evidence is **PROVISIONAL**, unless an independent cash-floor breach already blocks it. A financially feasible route with complete current, explicitly confirmed terms can be shown as **LISTA PARA REVISAR**, not automatically guaranteed or institution-verified.
6. Show source and date, missing evidence, calculation assumptions and the human owner. A model or UI cannot assert that an employer, program or payment has been verified merely because a field was filled. Any confirmation must be traceable to the named human source.
7. The next action is specific and low-cost; where terms are missing or cash is insufficient, preserve the person's current income fallback. The person may change inputs, reject a route, download a record or clear it.

## Non-goals

No job marketplace, verified vacancy feed, employment placement, wage prediction, AI score, automated eligibility decision, bank/IMSS lookup, messaging employer, route ranking or autonomous institutional handoff. No claim that the system guarantees a safe transition, that its routes exist, or that any student scenario is a real user interview.

## Data and trust

Use invented records in the initial demonstration. Do not ask for identity numbers, addresses, bank credentials or documents. Personal data must not be persisted in an open shared database: before any real-user persistence, implement authentication, row-level access policies, access controls, informed consent, deletion and input validation. If the initial version saves only within the browser or exports locally, say so; do not claim durable server storage. If server storage is used, document the actual implementation and restrictions.

An optional language-model explanation is a later, separately labeled layer: deterministic rules own every number and status, and the model cannot verify evidence, change values, rank people, choose a route or contact anyone. No provider key belongs in client code or a repository.

## Measurement and decision gates

For a future real pilot, compare the full equivalent task with the person's current workaround, including data entry and accuracy; record outcome, time, complete costs and the date. The course's 10:1 gate is a benchmark against the real person's alternative, not established by the fabricated scenario. Before a real rollout, establish a real current-month need, confirm a named operating owner, investigate route accuracy and consent, and obtain team confirmation of the chapter allocation. The simulated technical build must remain clearly identified as such.

## Long view

If the bounded transition tool succeeds, PUENTE could support maintained pathways and opt-in handoffs among community organizations, training providers and employers. A worker would own a correctable account of constraints and route decisions, and institutional claims would carry an accountable source. Expansion would depend on documented user outcomes, safe data practices and actual partner capacity rather than the number of generated route cards.
