# 🚀 Быстрый старт - ВСЁ ГОТОВО!

## ✅ Что уже сделано:

1. ✅ Зависимости установлены (`npm install`)
2. ✅ `.env.local` файл создан
3. ✅ Dev сервер запущен на порту 3000
4. ✅ Все файлы проекта на месте

## 📋 Что нужно сделать СЕЙЧАС:

### 1. Настройте Supabase credentials

Откройте `.env.local` и замените значения:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
```

**Где найти:**
- Зайдите в Supabase Dashboard → Settings → API
- Скопируйте Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Скопируйте `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Скопируйте `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Выполните SQL миграцию

1. Откройте Supabase Dashboard → SQL Editor
2. Откройте файл `supabase/migrations/0001_init_white_label.sql`
3. Скопируйте весь SQL код
4. Вставьте в SQL Editor и нажмите Run

Это создаст все таблицы и добавит тестового creator.

### 3. Настройте hosts (для локальной разработки)

**macOS/Linux:**
```bash
sudo bash -c 'echo "127.0.0.1 test.localhost" >> /etc/hosts'
sudo bash -c 'echo "127.0.0.1 admin.localhost" >> /etc/hosts'
```

**Или запустите скрипт:**
```bash
./setup-hosts.sh
```

**Windows:**
Откройте `C:\Windows\System32\drivers\etc\hosts` как администратор и добавьте:
```
127.0.0.1 test.localhost
127.0.0.1 admin.localhost
```

### 4. Перезапустите сервер (если нужно)

Если вы изменили `.env.local`, перезапустите сервер:

```bash
# Остановите текущий (Ctrl+C в терминале)
# Затем запустите снова:
npm run dev
```

### 5. Откройте в браузере

🌐 **Главная страница:** http://test.localhost:3000

## 🎯 Что вы увидите:

1. **Landing Page** - красивая главная страница с градиентами
2. **Login** - форма входа (magic link)
3. **Feed** - после входа увидите ленту постов
4. **Messages** - страница сообщений
5. **Billing** - информация о подписке и кредитах

## 💡 Важно про Magic Links:

В режиме разработки magic links **НЕ отправляются на email**, а **логируются в консоль** терминала, где запущен `npm run dev`.

Когда вы введете email на странице Login, проверьте консоль - там будет ссылка вида:
```
=== MAGIC LINK EMAIL ===
To: your@email.com
Link: http://test.localhost:3000/auth/callback?token=...
=======================
```

Скопируйте эту ссылку и откройте в браузере для входа.

## 🎨 Готово к использованию!

Проект полностью настроен и готов к работе. Все страницы имеют современный дизайн с Tailwind CSS.


