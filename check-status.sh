#!/bin/bash

echo "🔍 Проверка статуса проекта..."
echo ""

# Проверка зависимостей
if [ -d "node_modules" ]; then
    echo "✅ Зависимости установлены"
else
    echo "❌ Зависимости НЕ установлены (запустите: npm install)"
fi

# Проверка .env.local
if [ -f ".env.local" ]; then
    echo "✅ .env.local файл существует"
    if grep -q "your-project.supabase.co" .env.local; then
        echo "⚠️  .env.local содержит заглушки - замените на реальные Supabase credentials"
    else
        echo "✅ .env.local настроен"
    fi
else
    echo "❌ .env.local НЕ найден"
fi

# Проверка сервера
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Dev сервер запущен на порту 3000"
    echo "   Откройте: http://localhost:3000"
else
    echo "⚠️  Dev сервер НЕ запущен (запустите: npm run dev)"
fi

# Проверка hosts
echo ""
echo "📋 Проверка /etc/hosts:"
if grep -q "test.localhost" /etc/hosts 2>/dev/null; then
    echo "✅ test.localhost настроен"
    echo "   Откройте: http://test.localhost:3000"
else
    echo "⚠️  test.localhost НЕ настроен"
    echo "   Выполните: sudo bash -c 'echo \"127.0.0.1 test.localhost\" >> /etc/hosts'"
fi

if grep -q "admin.localhost" /etc/hosts 2>/dev/null; then
    echo "✅ admin.localhost настроен"
else
    echo "⚠️  admin.localhost НЕ настроен"
    echo "   Выполните: sudo bash -c 'echo \"127.0.0.1 admin.localhost\" >> /etc/hosts'"
fi

echo ""
echo "📝 Следующие шаги:"
echo "1. Настройте .env.local с реальными Supabase credentials"
echo "2. Выполните SQL миграцию в Supabase Dashboard"
echo "3. Откройте http://test.localhost:3000 в браузере"


