# 🔐 Supabase Credentials

## Database Password

Пароль базы данных Supabase сохранен в файле `.supabase-password.txt`

**⚠️ ВАЖНО:** Этот файл не должен быть закоммичен в git!

## 📝 Где использовать пароль:

Пароль нужен для:
- Подключения к базе данных напрямую (через psql или другие клиенты)
- Восстановления доступа к проекту
- НЕ нужен для работы приложения (приложение использует API keys)

## 🔒 Безопасность:

- Файл `.supabase-password.txt` добавлен в `.gitignore`
- Файл имеет права доступа 600 (только владелец может читать)
- НЕ публикуйте этот пароль нигде!

## 📋 Другие credentials:

API keys хранятся в `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 💡 Если забыли пароль:

Если вы забыли пароль базы данных:
1. Зайдите в Supabase Dashboard
2. Settings → Database
3. Можно сбросить пароль или посмотреть connection string


