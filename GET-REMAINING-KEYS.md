# 🔑 Получите оставшиеся 2 ключа

## ✅ У вас уже есть:

- **Project URL**: `https://tgeeuqmzxynkqudoihjv.supabase.co`

## 📋 Нужно получить еще:

### 1. anon public key

На странице **Settings → API** найдите секцию **"Project API keys"**

Там будет:
- **anon public** - это длинная строка начинающаяся с `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Скопируйте этот ключ.

### 2. service_role secret key

На той же странице, в секции **"Project API keys"**:

- **service_role secret** - это тоже длинная строка
- ⚠️ Может быть скрыт - нажмите кнопку **"Reveal"** чтобы показать
- ⚠️ Это секретный ключ - не публикуйте его!

Скопируйте этот ключ.

## 🚀 После получения всех 3 значений:

Запустите скрипт:
```bash
./setup-supabase.sh
```

Скрипт попросит ввести:
1. NEXT_PUBLIC_SUPABASE_URL → `https://tgeeuqmzxynkqudoihjv.supabase.co`
2. NEXT_PUBLIC_SUPABASE_ANON_KEY → вставьте anon public key
3. SUPABASE_SERVICE_ROLE_KEY → вставьте service_role secret key

## 📍 Где найти на странице API:

Страница выглядит примерно так:

```
Project URL
https://tgeeuqmzxynkqudoihjv.supabase.co

Project API keys
┌─────────────────────────────────────┐
│ anon public                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│
│ [Copy]                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ service_role secret                 │
│ [Reveal] [Copy]                     │
│ (скрыт - нажмите Reveal)            │
└─────────────────────────────────────┘
```

## ✅ После настройки:

1. Перезапустите сервер: `npm run dev`
2. Откройте: http://test.localhost:3000


