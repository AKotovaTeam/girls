-- Cursor-ready SQL migration (single file) -- 0001_init_white_label.sql
-- Requires: pgcrypto, citext
create extension if not exists pgcrypto;
create extension if not exists citext;

-- creators
create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  primary_domain text not null unique,
  display_name text not null,
  bio text not null default '',
  brand_json jsonb not null default '{}'::jsonb,
  included_message_limit int not null default 20,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- tenant-scoped accounts (email reusable across domains => unique(creator_id,email))
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  email citext not null,
  email_verified_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (creator_id, email)
);

create index if not exists idx_accounts_creator on accounts(creator_id);

-- sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  session_token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_sessions_account on sessions(account_id);
create index if not exists idx_sessions_expires on sessions(expires_at);

-- magic link tokens
create table if not exists login_tokens (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz null,
  created_at timestamptz not null default now()
);
create index if not exists idx_login_tokens_account on login_tokens(account_id);
create index if not exists idx_login_tokens_expires on login_tokens(expires_at);

-- subscriptions (per creator per account)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  status text not null,
  stripe_customer_id text null,
  stripe_subscription_id text null,
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  created_at timestamptz not null default now(),
  unique (account_id, creator_id),
  unique (stripe_subscription_id)
);
create index if not exists idx_subscriptions_creator on subscriptions(creator_id);
create index if not exists idx_subscriptions_account on subscriptions(account_id);

-- message allowances (quota + purchased credits)
create table if not exists message_allowances (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,

  included_limit_per_period int not null default 20,
  included_used_in_period int not null default 0,

  period_start timestamptz null,
  period_end   timestamptz null,

  purchased_credits_balance int not null default 0,
  updated_at timestamptz not null default now(),

  unique (account_id, creator_id)
);
create index if not exists idx_allowances_creator on message_allowances(creator_id);
create index if not exists idx_allowances_account on message_allowances(account_id);

-- conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  subscriber_account_id uuid not null references accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (creator_id, subscriber_account_id)
);
create index if not exists idx_conversations_creator on conversations(creator_id);
create index if not exists idx_conversations_subscriber on conversations(subscriber_account_id);

-- messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_account_id uuid not null references accounts(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_messages_sender on messages(sender_account_id);

-- content
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  title text not null,
  body_md text not null default '',
  is_published boolean not null default false,
  published_at timestamptz null,
  created_by_account_id uuid null references accounts(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_posts_creator on posts(creator_id);
create index if not exists idx_posts_published on posts(creator_id, is_published);

create table if not exists post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0
);
create index if not exists idx_post_images_post on post_images(post_id);

create table if not exists galleries (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  title text not null,
  description text not null default '',
  is_published boolean not null default false,
  created_by_account_id uuid null references accounts(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_galleries_creator on galleries(creator_id);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0
);
create index if not exists idx_gallery_images_gallery on gallery_images(gallery_id);

-- chat packs
create table if not exists chat_pack_products (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  name text not null,
  credits int not null,
  price_cents int not null,
  currency text not null default 'usd',
  stripe_price_id text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_pack_products_creator on chat_pack_products(creator_id);

create table if not exists chat_pack_purchases (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  chat_pack_product_id uuid not null references chat_pack_products(id) on delete restrict,

  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text null,
  status text not null,
  credits_granted int not null,
  amount_cents int not null,
  currency text not null,

  created_at timestamptz not null default now()
);
create index if not exists idx_chat_pack_purchases_creator on chat_pack_purchases(creator_id);
create index if not exists idx_chat_pack_purchases_account on chat_pack_purchases(account_id);

-- audit log
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_account_id uuid null references accounts(id) on delete set null,
  creator_id uuid null references creators(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- NOTE: RLS is intentionally not enabled for MVP because we are not using Supabase Auth.
-- All access must be via server routes using service role + explicit tenant (creator_id) checks.
-- If later you introduce Supabase Auth or Postgres JWT claims for account_id, add RLS then.

-- Seed a test creator for local development
insert into creators (slug, primary_domain, display_name, bio, included_message_limit, is_active)
values (
  'test-creator',
  'test.localhost:3000',
  'Jane',
  'Welcome to my personal space! Subscribe to get access to premium photos, videos, and direct messaging.',
  20,
  true
) on conflict (slug) do update
set display_name = 'Jane';

