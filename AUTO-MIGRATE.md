# 🚀 Автоматическое выполнение SQL миграции

К сожалению, я не могу напрямую подключиться к вашему Supabase Dashboard, так как это требует:
- Доступа к вашему аккаунту
- Аутентификации в вашем проекте

## ✅ Но я могу помочь двумя способами:

### Вариант 1: Через Supabase CLI (автоматически)

Если у вас установлен Supabase CLI:

```bash
# 1. Установите CLI (если еще не установлен)
npm install -g supabase

# 2. Войдите в Supabase
supabase login

# 3. Свяжите проект
supabase link --project-ref <your-project-ref>

# 4. Выполните миграцию
supabase db push
```

**Где найти project-ref:**
- В URL вашего проекта: `https://app.supabase.com/project/<project-ref>`
- Или в Settings → General → Reference ID

### Вариант 2: Через Dashboard (проще, рекомендую)

1. **Откройте:** https://supabase.com/dashboard
2. **Выберите ваш проект**
3. **Перейдите в:** SQL Editor (в левом меню)
4. **Нажмите:** "New query" или откройте существующий редактор
5. **Откройте файл:** `supabase/migrations/0001_init_white_label.sql`
6. **Скопируйте весь SQL код** (Cmd+A, Cmd+C)
7. **Вставьте в SQL Editor** (Cmd+V)
8. **Нажмите:** Run (или Cmd+Enter)

## 📋 Что делает миграция:

- Создает все таблицы (creators, accounts, sessions, и т.д.)
- Создает все индексы
- Добавляет тестового creator с доменом `test.localhost:3000`

## ✅ После выполнения:

Проверьте, что таблицы созданы:
- В Supabase Dashboard → Table Editor
- Должны увидеть таблицы: creators, accounts, sessions, и т.д.

## 🚀 Затем:

1. Перезапустите сервер (если нужно):
   ```bash
   npm run dev
   ```

2. Откройте в браузере:
   http://test.localhost:3000


