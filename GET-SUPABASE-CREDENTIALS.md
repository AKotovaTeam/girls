# 🔑 Как получить Supabase credentials

## 📍 Шаг 1: Откройте Supabase Dashboard

Перейдите: https://supabase.com/dashboard

## 📍 Шаг 2: Создайте или выберите проект

- Если у вас нет проекта: нажмите "New Project"
- Если есть проект: выберите его из списка

## 📍 Шаг 3: Перейдите в Settings → API

1. В левом меню нажмите на иконку **Settings** (шестеренка)
2. Выберите **API** в подменю

## 📍 Шаг 4: Скопируйте credentials

Вы увидите три секции:

### 1. Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
→ Это ваш `NEXT_PUBLIC_SUPABASE_URL`

### 2. Project API keys

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

**⚠️ ВАЖНО:** `service_role` key - это секретный ключ! Не публикуйте его и не коммитьте в git.

## 📍 Шаг 5: Вставьте в .env.local

Откройте файл `.env.local` и замените значения:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
```

## 🚀 Или используйте скрипт

Запустите интерактивный скрипт:

```bash
./setup-supabase.sh
```

Скрипт попросит ввести значения и автоматически обновит `.env.local`.

## ✅ Проверка

После настройки проверьте:

```bash
cat .env.local
```

Убедитесь, что все три значения заполнены и не содержат "your-project" или "your_anon_key".


