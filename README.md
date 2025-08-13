# Tabung Beta
A minimalist, bilingual (EN/BM) personal finance tracker with savings goals, built with Next.js + Supabase.
Dark mode by default, privacy-friendly analytics (Plausible), and a simple feedback form via Formspree.
Branding: bamboo-themed Tabung logo with a Beta badge.

## Features
- Supabase email/password auth
- User-specific savings goals (create/update/delete)
- CSV export
- English / Bahasa Melayu toggle
- Dark mode default (class-based)
- Plausible analytics (no cookies)
- Feedback button (Formspree -> your email)

## 1) Setup (Local)
```bash
npm install
cp .env.example .env.local
# Fill .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tabung.vercel.app (or your domain)
# NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
npm run dev
```

## 2) Supabase
Create the `savings` table and RLS policies.

### SQL (run in Supabase SQL editor)
```sql
create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_name text not null,
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  created_at timestamp with time zone default now()
);

alter table public.savings enable row level security;

create policy "Users can read own savings"
on public.savings for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own savings"
on public.savings for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own savings"
on public.savings for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own savings"
on public.savings for delete to authenticated
using (auth.uid() = user_id);
```

## 3) Deploy to Vercel
1. Push this folder to a new GitHub repo (e.g. `tabung`).
2. On Vercel, New Project -> Import your repo.
3. Set Environment Variables (from `.env.example`).
4. Deploy. Your app will be live at https://<project>.vercel.app

## 4) Plausible Analytics
- Create a site at plausible.io with your domain (e.g. tabung.vercel.app).
- Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in Vercel env.

## 5) Feedback (Formspree)
- Create a form at formspree.io.
- Copy your Form ID and set NEXT_PUBLIC_FORMSPREE_ID in env.
- Submissions go to your configured email (we designed UI around CodeSaggaf@gmail.com).
