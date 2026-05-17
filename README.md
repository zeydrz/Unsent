# UnsentAz — Anonymous Quiz Platform

**UnsentAz** is a beautiful, production-ready, 100% anonymous quiz platform built with Next.js 16 (App Router), TypeScript, Tailwind, Framer Motion, and Supabase.

Create "How well do you know me?" quizzes, share links, and see results — no accounts, no logins, no tracking.

## ✨ Features

- **Completely Anonymous**: No accounts or personal data collection.
- **Shareable Links Only**: Two links per quiz — Take Quiz + View Results.
- **Multi-language**: English, Azerbaijani (AZ), Russian. Persisted in localStorage.
- **Dark mode by default** with toggle (persisted).
- **Apple-inspired minimalist black & white design**.
- **Templates**: Best Friend, Boyfriend/Girlfriend, Siblings — fully editable.
- **Smooth UX**: Framer Motion question transitions, toasts with Sonner.
- **Mobile-first** and production-ready for Vercel.

## 🛠 Tech Stack

- Next.js 16 + TypeScript + App Router
- Tailwind CSS 4
- @supabase/ssr + @supabase/supabase-js
- Framer Motion
- Sonner (toasts)
- Lucide React (icons)
- React Context for Theme & Language

## 🚀 Quick Start (Local Development)

1. **Clone / Download** the project

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Go to [supabase.com](https://supabase.com) → Create new project
   - Go to **SQL Editor** and run the following:

   ```sql
   -- Enable UUID extension (usually already enabled)
   create extension if not exists "uuid-ossp";

   -- Quizzes table
   create table public.quizzes (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text,
     questions jsonb not null,
     created_at timestamptz default now()
   );

   -- Quiz attempts table
   create table public.quiz_attempts (
     id uuid primary key default gen_random_uuid(),
     quiz_id uuid references public.quizzes(id) on delete cascade not null,
     participant_name text,
     score integer not null check (score >= 0 and score <= 100),
     answers jsonb not null,
     created_at timestamptz default now()
   );

   -- Enable Row Level Security
   alter table public.quizzes enable row level security;
   alter table public.quiz_attempts enable row level security;

   -- Policies (open for anonymous use via shareable links)
   create policy "Anyone can create quizzes"
     on public.quizzes for insert
     with check (true);

   create policy "Anyone can view quizzes"
     on public.quizzes for select
     using (true);

   create policy "Anyone can submit attempts"
     on public.quiz_attempts for insert
     with check (true);

   create policy "Anyone can view attempts"
     on public.quiz_attempts for select
     using (true);
   ```

4. **Environment Variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project **Settings → API**.

5. **Run the app**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add the two Supabase environment variables in Vercel dashboard
4. Deploy!

Everything works out of the box.

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout + Providers
├── page.tsx                # Beautiful landing page
├── create/
│   └── page.tsx            # Quiz creation with templates
├── quiz/
│   └── [id]/
│       └── page.tsx        # Take quiz flow
├── results/
│   └── [id]/
│       └── page.tsx        # Results dashboard
├── not-found.tsx
├── globals.css
lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
contexts/
├── ThemeContext.tsx
└── LanguageContext.tsx
components/
└── Providers.tsx
types/
└── quiz.ts
```

## 🔒 Privacy & Security Notes

- All data is public only through the specific shareable links you control.
- No authentication or user tracking.
- Recommended: Keep your Supabase anon key safe (it's public by design for client usage).
- For production, you can add rate limiting or CAPTCHA if desired.

## 🧩 Customization

- Add more languages in `contexts/LanguageContext.tsx`
- Extend templates in `app/create/page.tsx`
- Style changes in `app/globals.css` (very clean Tailwind)

## 📄 License

MIT — feel free to use and modify.

---

Built with ❤️ for genuine human connections. Share a quiz, learn something new about someone you care about.

**UnsentAz** — The unsent thoughts, now answered.
