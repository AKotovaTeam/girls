# ✅ Проверка .env.local

## Если скрипт показывает, что .env.local уже настроен:

### Вариант 1: Значения правильные (рекомендуется)

Если вы уже настроили `.env.local` с реальными значениями из Supabase, то:

1. **Нажмите `n` (no)** в ответ на вопрос "Хотите обновить?"
2. Скрипт завершится
3. Переходите к следующему шагу: выполнение SQL миграции

### Вариант 2: Нужно обновить значения

Если значения еще заглушки (содержат "your-project" или "your_anon_key"):

1. **Нажмите `y` (yes)** в ответ на вопрос "Хотите обновить?"
2. Введите новые значения из Supabase Dashboard
3. Скрипт обновит файл

## 🔍 Как проверить, правильные ли значения:

Выполните в терминале:

```bash
cat .env.local
```

**Правильные значения выглядят так:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Неправильные (заглушки):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 📝 Следующий шаг после настройки:

1. Выполните SQL миграцию в Supabase Dashboard
2. Перезапустите сервер (если изменили .env.local)
3. Откройте http://test.localhost:3000


