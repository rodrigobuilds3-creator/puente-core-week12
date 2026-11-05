# Week 13 independent visual persona correction

Date: 2026-11-05. Pre-implementation addendum to PACKET_WEEK13.md.

An actual fresh Codex chat (01a1acac-4b57-75b1-975d-b471370eb22c) viewed ten screenshots in order and recorded immediate reactions as fictional Mariela, 52. This is an AI persona exercise, not human research or return evidence. Its original observation log is preserved in the Week 13 delivery folder.

Priority: the persona cannot confidently explain whether the margin covers 14 days and whether floor, reserve and transition costs have already been deducted. The existing numerical engine is correct; the visible explanation is insufficient.

Scope before code: add a plain-language explanation immediately beside the margin, show the actual substituted equation, identify the reserve as one deduction for this 14-day estimate (not a daily charge), and explain retained income as net per registered hour multiplied by weekly retained hours and two weeks. Keep all numerical rules, statuses, verification warnings, storage and privacy boundaries unchanged.

Acceptance: existing 19 tests and production build pass; example cash 1800 remains -1260 and cash 3300 remains +240 with opportunity unconfirmed. Capture the changed interface and ask the same persona to explain the result without supplying an expected answer. Report that retest separately; no claim of improved human comprehension.
