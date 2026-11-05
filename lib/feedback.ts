export const EVENT_NAMES = ['session_started','example_loaded','calculation_attempted','record_saved','record_restored','record_exported','record_cleared','help_requested','reason_selected'] as const;
export const REASONS = ['result_unclear','missing_data','next_step_unclear','save_restore_unclear'] as const;
export type FeedbackReason = typeof REASONS[number];
export type EventName = typeof EVENT_NAMES[number];
export type FeedbackEvent = {event: EventName; elapsedMs: number; reason?: FeedbackReason};
export const MAX_EVENTS = 200;
export function appendEvent(events: FeedbackEvent[], active: boolean, event: unknown, elapsedMs: number, reason?: unknown): FeedbackEvent[] {
  if (!active || events.length >= MAX_EVENTS || !EVENT_NAMES.includes(event as EventName) || !Number.isFinite(elapsedMs) || elapsedMs < 0) return events;
  if (event === 'reason_selected' && !REASONS.includes(reason as FeedbackReason)) return events;
  const next: FeedbackEvent = {event: event as EventName, elapsedMs: Math.min(Math.round(elapsedMs),86_400_000)};
  if (event === 'reason_selected') next.reason = reason as FeedbackReason;
  return [...events,next];
}
