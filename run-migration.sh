#!/bin/bash

echo "🚀 Выполнение SQL миграции в Supabase"
echo ""

# Проверяем наличие Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI не установлен"
    echo ""
    echo "📝 Вариант 1: Установить Supabase CLI и выполнить автоматически"
    echo "   npm install -g supabase"
    echo "   Затем запустите этот скрипт снова"
    echo ""
    echo "📝 Вариант 2: Выполнить вручную через Dashboard"
    echo "   1. Откройте: https://supabase.com/dashboard"
    echo "   2. Выберите ваш проект"
    echo "   3. SQL Editor → New Query"
    echo "   4. Скопируйте содержимое: supabase/migrations/0001_init_white_label.sql"
    echo "   5. Вставьте и нажмите Run"
    echo ""
    exit 1
fi

# Получаем URL из .env.local
if [ -f ".env.local" ]; then
    SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2 | tr -d ' ')
    if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
        echo "❌ NEXT_PUBLIC_SUPABASE_URL не настроен в .env.local"
        exit 1
    fi
    echo "✅ Найден Supabase URL: $SUPABASE_URL"
else
    echo "❌ .env.local не найден"
    exit 1
fi

echo ""
echo "📋 SQL миграция будет выполнена через Supabase CLI"
echo ""
echo "⚠️  Для выполнения миграции нужна аутентификация в Supabase"
echo ""
read -p "Продолжить? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Отменено"
    exit 0
fi

echo ""
echo "Выполняю миграцию..."
echo ""

# Пытаемся выполнить через Supabase CLI
# Но для этого нужна инициализация проекта и аутентификация
if [ -f "supabase/migrations/0001_init_white_label.sql" ]; then
    echo "📄 Файл миграции найден"
    echo ""
    echo "⚠️  Для автоматического выполнения через CLI нужно:"
    echo "   1. supabase login"
    echo "   2. supabase link --project-ref <your-project-ref>"
    echo "   3. supabase db push"
    echo ""
    echo "Или выполните вручную через Dashboard (проще):"
    echo "   1. Откройте: https://supabase.com/dashboard"
    echo "   2. SQL Editor → New Query"
    echo "   3. Скопируйте SQL из: supabase/migrations/0001_init_white_label.sql"
    echo "   4. Вставьте и нажмите Run"
    echo ""
else
    echo "❌ Файл миграции не найден"
    exit 1
fi


