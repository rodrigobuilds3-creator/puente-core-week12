-- Applied to the dedicated PUENTE demo project. The sole row is fictional.
create table public.demo_scenarios (
  id text primary key,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 4096)
);
alter table public.demo_scenarios enable row level security;
revoke all on public.demo_scenarios from anon, authenticated;
grant select on public.demo_scenarios to anon, authenticated;
create policy demo_read_only on public.demo_scenarios for select to anon, authenticated
  using (id = 'puente-base');

insert into public.demo_scenarios (id, payload) values ('puente-base',
  '{"cash":1800,"weeklyFloor":1200,"retainedHoursWeekly":0,"transitionCosts":450,"days":[{"gross":480,"restock":200,"transport":30,"other":10,"hours":6},{"gross":460,"restock":190,"transport":30,"other":10,"hours":6},{"gross":500,"restock":220,"transport":30,"other":10,"hours":6},{"gross":430,"restock":180,"transport":30,"other":10,"hours":6},{"gross":470,"restock":190,"transport":30,"other":10,"hours":6}],"routeName":"Opción de trabajo de ejemplo","source":"","sourceDate":"","owner":"","confirmed":false}'::jsonb);
