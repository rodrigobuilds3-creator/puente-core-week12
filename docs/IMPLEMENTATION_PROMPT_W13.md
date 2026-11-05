# Week 13 implementation prompt

Implement PACKET_WEEK13.md against the existing PUENTE codebase. Preserve the deterministic engine and all established numeric outputs. First commit the specification; then make independently reviewable changes with regression evidence.

Prioritize the provisional-result heading over the positive margin: state that the opportunity remains unconfirmed, show neutral margin styling and do not imply acceptance even when a source is entered. Explain recorded net versus projected retained income, including why zero retained hours yields zero retained income. Explain the lowest positive-day reserve without calling it an official safety standard.

Parse a blank numeric field as invalid (not zero) while keeping an editable empty control. The pure engine should continue rejecting NaN/non-finite input. Show an explicit changed-data notice requiring recalculation; never display stale results as current. Distinguish “Llenar con datos de prueba” from “Abrir lo que guardé”, preserve the existing local-storage key, describe single-browser storage and ask for confirmation before clearing. Catch storage failures.

Add optional local feedback: opt-in starts a new session log, opt-out erases it. Only allow fixed event names and fixed feedback reasons plus relative time; no free text, financial values, route details, names, device identifiers or external transmissions. Bound the log size and make export voluntary. “Necesito ayuda” records a difficulty and explains that it does not contact a live advisor.

Verify the two baseline margins, missing/negative/nonfinite inputs, source-date states, save/edit/restore compatibility, cancel/confirm clear, mobile layout and event privacy. Record tests as technical checks. Do not fabricate real-user retest results, return messages or deploy receipts.
