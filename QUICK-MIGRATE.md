# ⚡ Быстрое выполнение SQL миграции (2 минуты)

## 🎯 Самый простой способ:

### Шаг 1: Откройте файл SQL

В терминале выполните:
```bash
open supabase/migrations/0001_init_white_label.sql
```

Или откройте вручную:
- Файл находится в: `supabase/migrations/0001_init_white_label.sql`

### Шаг 2: Скопируйте весь код

1. Нажмите `Cmd+A` (выделить все)
2. Нажмите `Cmd+C` (скопировать)

### Шаг 3: Вставьте в Supabase Dashboard

1. Откройте: https://supabase.com/dashboard
2. Выберите ваш проект
3. В левом меню нажмите **SQL Editor**
4. Нажмите **New query** (или откройте редактор)
5. Нажмите `Cmd+V` (вставить)
6. Нажмите **Run** (или `Cmd+Enter`)

### Шаг 4: Проверьте результат

После выполнения вы должны увидеть:
- ✅ Success message
- В Table Editor должны появиться таблицы: creators, accounts, sessions, и т.д.

## ✅ Готово!

После выполнения миграции:
1. Перезапустите сервер (если нужно): `npm run dev`
2. Откройте: http://test.localhost:3000

## 📋 Что создаст миграция:

- ✅ Все таблицы (creators, accounts, sessions, login_tokens, subscriptions, message_allowances, conversations, messages, posts, galleries, chat_pack_products, chat_pack_purchases, audit_log)
- ✅ Все индексы
- ✅ Тестового creator с доменом `test.localhost:3000`

## 🆘 Если что-то пошло не так:

- Проверьте, что вы выбрали правильный проект в Supabase
- Убедитесь, что скопировали весь SQL код
- Проверьте сообщения об ошибках в SQL Editor


