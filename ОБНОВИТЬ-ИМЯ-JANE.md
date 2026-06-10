# 🔄 Обновление имени на "Jane"

## ❌ Проблема:
В базе данных все еще может быть "Test Creator" вместо "Jane".

## ✅ Решение:

### Вариант 1: Быстрое обновление (рекомендуется)

1. Откройте **Supabase Dashboard → SQL Editor**
2. Выполните этот SQL:

```sql
UPDATE creators 
SET display_name = 'Jane'
WHERE slug = 'test-creator';

-- Проверяем результат
SELECT display_name FROM creators WHERE slug = 'test-creator';
```

3. Должно показать: `display_name = 'Jane'`

### Вариант 2: Использовать готовый файл

1. Откройте файл: `update-jane-name.sql`
2. Скопируйте SQL код
3. Вставьте в Supabase Dashboard → SQL Editor
4. Нажмите Run

## 🔍 Проверка:

После выполнения SQL:

1. Обновите страницу в браузере: `http://test.localhost:3000/app/messages`
2. В мессенджере должно быть "Jane" вместо "Test Creator"
3. В header мессенджера должно быть "Jane"

## ⚠️ Важно:

- Если запись уже существует, миграция не обновит её автоматически
- Нужно выполнить UPDATE запрос вручную
- После обновления в базе, изменения появятся сразу при обновлении страницы


