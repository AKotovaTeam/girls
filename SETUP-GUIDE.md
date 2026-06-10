# 🚀 Полная инструкция по настройке Supabase

## Вариант 1: Интерактивный скрипт (рекомендуется)

Запустите скрипт, который попросит ввести значения:

```bash
./setup-supabase.sh
```

Скрипт:
1. Покажет, где найти credentials
2. Попросит ввести каждое значение
3. Автоматически обновит `.env.local`

## Вариант 2: Ручная настройка

### Шаг 1: Получите credentials из Supabase

1. Откройте: https://supabase.com/dashboard
2. Выберите проект (или создайте новый)
3. Settings → API
4. Скопируйте:
   - **Project URL**
   - **anon public** key
   - **service_role secret** key

### Шаг 2: Откройте .env.local

```bash
code .env.local
# или
open -a TextEdit .env.local
# или
nano .env.local
```

### Шаг 3: Замените значения

Замените:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

На реальные значения:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Шаг 4: Сохраните файл

Сохраните изменения (Cmd+S или Ctrl+S)

## ✅ Проверка

После настройки проверьте:

```bash
cat .env.local | grep -v "ADMIN_HOST"
```

Должны увидеть реальные значения (не "your-project" или "your_anon_key").

## 🔄 Перезапуск сервера

После изменения `.env.local` перезапустите сервер:

```bash
# Остановите текущий (Ctrl+C)
# Запустите снова:
npm run dev
```

## 📝 Следующий шаг

После настройки Supabase credentials выполните SQL миграцию:
- Откройте `supabase/migrations/0001_init_white_label.sql`
- Скопируйте SQL код
- Вставьте в Supabase Dashboard → SQL Editor
- Нажмите Run

## 🆘 Помощь

Подробная инструкция: `GET-SUPABASE-CREDENTIALS.md`


