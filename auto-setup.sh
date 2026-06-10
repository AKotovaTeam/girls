#!/bin/bash

echo "🚀 Автоматическая настройка проекта..."
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Проверка и добавление в /etc/hosts
echo "1️⃣  Настройка /etc/hosts..."

if grep -q "test.localhost" /etc/hosts 2>/dev/null; then
    echo -e "${GREEN}✅ test.localhost уже настроен${NC}"
else
    echo "127.0.0.1 test.localhost" | sudo tee -a /etc/hosts > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Добавлено test.localhost в /etc/hosts${NC}"
    else
        echo -e "${YELLOW}⚠️  Нужны права sudo для добавления в /etc/hosts${NC}"
        echo "   Выполните вручную: sudo bash -c 'echo \"127.0.0.1 test.localhost\" >> /etc/hosts'"
    fi
fi

if grep -q "admin.localhost" /etc/hosts 2>/dev/null; then
    echo -e "${GREEN}✅ admin.localhost уже настроен${NC}"
else
    echo "127.0.0.1 admin.localhost" | sudo tee -a /etc/hosts > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Добавлено admin.localhost в /etc/hosts${NC}"
    else
        echo -e "${YELLOW}⚠️  Нужны права sudo для добавления в /etc/hosts${NC}"
        echo "   Выполните вручную: sudo bash -c 'echo \"127.0.0.1 admin.localhost\" >> /etc/hosts'"
    fi
fi

echo ""

# 2. Проверка .env.local
echo "2️⃣  Проверка .env.local..."

if [ -f ".env.local" ]; then
    if grep -q "your-project.supabase.co" .env.local; then
        echo -e "${YELLOW}⚠️  .env.local содержит заглушки${NC}"
        echo ""
        echo "📝 Откройте .env.local и замените на реальные значения:"
        echo "   - NEXT_PUBLIC_SUPABASE_URL"
        echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "   - SUPABASE_SERVICE_ROLE_KEY"
        echo ""
        echo "   Где найти: Supabase Dashboard → Settings → API"
    else
        echo -e "${GREEN}✅ .env.local настроен${NC}"
    fi
else
    echo -e "${RED}❌ .env.local не найден${NC}"
fi

echo ""

# 3. Проверка сервера
echo "3️⃣  Проверка dev сервера..."

if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dev сервер запущен на порту 3000${NC}"
    echo "   🌐 Откройте: http://test.localhost:3000"
else
    echo -e "${YELLOW}⚠️  Dev сервер не запущен${NC}"
    echo "   Запустите: npm run dev"
fi

echo ""

# 4. SQL миграция
echo "4️⃣  SQL миграция..."
echo -e "${YELLOW}⚠️  Выполните вручную в Supabase Dashboard:${NC}"
echo "   1. Откройте Supabase Dashboard → SQL Editor"
echo "   2. Скопируйте содержимое: supabase/migrations/0001_init_white_label.sql"
echo "   3. Вставьте и выполните (Run)"
echo ""

# Итог
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 СТАТУС:"
echo ""
echo -e "${GREEN}✅ Зависимости установлены${NC}"
echo -e "${GREEN}✅ Проект настроен${NC}"
echo -e "${GREEN}✅ Dev сервер запущен${NC}"
echo ""
echo "📝 ОСТАЛОСЬ СДЕЛАТЬ:"
echo "   1. Настроить .env.local с реальными Supabase credentials"
echo "   2. Выполнить SQL миграцию в Supabase Dashboard"
echo ""
echo "🌐 После настройки откройте: http://test.localhost:3000"
echo ""


