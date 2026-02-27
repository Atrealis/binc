-- =============================================================
-- Binc — Initial schema migration
-- Created: 2026-02-27
-- Apply with: supabase db push  OR  run in Supabase SQL editor
-- =============================================================

-- ---------------------------------------------------------------
-- 1. checkins
--    One row per daily check-in session.
-- ---------------------------------------------------------------
create table if not exists public.checkins (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null unique,
  user_id     uuid        references auth.users(id) on delete set null,
  mood        smallint    not null check (mood between 1 and 5),
  stress      smallint    not null check (stress between 1 and 5),
  clarity     smallint    not null check (clarity between 1 and 5),
  feeling     text        not null,
  phase       text        not null check (phase in ('acute', 'processing', 'reflective')),
  created_at  timestamptz not null default now()
);

create index if not exists checkins_user_id_idx     on public.checkins(user_id);
create index if not exists checkins_session_id_idx  on public.checkins(session_id);
create index if not exists checkins_created_at_idx  on public.checkins(created_at desc);

alter table public.checkins enable row level security;

-- Authenticated users can insert their own check-ins (anon key allowed for now)
create policy "checkins_insert" on public.checkins
  for insert
  with check (true);

-- Users can only read their own check-ins (when auth is added)
create policy "checkins_select_own" on public.checkins
  for select
  using (user_id = auth.uid() or user_id is null);

-- ---------------------------------------------------------------
-- 2. comfort_messages
--    Chat messages linked to a check-in session.
-- ---------------------------------------------------------------
create table if not exists public.comfort_messages (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null references public.checkins(session_id) on delete cascade,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists comfort_messages_session_id_idx  on public.comfort_messages(session_id);
create index if not exists comfort_messages_created_at_idx  on public.comfort_messages(created_at asc);

alter table public.comfort_messages enable row level security;

create policy "comfort_messages_insert" on public.comfort_messages
  for insert
  with check (true);

create policy "comfort_messages_select" on public.comfort_messages
  for select
  using (
    exists (
      select 1 from public.checkins c
      where c.session_id = comfort_messages.session_id
        and (c.user_id = auth.uid() or c.user_id is null)
    )
  );

-- ---------------------------------------------------------------
-- 3. analysis_requests
--    Raw conversation text submitted for AI analysis.
-- ---------------------------------------------------------------
create table if not exists public.analysis_requests (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete set null,
  raw_text    text        not null,
  status      text        not null default 'pending' check (status in ('pending', 'running', 'done', 'error')),
  result      jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists analysis_requests_user_id_idx    on public.analysis_requests(user_id);
create index if not exists analysis_requests_created_at_idx on public.analysis_requests(created_at desc);

alter table public.analysis_requests enable row level security;

create policy "analysis_requests_insert" on public.analysis_requests
  for insert
  with check (true);

create policy "analysis_requests_select_own" on public.analysis_requests
  for select
  using (user_id = auth.uid() or user_id is null);

create policy "analysis_requests_update_own" on public.analysis_requests
  for update
  using (user_id = auth.uid() or user_id is null);

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists analysis_requests_updated_at on public.analysis_requests;
create trigger analysis_requests_updated_at
  before update on public.analysis_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------
-- 4. analysis_challenges
--    User-submitted challenges/corrections to an analysis.
-- ---------------------------------------------------------------
create table if not exists public.analysis_challenges (
  id              uuid        primary key default gen_random_uuid(),
  analysis_id     uuid        not null references public.analysis_requests(id) on delete cascade,
  challenge_text  text        not null,
  created_at      timestamptz not null default now()
);

create index if not exists analysis_challenges_analysis_id_idx on public.analysis_challenges(analysis_id);
create index if not exists analysis_challenges_created_at_idx  on public.analysis_challenges(created_at desc);

alter table public.analysis_challenges enable row level security;

create policy "analysis_challenges_insert" on public.analysis_challenges
  for insert
  with check (true);

create policy "analysis_challenges_select" on public.analysis_challenges
  for select
  using (
    exists (
      select 1 from public.analysis_requests r
      where r.id = analysis_challenges.analysis_id
        and (r.user_id = auth.uid() or r.user_id is null)
    )
  );

-- ---------------------------------------------------------------
-- 5. checkin_prompts  (optional seed table)
--    Reusable prompt/template set for check-in questions and
--    AI system prompts, keyed by phase.
-- ---------------------------------------------------------------
create table if not exists public.checkin_prompts (
  id          uuid        primary key default gen_random_uuid(),
  phase       text        not null check (phase in ('acute', 'processing', 'reflective', 'system')),
  label       text        not null,
  content     text        not null,
  active      boolean     not null default true,
  created_at  timestamptz not null default now()
);

alter table public.checkin_prompts enable row level security;

-- Prompts are read-only for all authenticated users; only service role can modify.
create policy "checkin_prompts_select_all" on public.checkin_prompts
  for select
  using (active = true);

-- ---------------------------------------------------------------
-- 6. Seed: default phase prompts
-- ---------------------------------------------------------------
insert into public.checkin_prompts (phase, label, content) values
  ('acute',       'Opening grounding',    'Name what you feel in 3 words. What do you need in the next 10 minutes (not the next 10 years)? One small action: water / walk / message a friend.'),
  ('processing',  'Gentle sorting',       'What part hurts most right now? What story is your brain trying to write about why it happened? What''s one alternative explanation that''s less self-blaming?'),
  ('reflective',  'Reflection prompts',   'What did you learn about your needs? What boundary would you hold next time? What would you tell a friend in the same situation?'),
  ('system',      'Comfort mode system',  'You are Binc in COMFORT MODE. Be warm, calm, and emotionally supportive. Ask 1-2 gentle follow-up questions. Do NOT be cheesy or overly validating if the user is distorted. Keep responses concise (max ~120 words).')
on conflict do nothing;
