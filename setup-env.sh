#!/bin/bash

# Скрипт для настройки .env.local

echo "🔧 Настройка .env.local файла..."

cat > .env.local << 'EOF'
# Supabase Configuration
# ⚠️ ЗАМЕНИТЕ НА РЕАЛЬНЫЕ ЗНАЧЕНИЯ ИЗ ВАШЕГО SUPABASE ПРОЕКТА
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Host
ADMIN_HOST=admin.localhost:3000
EOF

echo "✅ .env.local файл создан!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Откройте .env.local и замените значения на реальные из Supabase"
echo "2. Выполните SQL миграцию в Supabase Dashboard"
echo "3. Добавьте в /etc/hosts: 127.0.0.1 test.localhost"
echo "4. Откройте http://test.localhost:3000"


