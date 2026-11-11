create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text check (phone is null or char_length(phone) between 7 and 20),
  status text not null default 'active' check (status in ('active', 'suspended', 'deactivated')),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null default ''
);

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null check (kind in ('business', 'farm', 'institution', 'nonprofit', 'investor', 'other')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended', 'archived')),
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role_id uuid not null references public.roles (id) on delete restrict,
  organisation_id uuid references public.organisations (id) on delete cascade,
  assigned_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, role_id, organisation_id)
);

create table public.organisation_memberships (
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'invited' check (status in ('invited', 'active', 'suspended', 'left')),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (organisation_id, user_id)
);

create table public.innovations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete restrict,
  organisation_id uuid references public.organisations (id) on delete set null,
  title text not null check (char_length(title) between 3 and 180),
  summary text not null check (char_length(summary) between 10 and 500),
  description text not null check (char_length(description) between 10 and 20000),
  agricultural_sector text not null,
  development_stage text not null,
  support_needs text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'submitted', 'under_review', 'published', 'declined', 'withdrawn')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 320),
  topic text not null check (topic in ('General question', 'Volunteering', 'Partnership', 'Community initiative', 'Story consent')),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'in_review', 'responded', 'closed')),
  created_at timestamptz not null default now()
);

create table public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  detail text not null check (char_length(detail) <= 2000),
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.file_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete restrict,
  organisation_id uuid references public.organisations (id) on delete cascade,
  bucket_id text not null default 'leafy-private' check (bucket_id = 'leafy-private'),
  object_path text not null unique,
  original_name text not null check (char_length(original_name) between 1 and 255),
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 20971520),
  created_at timestamptz not null default now(),
  check (split_part(object_path, '/', 1) = owner_id::text)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.rate_limit_buckets (
  bucket_key text not null,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (bucket_key)
);

create index organisations_created_by_idx on public.organisations (created_by);
create index user_role_assignments_user_idx on public.user_role_assignments (user_id, organisation_id);
create index organisation_memberships_user_idx on public.organisation_memberships (user_id, status);
create index innovations_owner_created_idx on public.innovations (owner_id, created_at desc);
create index innovations_public_status_created_idx on public.innovations (status, created_at desc);
create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);
create index user_notifications_unread_idx on public.user_notifications (user_id, created_at desc) where read_at is null;
create index file_records_owner_created_idx on public.file_records (owner_id, created_at desc);
create index audit_logs_resource_created_idx on public.audit_logs (resource_type, resource_id, created_at desc);

insert into public.roles (code, name, description) values
  ('member', 'Member', 'Default least-privilege account role.'),
  ('super_admin', 'Super administrator', 'Platform-wide administration role.')
on conflict (code) do nothing;

insert into public.permissions (code, description) values
  ('platform.admin', 'Manage platform-wide settings and access.'),
  ('organisations.manage', 'Manage organisation records and memberships.'),
  ('innovations.moderate', 'Review and publish innovation records.'),
  ('contact_messages.manage', 'Review and respond to contact messages.'),
  ('files.manage', 'Manage files on behalf of an organisation.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
cross join public.permissions
where roles.code = 'super_admin'
on conflict do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger organisations_touch_updated_at
before update on public.organisations
for each row execute function public.touch_updated_at();

create trigger innovations_touch_updated_at
before update on public.innovations
for each row execute function public.touch_updated_at();

create or replace function public.has_permission(
  requested_permission text,
  target_organisation_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_role_assignments assignments
    join public.roles roles on roles.id = assignments.role_id
    join public.role_permissions role_permissions on role_permissions.role_id = roles.id
    join public.permissions permissions on permissions.id = role_permissions.permission_id
    where assignments.user_id = (select auth.uid())
      and permissions.code = requested_permission
      and (
        assignments.organisation_id is null
        or assignments.organisation_id = target_organisation_id
      )
  );
$$;

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Leafy member'),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  );

  insert into public.user_role_assignments (user_id, role_id)
  select new.id, roles.id
  from public.roles
  where roles.code = 'member'
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_auth_user();

create or replace function public.consume_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_max_requests integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_bucket public.rate_limit_buckets%rowtype;
  request_allowed boolean;
begin
  if p_key !~ '^[a-f0-9]{64}$'
     or p_window_seconds < 1
     or p_window_seconds > 86400
     or p_max_requests < 1 then
    raise exception 'Invalid rate limit parameters.';
  end if;

  insert into public.rate_limit_buckets (bucket_key, window_started_at, request_count)
  values (p_key, now(), 1)
  on conflict (bucket_key) do update
  set
    window_started_at = case
      when public.rate_limit_buckets.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then now()
      else public.rate_limit_buckets.window_started_at
    end,
    request_count = case
      when public.rate_limit_buckets.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then 1
      else public.rate_limit_buckets.request_count + 1
    end
  returning * into current_bucket;

  request_allowed := current_bucket.request_count <= p_max_requests;
  return request_allowed;
end;
$$;

create or replace function public.prune_rate_limit_buckets()
returns bigint
language sql
security definer
set search_path = public, pg_temp
as $$
  with deleted as (
    delete from public.rate_limit_buckets
    where window_started_at < now() - interval '1 day'
    returning 1
  )
  select count(*)::bigint from deleted;
$$;

create or replace function public.submit_innovation(p_innovation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  updated_count integer;
begin
  if auth.uid() is null then
    return false;
  end if;

  update public.innovations
  set status = 'submitted', submitted_at = now()
  where id = p_innovation_id
    and owner_id = auth.uid()
    and status = 'draft';

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organisations enable row level security;
alter table public.user_role_assignments enable row level security;
alter table public.organisation_memberships enable row level security;
alter table public.innovations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.user_notifications enable row level security;
alter table public.file_records enable row level security;
alter table public.audit_logs enable row level security;
alter table public.rate_limit_buckets enable row level security;

revoke all on public.profiles, public.roles, public.permissions, public.role_permissions,
  public.organisations, public.user_role_assignments, public.organisation_memberships,
  public.innovations, public.contact_messages, public.user_notifications, public.file_records,
  public.audit_logs, public.rate_limit_buckets from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, phone, preferences) on public.profiles to authenticated;
grant select on public.organisations to authenticated;
grant insert (name, slug, kind, created_by) on public.organisations to authenticated;
grant update (name, kind) on public.organisations to authenticated;
grant select on public.organisation_memberships to authenticated;
grant select, insert on public.innovations to authenticated;
grant select on public.innovations to anon;
grant update (title, summary, description, agricultural_sector, development_stage, support_needs)
  on public.innovations to authenticated;
grant select on public.user_notifications to authenticated;
grant update (read_at) on public.user_notifications to authenticated;
grant select, insert, delete on public.file_records to authenticated;

create policy profiles_select_self_or_admin
on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.has_permission('platform.admin'));

