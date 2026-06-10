# 📋 О seed записи для тестового creator

## Что это?

Это часть SQL миграции, которая создает тестового creator для локальной разработки.

## Что создается:

```sql
insert into creators (slug, primary_domain, display_name, bio, included_message_limit, is_active)
values (
  'test-creator',
  'test.localhost:3000',
  'Test Creator',
  'Welcome to my exclusive content platform! Subscribe to get access to premium photos, videos, and direct messaging.',
  20,
  true
) on conflict (slug) do nothing;
```

### Параметры:

- **slug**: `test-creator` - уникальный идентификатор
- **primary_domain**: `test.localhost:3000` - домен для локальной разработки
- **display_name**: `Test Creator` - отображаемое имя
- **bio**: Описание creator
- **included_message_limit**: `20` - лимит сообщений в месяц
- **is_active**: `true` - активен

## ✅ Важно:

1. **Этот код уже включен в полную миграцию**
   - Файл: `supabase/migrations/0001_init_white_label.sql`
   - Он находится в конце файла (строки 200-209)

2. **Не нужно выполнять отдельно**
   - Просто выполните весь SQL файл целиком
   - Seed запись выполнится автоматически

3. **После выполнения:**
   - Creator будет доступен на домене `test.localhost:3000`
   - Вы сможете открыть http://test.localhost:3000 в браузере
   - Увидите landing page для "Test Creator"

## 🔍 Проверка после миграции:

После выполнения миграции проверьте:

1. В Supabase Dashboard → Table Editor → creators
2. Должна быть запись с:
   - slug: `test-creator`
   - primary_domain: `test.localhost:3000`

## 🚀 После миграции:

1. Настройте .env.local с API credentials
2. Перезапустите сервер: `npm run dev`
3. Откройте: http://test.localhost:3000


