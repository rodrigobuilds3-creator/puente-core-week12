# PUENTE

A Spanish-language decision aid for exploring a 14-day transition from informal income to a possible work or training route. Week 12 rebuild of the Week 4 venture, based on Rodrigo's Method step 5: turn cash constraints and dated route evidence into an understandable state, one next action, and a fallback.

## Current state

This is a synthetic-data prototype. Luis, the route terms and the interview scenarios are fictional; they are not a real interview, employment offer or 10:1 validation. The interface explicitly asks for fictional data. No employer, vacancy, capacity, payoff or financial outcome is verified by the app.

The calculation accepts five to seven daily records, protects a 14-day household floor and the lowest positive-day reserve, estimates retained informal income, and subtracts transition costs. It keeps cash viability separate from route evidence. Future formal wages do not pay the bridge, and lost income is not deducted twice. People review and decide.

Results can be saved **only on the current browser** or downloaded as JSON. A read-only Supabase table supplies a curated fictional example; no visitor entries or calculation results are sent to the database. If the example service is unavailable, the app loads a local fallback and says so. The prototype has no account or server-side persistence of visitor inputs and is not intended for real personal or financial data. A real deployment handling personal data would require explicit consent, authentication, user-owned row isolation, deletion controls and a completed security review.

## Run locally

Node.js 22.13 or newer is required. Install the pinned dependencies with `npm ci`, then run `npm run dev`. `npm test` runs the deterministic rules tests. `npm run build` creates a Next.js production build. To read the fictional example from Supabase, configure server environment variables `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`; otherwise the local fallback works. Never use a service-role or secret key for this integration.

## Product and evidence

- [Product charter](docs/CHARTER.md)
- [Product packet and Mermaid flows](docs/PACKET.md)
- [Synthetic personas](docs/PERSONAS.md)
- [Actual validation log](docs/TEST_LOG.md)
- [Demo guide](docs/DEMO_GUIDE.md)

The application is published at https://puente-core-week12.vercel.app/. Whether a free Vercel subdomain satisfies the course's domain requirement must be checked separately. The synthetic example is not a substitute for real-user or 10:1 validation.
