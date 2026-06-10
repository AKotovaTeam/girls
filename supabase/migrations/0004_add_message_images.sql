-- Add message_images table for photos in messages
-- Photos are private and should be served via signed URLs (TTL 10 min)

create table if not exists message_images (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  price_credits int null, -- null = free, > 0 = requires purchase
  created_at timestamptz not null default now()
);

create index if not exists idx_message_images_message on message_images(message_id);

-- Add purchased_message_images table to track which images user has purchased
create table if not exists purchased_message_images (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  message_image_id uuid not null references message_images(id) on delete cascade,
  credits_spent int not null,
  created_at timestamptz not null default now(),
  unique (account_id, message_image_id)
);

create index if not exists idx_purchased_message_images_account on purchased_message_images(account_id);
create index if not exists idx_purchased_message_images_image on purchased_message_images(message_image_id);


