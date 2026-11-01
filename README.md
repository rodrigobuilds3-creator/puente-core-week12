# PUENTE

A Spanish-language decision aid for exploring a 14-day transition from informal income to a possible work or training route. Week 12 rebuild of the Week 4 venture, based on Rodrigo's Method step 5: turn cash constraints and dated route evidence into an understandable state, one next action, and a fallback.

## Current state

This is a synthetic-data prototype. Luis, the route terms and the interview scenarios are fictional; they are not a real interview, employment offer or 10:1 validation. The interface explicitly asks for fictional data. No employer, vacancy, capacity, payoff or financial outcome is verified by the app.

The calculation accepts five to seven daily records, protects a 14-day household floor and the lowest positive-day reserve, estimates retained informal income, and subtracts transition costs. It keeps cash viability separate from route evidence. Future formal wages do not pay the bridge, and lost income is not deducted twice. People review and decide.

Results can be saved **only on the current browser** or downloaded as JSON. The present implementation has no account, remote persistence or Supabase connection, and is not intended for real personal or financial data. A real deployment handling personal data would require explicit consent, authentication, user-owned row isolation, deletion controls and a completed security review.

## Run locally

Node.js 22.13 or newer is required. Install the pinned dependencies with `npm ci`, then run `npm run dev`. `npm test` runs the deterministic rules tests. `npm run build` creates a Next.js production build. Screenshots and deploys should be documented only after they happen.

## Product and evidence

- [Product charter](docs/CHARTER.md)
- [Product packet and Mermaid flows](docs/PACKET.md)
- [Synthetic personas](docs/PERSONAS.md)
- [Actual validation log](docs/TEST_LOG.md)
- [Demo guide](docs/DEMO_GUIDE.md)

The Week 12 assignment also asks for GitHub, Vercel, Supabase and a working venture domain. Their configuration and any deployment must be checked separately; a local codebase is not proof of those requirements.
