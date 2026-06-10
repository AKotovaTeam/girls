# 🎯 Финальная настройка - Выполните эти команды

## ✅ Что уже готово:
- ✅ Зависимости установлены
- ✅ .env.local создан
- ✅ Dev сервер запущен
- ✅ Все файлы проекта на месте

## 🔧 Что нужно сделать СЕЙЧАС:

### 1. Добавьте записи в /etc/hosts

Выполните в терминале (потребуется пароль):

```bash
sudo bash -c 'echo "127.0.0.1 test.localhost" >> /etc/hosts'
sudo bash -c 'echo "127.0.0.1 admin.localhost" >> /etc/hosts'
```

Или одной командой:
```bash
sudo bash -c 'echo -e "127.0.0.1 test.localhost\n127.0.0.1 admin.localhost" >> /etc/hosts'
```

Проверьте:
```bash
grep "localhost" /etc/hosts
```

### 2. Настройте Supabase credentials

Откройте файл `.env.local` и замените значения:

```bash
# Откройте в редакторе
code .env.local
# или
nano .env.local
```

Замените:
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key из Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key из Settings → API

### 3. Выполните SQL миграцию

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в SQL Editor
4. Откройте файл: `supabase/migrations/0001_init_white_label.sql`
5. Скопируйте весь SQL код
6. Вставьте в SQL Editor
7. Нажмите Run (или Cmd/Ctrl + Enter)

### 4. Перезапустите сервер (если изменили .env.local)

Если вы изменили `.env.local`, перезапустите сервер:

```bash
# Остановите текущий (найдите процесс и убейте, или Ctrl+C в терминале где запущен)
pkill -f "next dev"

# Запустите снова
npm run dev
```

### 5. Откройте в браузере

🌐 **Главная страница:** http://test.localhost:3000

## 🎨 Что вы увидите:

1. **Красивая Landing Page** с градиентами и карточками
2. **Кнопка "Sign In"** - форма входа
3. **После входа** - Feed страница с постами
4. **Навигация** - Messages, Billing в header

## 💡 Про Magic Links:

В dev режиме magic links **логируются в консоль**, а не отправляются на email.

Когда введете email на странице Login:
1. Проверьте терминал где запущен `npm run dev`
2. Найдите строку:
   ```
   === MAGIC LINK EMAIL ===
   Link: http://test.localhost:3000/auth/callback?token=...
   ```
3. Скопируйте ссылку и откройте в браузере

## 🚀 Готово!

После выполнения всех шагов проект будет полностью работать!

## 📊 Проверка статуса:

Запустите скрипт проверки:
```bash
./check-status.sh
```


