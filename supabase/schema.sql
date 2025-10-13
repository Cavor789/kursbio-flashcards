-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'teacher',
  created_at timestamp with time zone default now()
);

-- Decks
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  title text not null,
  is_public boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Cards
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  front text not null,
  back text not null,
  image_url text,
  section text,
  topic text,
  cta_text text,
  cta_url text,
  created_at timestamp with time zone default now()
);

-- SRS state (per user per card)
create table if not exists public.srs_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  reps int not null default 0,
  interval int not null default 0,
  ease float not null default 2.5,
  due date not null default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, card_id)
);

-- Enable RLS
alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.srs_state enable row level security;
alter table public.profiles enable row level security;

-- Policies
-- profiles: user can see and edit only self
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- decks: public readable if is_public = true. Owners can manage.
create policy "read public decks" on public.decks for select using (is_public = true);
create policy "read own decks" on public.decks for select using (auth.uid() = owner_id);
create policy "insert own decks" on public.decks for insert with check (auth.uid() = owner_id);
create policy "update own decks" on public.decks for update using (auth.uid() = owner_id);
create policy "delete own decks" on public.decks for delete using (auth.uid() = owner_id);

-- cards: readable if parent deck is public, or owner
create policy "read cards of public decks" on public.cards for select using (exists (select 1 from public.decks d where d.id = deck_id and (d.is_public = true or d.owner_id = auth.uid())));
create policy "manage cards of own decks" on public.cards for all using (exists (select 1 from public.decks d where d.id = deck_id and d.owner_id = auth.uid())) with check (exists (select 1 from public.decks d where d.id = deck_id and d.owner_id = auth.uid()));

-- srs_state: user can manage only own
create policy "read own srs" on public.srs_state for select using (auth.uid() = user_id);
create policy "insert own srs" on public.srs_state for insert with check (auth.uid() = user_id);
create policy "update own srs" on public.srs_state for update using (auth.uid() = user_id);
create policy "delete own srs" on public.srs_state for delete using (auth.uid() = user_id);


-- Favorites (per user per card)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, card_id)
);

alter table public.favorites enable row level security;

create policy "read own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "delete own favorites" on public.favorites for delete using (auth.uid() = user_id);
