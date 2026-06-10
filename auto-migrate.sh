#!/bin/bash

echo "🚀 Автоматическая помощь с SQL миграцией"
echo ""

echo "📋 Открываю необходимые файлы и страницы..."
echo ""

# Открываем SQL файл
if [ -f "supabase/migrations/0001_init_white_label.sql" ]; then
    echo "📄 Открываю SQL файл..."
    open "supabase/migrations/0001_init_white_label.sql"
    sleep 1
else
    echo "❌ SQL файл не найден"
    exit 1
fi

# Открываем Supabase Dashboard
echo "🌐 Открываю Supabase Dashboard..."
open "https://supabase.com/dashboard"
sleep 2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Готово! Открыты:"
echo "   1. SQL файл (supabase/migrations/0001_init_white_label.sql)"
echo "   2. Supabase Dashboard → SQL Editor"
echo ""
echo "📝 Теперь выполните:"
echo "   1. В SQL файле: Cmd+A (выделить все), Cmd+C (скопировать)"
echo "   2. В Supabase Dashboard: Cmd+V (вставить), Run (или Cmd+Enter)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

