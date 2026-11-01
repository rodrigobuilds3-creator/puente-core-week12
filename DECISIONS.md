# PUENTE decisions

- Week 12 uses PUENTE from Week 4, selected by Rodrigo.
- The core follows Method step 5 and contains a single deterministic cash-bridge loop. It does not rank users, choose opportunities or verify an institution.
- The reserve is the smallest **positive** net day; zero is excluded. A negative day, fewer than five valid days or no positive day blocks a complete assessment.
- A negative margin takes priority over route evidence. Missing, stale or unconfirmed evidence remains provisional; a user-entered source is never represented as independently verified.
- Only fictional demonstration data is permitted. A read-only Supabase table supplies a public fictional sample; results and visitor inputs stay in the browser unless exported locally. No Google authentication or server persistence of visitor inputs is implemented.
- The design uses a cobalt/white/yellow startup direction and an original generated illustration, following Rodrigo's visual references without reproducing the watermarked stock imagery.
- The code has been built and published through GitHub and Vercel. Verify the Supabase connection in the deployed application and confirm whether the Vercel subdomain meets the course's domain requirement. A real-user interview and defensible 10:1 comparison remain separate evidence requirements.
