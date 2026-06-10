# 🎉 Отлично! Hosts настроены!

## ✅ Что уже сделано:

- ✅ Зависимости установлены
- ✅ `.env.local` создан
- ✅ Dev сервер запущен
- ✅ **Hosts настроены** (test.localhost и admin.localhost)

## 🎯 Следующие шаги:

### 1. Настройте Supabase credentials

Откройте файл `.env.local` и замените значения:

```bash
# Откройте в редакторе
code .env.local
# или
nano .env.local
# или
open -a TextEdit .env.local
```

**Замените:**
- `NEXT_PUBLIC_SUPABASE_URL` → URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Anon key
- `SUPABASE_SERVICE_ROLE_KEY` → Service role key

**Где найти:**
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект (или создайте новый)
3. Settings → API
4. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Выполните SQL миграцию

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Откройте файл: `supabase/migrations/0001_init_white_label.sql`
3. Скопируйте **весь SQL код** из файла
4. Вставьте в SQL Editor
5. Нажмите **Run** (или Cmd/Ctrl + Enter)

Это создаст:
- Все таблицы (creators, accounts, sessions, и т.д.)
- Все индексы
- Тестового creator с доменом `test.localhost:3000`

### 3. Перезапустите сервер (если изменили .env.local)

Если вы изменили `.env.local`, перезапустите сервер:

```bash
# Остановите текущий (Ctrl+C в терминале где запущен npm run dev)
# Или найдите процесс:
pkill -f "next dev"

# Запустите снова:
npm run dev
```

### 4. Откройте в браузере

🌐 **Главная страница:** http://test.localhost:3000

## 🎨 Что вы увидите:

1. **Красивая Landing Page** - главная страница с градиентами и карточками
2. **Кнопка "Sign In"** - форма входа
3. **После входа** - Feed страница с постами
4. **Навигация** - Messages, Billing в header

## 💡 Про Magic Links:

В dev режиме magic links **логируются в консоль**, а не отправляются на email.

**Как использовать:**
1. Введите email на странице Login
2. Проверьте терминал где запущен `npm run dev`
3. Найдите строку:
   ```
   === MAGIC LINK EMAIL ===
   To: your@email.com
   Link: http://test.localhost:3000/auth/callback?token=...
   ```
4. Скопируйте ссылку и откройте в браузере

## 🚀 Готово!

После выполнения всех шагов проект полностью работает!

## 📊 Проверка статуса:

```bash
./check-status.sh
```

## 🆘 Если что-то не работает:

1. Проверьте, что сервер запущен: `lsof -ti:3000`
2. Проверьте .env.local: `cat .env.local`
3. Проверьте логи сервера в терминале
4. Убедитесь, что SQL миграция выполнена в Supabase


