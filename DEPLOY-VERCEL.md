# 🚀 Деплой Girls на Vercel (как akteam на GitHub Pages)

Схема такая же, как у [трекера рефакторинга](https://akotovateam.github.io/akteam/):

```
GitHub (код)  →  Vercel (хостинг)  →  Supabase (база)
```

## Шаг 1: GitHub

```bash
cd /Users/alyona/Cursor_project/Girls
git init
git add .
git commit -m "Initial commit: Girls platform"
```

Создайте репозиторий на GitHub (например `akotovateam/girls`) и запушьте:

```bash
git remote add origin https://github.com/akotovateam/girls.git
git branch -M main
git push -u origin main
```

## Шаг 2: Vercel

1. Откройте [vercel.com](https://vercel.com) → войдите через GitHub
2. **Add New Project** → выберите репозиторий `girls`
3. Framework: **Next.js** (определится автоматически)
4. **Environment Variables** — добавьте:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | из `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | из `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | из `.env.local` |
| `GROQ_API_KEY` | из `.env.local` (если нужны сообщения) |

5. Нажмите **Deploy**

После деплоя получите URL, например: `https://girls-xxx.vercel.app`

## Шаг 3: Supabase — обновить домен creator

В **Supabase → SQL Editor** выполните (замените URL на ваш Vercel):

```sql
UPDATE creators
SET primary_domain = 'girls-xxx.vercel.app'
WHERE slug = 'test-creator';

SELECT slug, primary_domain FROM creators WHERE slug = 'test-creator';
```

Без этого шага будет **404 Creator not found**.

## Шаг 4: Проверка

1. Откройте `https://girls-xxx.vercel.app/login`
2. Введите email → Send Magic Link
3. Magic link появится в **Vercel → Project → Logs** (пока email не подключён)
4. Откройте ссылку → Feed

## Для коллег

Отправьте им постоянную ссылку:

```
https://girls-xxx.vercel.app/login
```

Каждый вход — magic link из логов Vercel (или настройте Resend/SendGrid позже).

## Платный тестовый пользователь

SQL из `grant-test-subscription.sql` — замените email коллеги.

## Локальная разработка после деплоя

Чтобы снова работать локально, верните домен:

```sql
UPDATE creators SET primary_domain = 'test.localhost:3000' WHERE slug = 'test-creator';
```

## Авто-деплой

Каждый `git push` в `main` → Vercel автоматически пересобирает сайт (как Pages у akteam).
