#!/bin/bash

echo "🔧 Исправление проблем и финальная настройка..."
echo ""

# Исправление прав доступа к node_modules
echo "1️⃣  Исправление прав доступа..."
if [ -d "node_modules" ]; then
    chmod -R u+r node_modules 2>/dev/null
    echo "✅ Права доступа исправлены"
else
    echo "⚠️  node_modules не найден, запустите: npm install"
fi

echo ""

# Добавление в /etc/hosts
echo "2️⃣  Добавление в /etc/hosts..."

if ! grep -q "test.localhost" /etc/hosts 2>/dev/null; then
    echo "Введите пароль для добавления test.localhost в /etc/hosts:"
    echo "127.0.0.1 test.localhost" | sudo tee -a /etc/hosts
fi

if ! grep -q "admin.localhost" /etc/hosts 2>/dev/null; then
    echo "Введите пароль для добавления admin.localhost в /etc/hosts:"
    echo "127.0.0.1 admin.localhost" | sudo tee -a /etc/hosts
fi

echo ""

# Проверка .env.local
echo "3️⃣  Проверка .env.local..."
if [ -f ".env.local" ]; then
    if grep -q "your-project.supabase.co" .env.local; then
        echo "⚠️  ВАЖНО: Откройте .env.local и замените значения на реальные из Supabase!"
        echo ""
        echo "Где найти:"
        echo "  - Supabase Dashboard → Settings → API"
        echo "  - Скопируйте Project URL, anon key, service_role key"
    else
        echo "✅ .env.local настроен"
    fi
else
    echo "❌ .env.local не найден"
fi

echo ""

# Перезапуск сервера
echo "4️⃣  Перезапуск dev сервера..."
pkill -f "next dev" 2>/dev/null
sleep 2
echo "Запускаю сервер..."
npm run dev &
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📝 СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1. Настройте .env.local с реальными Supabase credentials"
echo "2. Выполните SQL миграцию в Supabase Dashboard:"
echo "   - Откройте: supabase/migrations/0001_init_white_label.sql"
echo "   - Скопируйте SQL код"
echo "   - Вставьте в Supabase Dashboard → SQL Editor → Run"
echo ""
echo "3. Откройте в браузере:"
echo "   🌐 http://test.localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


