# Girls Platform - White-Label Multi-Domain Multi-Tenant Platform

A Next.js-based platform that supports white-label multi-domain tenancy with fully isolated accounts per domain.

## Features (MVP)

- ✅ Host-based tenant resolution (creators identified by domain)
- ✅ Magic-link authentication with tenant-scoped accounts
- ✅ Session management with domain-scoped cookies
- ✅ Admin area restricted to admin host only
- ✅ SQL schema with all required tables and indexes
- ✅ Modern UI with Tailwind CSS
- ✅ Landing page with beautiful design
- ✅ Feed page for viewing posts
- ✅ Messages page for conversations
- ✅ Billing page with subscription and credits display
- ✅ Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL + Storage)
- No Supabase Auth (custom tenant-scoped auth)

## Local Development Setup

### 1. Prerequisites

- Node.js 18+
- Supabase account and project

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)
- `ADMIN_HOST` - Admin area host (default: `admin.localhost:3000`)

### 4. Database Migration

Run the SQL migration to create all tables:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/0001_init_white_label.sql`
4. Paste and execute

Alternatively, if you have Supabase CLI installed:

```bash
supabase db push
```

The migration includes:
- All required tables (creators, accounts, sessions, login_tokens, subscriptions, message_allowances, conversations, messages, posts, post_images, galleries, gallery_images, chat_pack_products, chat_pack_purchases, audit_log)
- All indexes for performance
- A seed creator with domain `test.localhost:3000` for local development

### 5. Hosts Mapping

For local development, you need to map domains to localhost. Add these entries to your `/etc/hosts` file:

**macOS/Linux:**
```bash
sudo nano /etc/hosts
```

**Windows:**
Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator

Add these lines:
```
127.0.0.1 test.localhost
127.0.0.1 admin.localhost
```

### 6. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 7. Test the Platform

1. **Test Creator Domain:**
   - Visit `http://test.localhost:3000`
   - You should see a beautiful landing page for the test creator
   - Click "Sign In" and enter an email
   - Check the **server console** (where `npm run dev` is running) for the magic link
   - Copy the magic link from console and visit it in your browser
   - You'll be redirected to `/app` (Feed page)
   - Navigate to Messages and Billing pages using the header menu

2. **Admin Domain:**
   - Visit `http://admin.localhost:3000/admin/creators`
   - Admin routes are only accessible on the admin host

3. **Unknown Domain:**
   - Visit `http://localhost:3000` (without domain mapping)
   - You should see a 404 error

### 8. Magic Link (Development)

In development mode, magic links are logged to the server console instead of being sent via email. When you submit the login form:
1. Check the terminal where `npm run dev` is running
2. Look for a log message like:
   ```
   === MAGIC LINK EMAIL ===
   To: your@email.com
   Link: http://test.localhost:3000/auth/callback?token=...
   =======================
   ```
3. Copy the link and visit it in your browser to sign in

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/         # Auth API endpoints (login, logout)
│   ├── app/               # Protected app area
│   │   ├── page.tsx      # Feed page
│   │   ├── messages/     # Messages page
│   │   └── billing/      # Billing page
│   ├── auth/              # Auth callback
│   ├── login/             # Login page
│   ├── subscribe/        # Subscribe page
│   └── admin/            # Admin area (admin host only)
├── components/            # React components
│   ├── Header.tsx        # Site header with navigation
│   └── LogoutButton.tsx  # Logout button component
├── lib/                    # Shared utilities
│   ├── auth.ts            # Auth functions (sessions, tokens)
│   ├── tenant.ts          # Tenant resolution
│   ├── supabase.ts        # Supabase clients
│   ├── email.ts           # Email sending (placeholder)
│   └── content.ts         # Content fetching functions
├── supabase/
│   └── migrations/        # SQL migrations
├── middleware.ts          # Next.js middleware (tenant resolution)
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md
```

## Key Implementation Details

### Tenant Resolution

- Tenants (creators) are resolved by matching the request `Host` header to `creators.primary_domain`
- Case-insensitive matching, port is stripped
- Unknown hosts return 404
- Admin host is separate and doesn't resolve to a creator

### Authentication

- Magic-link based authentication
- Accounts are scoped to `(creator_id, email)` - same email can exist on different domains
- Login tokens are one-time use and expire after 15 minutes
- Sessions are stored in cookies (HttpOnly, Secure, SameSite=Lax)
- Session duration: 30 days

### Database Access

- All sensitive operations use Supabase service role (server-side only)
- No direct client-side database access for sensitive tables
- RLS policies can be added for additional security

## Next Steps (Future Phases)

- Stripe integration (subscriptions + chat packs)
- Message deduction with atomic transactions
- Media uploads with signed URLs
- Conversation and messaging UI
- Creator dashboard
- Admin panel

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Use environment variables for all secrets
- In production, use proper email service (Resend, SendGrid, etc.)
- Enable HTTPS in production
- Consider adding rate limiting for auth endpoints

