-- ============================================================
-- ADMIN ROLE SYSTEM
-- ============================================================

-- Add role column to profiles
alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

-- ============================================================
-- HELPER FUNCTION: is_admin()
-- Uses security definer so it can read profiles without
-- triggering RLS recursion
-- ============================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ============================================================
-- PROFILES — admin can read/update all profiles
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Admins can view all profiles') then
    create policy "Admins can view all profiles"
      on public.profiles for select
      using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Admins can update all profiles') then
    create policy "Admins can update all profiles"
      on public.profiles for update
      using (public.is_admin());
  end if;
end $$;

-- ============================================================
-- INVESTORS — admin has full write access (others read-only)
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_policies where tablename='investors' and policyname='Admins can manage investors') then
    create policy "Admins can manage investors"
      on public.investors for all
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- ============================================================
-- INVESTOR RELATIONS — admin can see all
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_policies where tablename='investor_relations' and policyname='Admins can view all investor relations') then
    create policy "Admins can view all investor relations"
      on public.investor_relations for all
      using (public.is_admin());
  end if;
end $$;

-- ============================================================
-- MEETINGS — admin can see all
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_policies where tablename='meetings' and policyname='Admins can view all meetings') then
    create policy "Admins can view all meetings"
      on public.meetings for all
      using (public.is_admin());
  end if;
end $$;

-- ============================================================
-- CONTENT POSTS — admin can see all
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_policies where tablename='content_posts' and policyname='Admins can view all content') then
    create policy "Admins can view all content"
      on public.content_posts for all
      using (public.is_admin());
  end if;
end $$;

-- ============================================================
-- PROMOTE A USER TO ADMIN
-- Run this after registering your account:
--
--   select promote_to_admin('your@email.com');
--
-- ============================================================
create or replace function public.promote_to_admin(user_email text)
returns text as $$
declare
  target_id uuid;
begin
  select id into target_id
  from auth.users
  where email = user_email;

  if target_id is null then
    return 'ERROR: No user found with email ' || user_email;
  end if;

  update public.profiles
  set role = 'admin', updated_at = now()
  where id = target_id;

  return 'SUCCESS: ' || user_email || ' is now an admin.';
end;
$$ language plpgsql security definer;
