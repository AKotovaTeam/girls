# Быстрый старт

## 1. Установка зависимостей

```bash
npm install
```

## 2. Настройка окружения

Создайте `.env.local` файл:

```bash
cp .env.local.example .env.local
```

Заполните:
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key из Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key из Supabase (секретный!)
- `ADMIN_HOST` - Админ хост (по умолчанию: `admin.localhost:3000`)

## 3. Настройка базы данных

1. Откройте Supabase Dashboard → SQL Editor
2. Скопируйте содержимое `supabase/migrations/0001_init_white_label.sql`
3. Вставьте и выполните в SQL Editor

Это создаст все таблицы и добавит тестового creator с доменом `test.localhost:3000`.

## 4. Настройка hosts (для локальной разработки)

Добавьте в `/etc/hosts` (macOS/Linux) или `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 test.localhost
127.0.0.1 admin.localhost
```

## 5. Запуск

```bash
npm run dev
```

Откройте в браузере: `http://test.localhost:3000`

## 6. Тестирование

1. **Landing Page**: `http://test.localhost:3000` - красивая главная страница
2. **Login**: Нажмите "Sign In", введите email
3. **Magic Link**: Проверьте консоль терминала (где запущен `npm run dev`) - там будет ссылка для входа
4. **Feed**: После входа вы попадете на `/app` - страницу с постами
5. **Messages**: Перейдите в Messages через меню
6. **Billing**: Перейдите в Billing для просмотра подписки и кредитов

## Важно!

- Magic links в режиме разработки **не отправляются на email**, а логируются в консоль сервера
- Скопируйте ссылку из консоли и откройте в браузере
- Все страницы имеют современный дизайн с Tailwind CSS
- Навигация работает через Header компонент

## Структура MVP

✅ **Реализовано:**
- Красивый дизайн с Tailwind CSS
- Landing page с градиентами и карточками
- Feed страница для постов
- Messages страница для разговоров
- Billing страница с информацией о подписке и кредитах
- Magic-link аутентификация
- Logout функционал
- Responsive дизайн

🚧 **В разработке (следующие фазы):**
- Stripe интеграция для подписок
- Реальная отправка email
- Загрузка и отображение медиа
- Функционал отправки сообщений
- Chat packs покупка


