# PUENTE decisions

- Week 12 uses PUENTE from Week 4, selected by Rodrigo.
- The core follows Method step 5 and contains a single deterministic cash-bridge loop. It does not rank users, choose opportunities or verify an institution.
- The reserve is the smallest **positive** net day; zero is excluded. A negative day, fewer than five valid days or no positive day blocks a complete assessment.
- A negative margin takes priority over route evidence. Missing, stale or unconfirmed evidence remains provisional; a user-entered source is never represented as independently verified.
- Only fictional demonstration data is permitted. A read-only Supabase table supplies a public fictional sample; results and visitor inputs stay in the browser unless exported locally. No Google authentication or server persistence of visitor inputs is implemented.
- The design uses a cobalt/white/yellow startup direction and an original generated illustration, following Rodrigo's visual references without reproducing the watermarked stock imagery.
- The code has been built and published through GitHub and Vercel. The deployed read-only example has been checked; confirm whether the Vercel subdomain meets the course's domain requirement. Real-user evidence, a defensible 10:1 comparison and third-party route terms remain separate gates.

## Session close — 1 November 2026

- The initial Packet was committed as `c6f6808` before the cash-bridge and interface commits `f9974a1` and `4087e62`; the build branch had 15 commits before this documentation-only close record.
- The live application was reopened and the public landing page and fictional-data notice were visible. All 13 automated tests passed. A clean temporary build passed after the linked Week 4 `node_modules` path caused a timeout in the original checkout.
- The synthetic persona test is documented separately with ordered product screenshots, confusion points, the copy/result fix and a retest. It is a required design exercise, not real-user research.
- Prototype-level shadow clause: fictional examples are labeled; missing or unverified route evidence is not presented as verified; the person may correct the inputs and keeps the fallback and decision. The Blueprint's real-workaround, named-owner, payer/acceptor/capacity and team-confirmation conditions remain open until evidenced.
- Tomorrow's first move: confirm that the instructor accepts `puente-core-week12.vercel.app` as the venture's real URL, or connect a venture-owned domain before submission.
