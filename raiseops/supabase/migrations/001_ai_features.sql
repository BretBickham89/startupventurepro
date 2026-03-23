-- RaiseOps — Full Schema Migration
-- Run this in the Supabase SQL Editor or via `supabase db push`
-- All tables use Row Level Security: users can only access their own records.

-- ─── Extensions ───────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── profiles ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  full_name     text,
  company_name  text,
  avatar_url    text,
  industry      text,
  funding_stage text check (funding_stage in ('pre-seed','seed','series-a','series-b','series-c','growth')),
  bio           text,
  website       text,
  linkedin_url  text,
  twitter_handle text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── investors ────────────────────────────────────────────────────────────
create table if not exists public.investors (
  id                    uuid primary key default uuid_generate_v4(),
  name                  text not null,
  firm                  text,
  email                 text,
  linkedin_url          text,
  avatar_url            text,
  focus_areas           text[] not null default '{}',
  funding_stages        text[] not null default '{}',
  investment_range_min  numeric,
  investment_range_max  numeric,
  location              text,
  portfolio_count       int,
  match_score           int not null default 0 check (match_score between 0 and 100),
  bio                   text,
  investor_type         text not null check (investor_type in ('angel','vc','family-office','corporate','accelerator')),
  thesis_tags           text[] not null default '{}',
  prior_notes           text,
  created_at            timestamptz not null default now()
);

-- investors are read-only shared data (no RLS by user — public read, no write)
alter table public.investors enable row level security;
create policy "investors: public read" on public.investors for select using (true);

-- ─── investor_relations ───────────────────────────────────────────────────
create table if not exists public.investor_relations (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users on delete cascade,
  investor_id       uuid not null references public.investors on delete cascade,
  status            text not null default 'prospect' check (status in (
                      'prospect','contacted','meeting-scheduled','due-diligence',
                      'term-sheet','closed','passed')),
  notes             text,
  last_contact_date date,
  next_follow_up    date,
  potential_amount  numeric,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique(user_id, investor_id)
);

alter table public.investor_relations enable row level security;
create policy "investor_relations: own" on public.investor_relations
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── interactions ─────────────────────────────────────────────────────────
create table if not exists public.interactions (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid not null references auth.users on delete cascade,
  investor_id              uuid references public.investors on delete set null,
  type                     text not null check (type in ('intro','call','email','update','meeting','note')),
  date                     date not null default current_date,
  notes                    text,
  linked_content_asset_id  uuid,
  created_at               timestamptz not null default now()
);

alter table public.interactions enable row level security;
create policy "interactions: own" on public.interactions
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── meetings ─────────────────────────────────────────────────────────────
create table if not exists public.meetings (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  investor_id   uuid references public.investors on delete set null,
  title         text not null,
  description   text,
  meeting_date  timestamptz,
  meeting_type  text not null default 'video' check (meeting_type in ('video','phone','in_person')),
  status        text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.meetings enable row level security;
create policy "meetings: own" on public.meetings
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── content_posts ────────────────────────────────────────────────────────
create table if not exists public.content_posts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  title         text not null,
  content       text,
  platforms     text[] not null default '{}',
  scheduled_at  timestamptz,
  published_at  timestamptz,
  status        text not null default 'draft' check (status in ('draft','scheduled','published','failed')),
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.content_posts enable row level security;
create policy "content_posts: own" on public.content_posts
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── content_assets ───────────────────────────────────────────────────────
create table if not exists public.content_assets (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references auth.users on delete cascade,
  type                 text not null check (type in ('tweet','linkedin','email','press','brief_section')),
  status               text not null default 'draft' check (status in ('draft','approved','scheduled','published','archived')),
  content              text not null,
  source_id            uuid,
  source_type          text,
  platform             text check (platform in ('linkedin','twitter','instagram','facebook')),
  tags                 text[] not null default '{}',
  performance_reach    int,
  performance_likes    int,
  performance_comments int,
  performance_shares   int,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.content_assets enable row level security;
create policy "content_assets: own" on public.content_assets
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── social_calendar ──────────────────────────────────────────────────────
create table if not exists public.social_calendar (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users on delete cascade,
  content_asset_id       uuid references public.content_assets on delete set null,
  channel                text not null check (channel in ('linkedin','twitter','instagram','facebook')),
  scheduled_at           timestamptz not null,
  posted_at              timestamptz,
  provider_post_id       text,
  performance_reach      int,
  performance_engagement int,
  status                 text not null default 'scheduled' check (status in ('draft','scheduled','published','failed')),
  created_at             timestamptz not null default now()
);

alter table public.social_calendar enable row level security;
create policy "social_calendar: own" on public.social_calendar
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── ai_generations ───────────────────────────────────────────────────────
create table if not exists public.ai_generations (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users on delete cascade,
  feature          text not null check (feature in ('brief','outreach','social')),
  template_version text not null default '1.0',
  input_context    jsonb not null default '{}',
  output           jsonb not null default '{}',
  status           text not null default 'success' check (status in ('success','error')),
  error_message    text,
  created_at       timestamptz not null default now()
);

alter table public.ai_generations enable row level security;
create policy "ai_generations: own" on public.ai_generations
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────
create index if not exists idx_investor_relations_user    on public.investor_relations(user_id);
create index if not exists idx_interactions_user          on public.interactions(user_id);
create index if not exists idx_meetings_user              on public.meetings(user_id);
create index if not exists idx_content_posts_user         on public.content_posts(user_id);
create index if not exists idx_content_assets_user        on public.content_assets(user_id);
create index if not exists idx_social_calendar_user       on public.social_calendar(user_id);
create index if not exists idx_social_calendar_scheduled  on public.social_calendar(scheduled_at);
create index if not exists idx_ai_generations_user        on public.ai_generations(user_id);
create index if not exists idx_ai_generations_feature     on public.ai_generations(feature);
