{\rtf1\ansi\ansicpg1251\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # TECH SPEC \'97 White-Label Multi-Domain Multi-Tenant Platform (Isolated Accounts)\
\
## Stack\
- Next.js App Router + TypeScript\
- Supabase Postgres + Storage (NO Supabase Auth)\
- Stripe: Subscriptions + One-time Checkout\
- Hosting: Vercel (or Node)\
\
---\
\
## TENANCY (HOST-BASED)\
tenant = creator\
\
Resolve creator by:\
- request Host header must match creators.primary_domain (case-insensitive, strip port)\
\
Unknown creator host -> 404.\
\
Admin area must not be reachable from creator domains.\
Preferred: separate admin host, e.g. admin.yourplatform.com\
\
---\
\
## AUTH (TENANT-SCOPED, EMAIL REUSABLE ACROSS DOMAINS)\
We do NOT use Supabase Auth because emails must be reusable across domains.\
\
Identity is account_id (UUID) from our accounts table.\
Uniqueness: (creator_id, email)\
\
Auth method (MVP): magic link\
- user enters email\
- system creates/updates account (creator_id + email)\
- creates one-time login token\
- emails link: https://\{creator_domain\}/auth/callback?token=...\
- callback consumes token and creates session cookie (session_token)\
\
Session cookie:\
- HttpOnly, Secure, SameSite=Lax\
- domain-scoped automatically because each creator has its own domain\
\
All auth writes use server routes with Supabase service role.\
\
---\
\
## DATA MODEL (tables)\
\
### creators\
id uuid pk\
slug text unique\
primary_domain text unique\
display_name text\
bio text\
brand_json jsonb\
included_message_limit int default 20\
is_active bool\
created_at timestamptz\
\
### accounts\
id uuid pk\
creator_id uuid fk creators\
email citext not null\
email_verified_at timestamptz null\
created_at timestamptz\
unique(creator_id, email)\
\
### sessions\
id uuid pk\
account_id uuid fk accounts on delete cascade\
session_token text unique\
expires_at timestamptz\
created_at timestamptz\
\
### login_tokens\
id uuid pk\
account_id uuid fk accounts on delete cascade\
token text unique\
expires_at timestamptz\
consumed_at timestamptz null\
created_at timestamptz\
\
### subscriptions\
id uuid pk\
account_id uuid fk accounts\
creator_id uuid fk creators\
status text\
stripe_customer_id text\
stripe_subscription_id text\
current_period_start timestamptz\
current_period_end timestamptz\
created_at timestamptz\
unique(account_id, creator_id)\
\
### message_allowances\
id uuid pk\
account_id uuid fk accounts\
creator_id uuid fk creators\
included_limit_per_period int\
included_used_in_period int\
period_start timestamptz\
period_end timestamptz\
purchased_credits_balance int default 0\
updated_at timestamptz\
unique(account_id, creator_id)\
\
### conversations\
id uuid pk\
creator_id uuid fk creators\
subscriber_account_id uuid fk accounts\
created_at timestamptz\
unique(creator_id, subscriber_account_id)\
\
### messages\
id uuid pk\
conversation_id uuid fk conversations on delete cascade\
sender_account_id uuid fk accounts\
body text\
created_at timestamptz\
\
### posts / galleries (+ images)\
(posts/galleries are creator-scoped like before; unchanged except created_by_account_id)\
\
### chat_pack_products\
id uuid pk\
creator_id uuid fk creators\
name text\
credits int\
price_cents int\
currency text default 'usd'\
stripe_price_id text\
is_active bool\
created_at timestamptz\
\
### chat_pack_purchases\
id uuid pk\
account_id uuid fk accounts\
creator_id uuid fk creators\
chat_pack_product_id uuid fk chat_pack_products\
stripe_checkout_session_id text unique\
stripe_payment_intent_id text\
status text\
credits_granted int\
amount_cents int\
currency text\
created_at timestamptz\
\
---\
\
## STORAGE\
- Supabase Storage bucket: private\
- Serve media via signed URLs (TTL 10 min)\
- No public bucket for paywalled media\
\
---\
\
## RLS STRATEGY (IMPORTANT)\
Because tenancy is determined by HTTP Host (not visible to Postgres), we rely on:\
- server-side routes using service role for all reads/writes that require tenant context, AND\
- RLS to prevent obvious cross-account access for any client-exposed tables (if any).\
\
MVP recommendation:\
- Expose NO direct table access from client for sensitive tables.\
- Use server routes (service role) for:\
  - feed fetching\
  - message send\
  - uploads/sign URLs\
  - subscriptions status checks\
  - chat pack purchase creation\
This avoids \'93RLS cannot see host\'94 pitfalls.\
\
If you still expose read access via anon/auth keys, enforce:\
- accounts: never selectable from client\
- conversations/messages/message_allowances: selectable only through joins that match auth account_id (which we do NOT have in Supabase Auth). Therefore do not rely on Supabase RLS auth.uid().\
\
=> Final: use server-only DB access in MVP.\
\
---\
\
## MESSAGE DEDUCTION (billing cycle reset)\
Atomic transaction (single DB transaction with row locking):\
Input: (account_id, creator_id, body)\
\
1) Verify subscription active for (account_id, creator_id)\
2) Lock message_allowances row FOR UPDATE (create if missing)\
3) If subscription.current_period_start != allowances.period_start:\
   - sync period_start/end from subscription\
   - set included_used_in_period = 0\
   - included_limit_per_period = creators.included_message_limit (or plan-based later)\
4) included_left = max(0, included_limit_per_period - included_used_in_period)\
5) available = included_left + purchased_credits_balance\
6) if available <= 0 -> reject NO_CREDITS\
7) insert message\
8) deduct 1:\
   - if included_left > 0: included_used_in_period += 1\
   - else: purchased_credits_balance -= 1\
\
Creator->subscriber messages: no deduction.\
\
---\
\
## STRIPE\
### Subscription webhooks (source of truth for billing cycle)\
Handle:\
- customer.subscription.created / updated / deleted\
- invoice.payment_failed\
\
Update:\
- subscriptions row\
- message_allowances period sync & cycle reset on period_start change\
\
### Chat Packs\
Checkout session (mode=payment).\
Metadata includes: creator_id, account_id, chat_pack_product_id\
Webhook checkout.session.completed:\
- insert purchase as paid\
- increment purchased_credits_balance\
\
---\
\
## ROUTES\
Creator domains:\
- / (landing)\
- /subscribe\
- /login (email entry)\
- /auth/callback?token=...\
- /app (feed)\
- /app/messages\
- /app/billing\
\
Creator dashboard:\
- /creator/dashboard\
- /creator/messages\
- /creator/content/*\
\
Admin host:\
- /admin/creators\
- /admin/chat-packs\
- /admin/reports/*}