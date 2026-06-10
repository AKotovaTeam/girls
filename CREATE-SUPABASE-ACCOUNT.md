# 🚀 Создание аккаунта и проекта в Supabase

## 📝 Шаг 1: Создайте аккаунт

1. На странице https://supabase.com/dashboard нажмите **"Start your project"** или **"Sign up"**
2. Выберите способ регистрации:
   - **GitHub** (рекомендуется - быстрее)
   - **Email** (создаст аккаунт через email)
3. Следуйте инструкциям для завершения регистрации

## 📝 Шаг 2: Создайте новый проект

После входа в аккаунт:

1. Нажмите **"New Project"** (зеленая кнопка)
2. Заполните форму:
   - **Name**: например, "Girls Platform" или "My Project"
   - **Database Password**: придумайте надежный пароль (запишите его!)
   - **Region**: выберите ближайший регион (например, "West US" или "EU West")
   - **Pricing Plan**: выберите "Free" для начала
3. Нажмите **"Create new project"**
4. Подождите 1-2 минуты, пока проект создается

## 📝 Шаг 3: Получите credentials

После создания проекта:

1. В левом меню нажмите **Settings** (шестеренка)
2. Выберите **API**
3. Скопируйте следующие значения:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
→ Это ваш `NEXT_PUBLIC_SUPABASE_URL`

### Project API keys

#### anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Это ваш `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### service_role secret ⚠️
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Это ваш `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ ВАЖНО:** `service_role` key - это секретный ключ! Не публикуйте его.

## 📝 Шаг 4: Настройте .env.local

Откройте файл `.env.local` и вставьте скопированные значения:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
```

Или запустите скрипт:
```bash
./setup-supabase.sh
```

## 📝 Шаг 5: Выполните SQL миграцию

1. В Supabase Dashboard перейдите в **SQL Editor** (в левом меню)
2. Нажмите **New query**
3. Откройте файл: `supabase/migrations/0001_init_white_label.sql`
4. Скопируйте весь SQL код (Cmd+A, Cmd+C)
5. Вставьте в SQL Editor (Cmd+V)
6. Нажмите **Run** (или Cmd+Enter)

## ✅ Готово!

После выполнения всех шагов:
1. Перезапустите сервер: `npm run dev`
2. Откройте: http://test.localhost:3000

## 💡 Полезные ссылки:

- Supabase Dashboard: https://supabase.com/dashboard
- Документация: https://supabase.com/docs


