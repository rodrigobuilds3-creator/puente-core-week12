# PUENTE decisions

- Week 12 uses PUENTE from Week 4, selected by Rodrigo.
- The core follows Method step 5 and contains a single deterministic cash-bridge loop. It does not rank users, choose opportunities or verify an institution.
- The reserve is the smallest **positive** net day; zero is excluded. A negative day, fewer than five valid days or no positive day blocks a complete assessment.
- A negative margin takes priority over route evidence. Missing, stale or unconfirmed evidence remains provisional; a user-entered source is never represented as independently verified.
- Only fictional demonstration data is permitted. Results stay in the browser unless exported locally; Supabase, Google authentication and server persistence are not yet implemented.
- The design uses a cobalt/white/yellow startup direction and an original generated illustration, following Rodrigo's visual references without reproducing the watermarked stock imagery.
- Next move: complete production build, resolve preview authorization, verify the app visually, and establish the required source hosting, deployment and domain. A real-user interview and defensible 10:1 comparison remain separate evidence requirements.
