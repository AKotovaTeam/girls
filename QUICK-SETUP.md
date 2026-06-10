# ⚡ Быстрая настройка Supabase (5 минут)

## 🎯 Пошаговая инструкция:

### 1️⃣ Создайте аккаунт (1 минута)

1. На https://supabase.com/dashboard нажмите **"Start your project"**
2. Выберите **GitHub** (быстрее) или **Email**
3. Следуйте инструкциям

### 2️⃣ Создайте проект (2 минуты)

1. Нажмите **"New Project"**
2. Заполните:
   - **Name**: "Girls Platform"
   - **Database Password**: придумайте пароль (запишите!)
   - **Region**: выберите ближайший
   - **Plan**: Free
3. Нажмите **"Create new project"**
4. Подождите 1-2 минуты

### 3️⃣ Получите credentials (1 минута)

1. **Settings** → **API**
2. Скопируйте:
   - **Project URL**
   - **anon public** key
   - **service_role secret** key

### 4️⃣ Настройте .env.local (30 секунд)

Запустите:
```bash
./setup-supabase.sh
```

Или откройте `.env.local` и вставьте значения вручную.

### 5️⃣ Выполните SQL миграцию (1 минута)

1. **SQL Editor** → **New query**
2. Откройте: `supabase/migrations/0001_init_white_label.sql`
3. Скопируйте весь код (Cmd+A, Cmd+C)
4. Вставьте в SQL Editor (Cmd+V)
5. Нажмите **Run**

## ✅ Готово!

Откройте: http://test.localhost:3000


