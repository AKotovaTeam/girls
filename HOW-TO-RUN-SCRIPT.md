# 🚀 Как запустить интерактивный скрипт setup-supabase.sh

## 📍 Шаг 1: Откройте терминал

На macOS:
- Нажмите `Cmd + Space` (Spotlight)
- Введите "Terminal"
- Нажмите Enter

Или:
- Applications → Utilities → Terminal

## 📍 Шаг 2: Перейдите в папку проекта

```bash
cd /Users/alyona/Cursor_project/Girls
```

## 📍 Шаг 3: Запустите скрипт

```bash
./setup-supabase.sh
```

## 📍 Шаг 4: Следуйте инструкциям

Скрипт покажет, где найти Supabase credentials, и попросит ввести:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Откройте: https://supabase.com/dashboard
   - Settings → API
   - Скопируйте **Project URL**
   - Вставьте в терминал и нажмите Enter

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - В том же разделе Settings → API
   - Скопируйте **anon public** key
   - Вставьте в терминал и нажмите Enter

3. **SUPABASE_SERVICE_ROLE_KEY**
   - В том же разделе Settings → API
   - Скопируйте **service_role secret** key
   - Вставьте в терминал и нажмите Enter

## ✅ Готово!

Скрипт автоматически сохранит все значения в `.env.local`

## 🔍 Проверка

После выполнения проверьте:

```bash
cat .env.local
```

Убедитесь, что все три значения заполнены реальными данными (не "your-project").

## 📝 Пример того, что вы увидите:

```
🔧 Настройка Supabase credentials в .env.local

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  .env.local содержит заглушки

📝 Где найти Supabase credentials:
...

Введите NEXT_PUBLIC_SUPABASE_URL: [здесь вставьте URL]
Введите NEXT_PUBLIC_SUPABASE_ANON_KEY: [здесь вставьте anon key]
Введите SUPABASE_SERVICE_ROLE_KEY: [здесь вставьте service_role key]

✅ .env.local обновлен!
```

## 🆘 Если скрипт не запускается

Сделайте его исполняемым:

```bash
chmod +x setup-supabase.sh
./setup-supabase.sh
```


