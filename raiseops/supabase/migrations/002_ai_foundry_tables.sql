-- RaiseOps — AI Foundry Feature Tables Migration
-- Run after 001_ai_features.sql
-- Adds: fundraising_briefs, outreach_drafts, social_intakes
-- All tables: user_id = auth.uid() default + RLS policies

-- ─── fundraising_briefs ───────────────────────────────────────────────────
-- Stores the structured brief output, linked to an ai_generations row.
create table if not exists public.fundraising_briefs (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null default auth.uid() references auth.users on delete cascade,
  startup_snapshot   jsonb not null default '{}',   -- snapshot of input fields at generation time
  investor_targets   jsonb not null default '[]',   -- target investor tags / thesis
  brief_sections     jsonb not null default '{}',   -- full FundraisingBrief JSON output
  source_notes       jsonb not null default '{}',   -- original notes (traction, risks, etc.)
  ai_generation_id   uuid references public.ai_generations on delete set null,
  created_at         timestamptz not null default now()
);

alter table public.fundraising_briefs enable row level security;

create policy "fundraising_briefs: own select"
  on public.fundraising_briefs for select
  using (auth.uid() = user_id);

create policy "fundraising_briefs: own insert"
  on public.fundraising_briefs for insert
  with check (auth.uid() = user_id);

create policy "fundraising_briefs: own update"
  on public.fundraising_briefs for update
  using (auth.uid() = user_id);

create policy "fundraising_briefs: own delete"
  on public.fundraising_briefs for delete
  using (auth.uid() = user_id);

create index if not exists idx_fundraising_briefs_user on public.fundraising_briefs(user_id);

-- ─── outreach_drafts ─────────────────────────────────────────────────────
-- Stores AI-generated investor outreach drafts. Users can edit and mark as final.
create table if not exists public.outreach_drafts (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null default auth.uid() references auth.users on delete cascade,
  investor_id        uuid references public.investors on delete set null,  -- optional if using mock data
  investor_snapshot  jsonb not null default '{}',   -- name, firm, focusAreas snapshot
  startup_snapshot   jsonb not null default '{}',   -- company name, stage snapshot
  goal               text not null default 'intro' check (goal in ('intro','meeting','update','followup')),
  tone               text not null default 'founder-friendly',
  subject_options    jsonb not null default '[]',   -- array of subject line strings
  email_variants     jsonb not null default '{}',   -- { email, follow_up }
  linkedin_note      text,
  is_final           boolean not null default false,
  final_version      text,                          -- user-edited final draft
  ai_generation_id   uuid references public.ai_generations on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.outreach_drafts enable row level security;

create policy "outreach_drafts: own select"
  on public.outreach_drafts for select
  using (auth.uid() = user_id);

create policy "outreach_drafts: own insert"
  on public.outreach_drafts for insert
  with check (auth.uid() = user_id);

create policy "outreach_drafts: own update"
  on public.outreach_drafts for update
  using (auth.uid() = user_id);

create policy "outreach_drafts: own delete"
  on public.outreach_drafts for delete
  using (auth.uid() = user_id);

create index if not exists idx_outreach_drafts_user on public.outreach_drafts(user_id);

-- ─── social_intakes ──────────────────────────────────────────────────────
-- Stores the raw intake form that triggered a social content batch.
-- Linked to content_assets and social_calendar rows.
create table if not exists public.social_intakes (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null default auth.uid() references auth.users on delete cascade,
  startup_snapshot  jsonb not null default '{}',
  intake_payload    jsonb not null default '{}',   -- full SocialIntake input JSON
  post_count        int not null default 0,        -- number of posts generated
  ai_generation_id  uuid references public.ai_generations on delete set null,
  created_at        timestamptz not null default now()
);

alter table public.social_intakes enable row level security;

create policy "social_intakes: own select"
  on public.social_intakes for select
  using (auth.uid() = user_id);

create policy "social_intakes: own insert"
  on public.social_intakes for insert
  with check (auth.uid() = user_id);

create policy "social_intakes: own delete"
  on public.social_intakes for delete
  using (auth.uid() = user_id);

create index if not exists idx_social_intakes_user on public.social_intakes(user_id);

-- ─── Add source_id to content_assets if not present ──────────────────────
-- social_intake_id links each generated post back to the intake that created it.
alter table public.content_assets
  add column if not exists social_intake_id uuid references public.social_intakes on delete set null;

create index if not exists idx_content_assets_intake on public.content_assets(social_intake_id);

-- ─── Add social_intake_id to social_calendar for traceability ────────────
alter table public.social_calendar
  add column if not exists social_intake_id uuid references public.social_intakes on delete set null;