create policy profiles_update_self
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy organisations_select_member_or_creator
on public.organisations for select to authenticated
using (
  created_by = (select auth.uid())
  or exists (
    select 1 from public.organisation_memberships memberships
    where memberships.organisation_id = id
      and memberships.user_id = (select auth.uid())
      and memberships.status = 'active'
  )
  or public.has_permission('organisations.manage', id)
);

create policy organisations_insert_creator
on public.organisations for insert to authenticated
with check (created_by = (select auth.uid()));

create policy organisations_update_manager
on public.organisations for update to authenticated
using (public.has_permission('organisations.manage', id))
with check (public.has_permission('organisations.manage', id));

create policy memberships_select_self_or_manager
on public.organisation_memberships for select to authenticated
using (
  user_id = (select auth.uid())
  or public.has_permission('organisations.manage', organisation_id)
);

create policy innovations_select_public_or_owner_or_moderator
on public.innovations for select to authenticated
using (
  status = 'published'
  or owner_id = (select auth.uid())
  or public.has_permission('innovations.moderate', organisation_id)
);

create policy innovations_select_published_public
on public.innovations for select to anon
using (status = 'published');

create policy innovations_insert_owner
on public.innovations for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and status = 'draft'
  and (
    organisation_id is null
    or exists (
      select 1 from public.organisation_memberships memberships
      where memberships.organisation_id = public.innovations.organisation_id
        and memberships.user_id = (select auth.uid())
        and memberships.status = 'active'
    )
  )
);

create policy innovations_update_owner_or_moderator
on public.innovations for update to authenticated
using (
  (owner_id = (select auth.uid()) and status = 'draft')
  or public.has_permission('innovations.moderate', organisation_id)
)
with check (
  (owner_id = (select auth.uid()) and status = 'draft')
  or public.has_permission('innovations.moderate', organisation_id)
);

create policy notifications_select_self
on public.user_notifications for select to authenticated
using (user_id = (select auth.uid()));

create policy notifications_update_self
on public.user_notifications for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy file_records_select_owner
on public.file_records for select to authenticated
using (owner_id = (select auth.uid()));

create policy file_records_insert_owner
on public.file_records for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and split_part(object_path, '/', 1) = (select auth.uid())::text
);

create policy file_records_delete_owner
on public.file_records for delete to authenticated
using (owner_id = (select auth.uid()));

revoke all on function public.has_permission(text, uuid) from public, anon;
grant execute on function public.has_permission(text, uuid) to authenticated, service_role;
revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
revoke all on function public.prune_rate_limit_buckets() from public, anon, authenticated;
grant execute on function public.prune_rate_limit_buckets() to service_role;
revoke all on function public.submit_innovation(uuid) from public, anon;
grant execute on function public.submit_innovation(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'leafy-private',
  'leafy-private',
  false,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy leafy_private_select_owner
on storage.objects for select to authenticated
using (
  bucket_id = 'leafy-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy leafy_private_insert_owner
on storage.objects for insert to authenticated
with check (
  bucket_id = 'leafy-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy leafy_private_delete_owner
on storage.objects for delete to authenticated
using (
  bucket_id = 'leafy-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
