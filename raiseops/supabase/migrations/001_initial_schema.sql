-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  company_name text,
  avatar_url text,
  industry text,
  funding_stage text check (funding_stage in ('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth')),
  bio text,
  website text,
  linkedin_url text,
  twitter_handle text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- INVESTORS TABLE (shared/global)
-- ============================================================
create table if not exists public.investors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  firm text,
  email text,
  linkedin_url text,
  avatar_url text,
  focus_areas text[] default '{}',
  funding_stages text[] default '{}',
  investment_range_min bigint,
  investment_range_max bigint,
  location text,
  portfolio_count integer default 0,
  match_score integer default 0 check (match_score >= 0 and match_score <= 100),
  bio text,
  investor_type text check (investor_type in ('angel', 'vc', 'family-office', 'corporate', 'accelerator')),
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- INVESTOR RELATIONS (CRM) - per user
-- ============================================================
create table if not exists public.investor_relations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  investor_id uuid references public.investors on delete cascade not null,
  status text default 'prospect' check (status in ('prospect', 'contacted', 'meeting-scheduled', 'due-diligence', 'term-sheet', 'closed', 'passed')),
  notes text,
  last_contact_date date,
  next_follow_up date,
  potential_amount bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, investor_id)
);

-- ============================================================
-- MEETINGS
-- ============================================================
create table if not exists public.meetings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  investor_id uuid references public.investors,
  title text not null,
  description text,
  meeting_date timestamptz,
  meeting_type text default 'video' check (meeting_type in ('video', 'phone', 'in_person')),
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text,
  action_items text[] default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- CONTENT POSTS
-- ============================================================
create table if not exists public.content_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text,
  platforms text[] default '{}',
  scheduled_at timestamptz,
  published_at timestamptz,
  status text default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  tags text[] default '{}',
  media_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.investors enable row level security;
alter table public.investor_relations enable row level security;
alter table public.meetings enable row level security;
alter table public.content_posts enable row level security;

-- Profiles policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can view own profile') then
    create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can insert own profile') then
    create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- Investors policy
do $$ begin
  if not exists (select 1 from pg_policies where tablename='investors' and policyname='Authenticated users can view investors') then
    create policy "Authenticated users can view investors" on public.investors for select using (auth.role() = 'authenticated');
  end if;
end $$;

-- Investor relations policy
do $$ begin
  if not exists (select 1 from pg_policies where tablename='investor_relations' and policyname='Users can manage own investor relations') then
    create policy "Users can manage own investor relations" on public.investor_relations for all using (auth.uid() = user_id);
  end if;
end $$;

-- Meetings policy
do $$ begin
  if not exists (select 1 from pg_policies where tablename='meetings' and policyname='Users can manage own meetings') then
    create policy "Users can manage own meetings" on public.meetings for all using (auth.uid() = user_id);
  end if;
end $$;

-- Content posts policy
do $$ begin
  if not exists (select 1 from pg_policies where tablename='content_posts' and policyname='Users can manage own content') then
    create policy "Users can manage own content" on public.content_posts for all using (auth.uid() = user_id);
  end if;
end $$;

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists investor_relations_updated_at on public.investor_relations;
create trigger investor_relations_updated_at
  before update on public.investor_relations
  for each row execute procedure public.handle_updated_at();

drop trigger if exists content_posts_updated_at on public.content_posts;
create trigger content_posts_updated_at
  before update on public.content_posts
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, company_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
create index if not exists idx_investor_relations_user_id on public.investor_relations(user_id);
create index if not exists idx_investor_relations_investor_id on public.investor_relations(investor_id);
create index if not exists idx_investor_relations_status on public.investor_relations(status);
create index if not exists idx_meetings_user_id on public.meetings(user_id);
create index if not exists idx_meetings_meeting_date on public.meetings(meeting_date);
create index if not exists idx_content_posts_user_id on public.content_posts(user_id);
create index if not exists idx_content_posts_status on public.content_posts(status);
create index if not exists idx_content_posts_scheduled_at on public.content_posts(scheduled_at);
create index if not exists idx_investors_investor_type on public.investors(investor_type);
create index if not exists idx_investors_match_score on public.investors(match_score desc);
