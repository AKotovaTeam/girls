#!/bin/bash

echo "🔧 Настройка Supabase credentials в .env.local"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Проверяем существование файла
if [ ! -f ".env.local" ]; then
    echo "Создаю .env.local..."
    touch .env.local
fi

# Проверяем текущие значения
if grep -q "your-project.supabase.co" .env.local; then
    echo "⚠️  .env.local содержит заглушки"
    echo ""
    echo "📝 Где найти Supabase credentials:"
    echo ""
    echo "1. Откройте: https://supabase.com/dashboard"
    echo "2. Выберите ваш проект (или создайте новый)"
    echo "3. Перейдите в: Settings → API"
    echo "4. Скопируйте следующие значения:"
    echo ""
    echo "   - Project URL → NEXT_PUBLIC_SUPABASE_URL"
    echo "   - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - service_role secret key → SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "Введите NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
    read -p "Введите NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
    read -p "Введите SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_KEY
    
    echo ""
    echo "Сохраняю значения в .env.local..."
    
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}

# Admin Host
ADMIN_HOST=admin.localhost:3000
EOF
    
    echo ""
    echo "✅ .env.local обновлен!"
    echo ""
    echo "Проверка:"
    echo "NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL:0:30}..."
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:30}..."
    echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_KEY:0:30}..."
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📝 Следующий шаг: Выполните SQL миграцию в Supabase Dashboard"
    echo "   Файл: supabase/migrations/0001_init_white_label.sql"
    echo ""
else
    echo "✅ .env.local уже настроен"
    echo ""
    echo "Текущие значения:"
    grep -E "NEXT_PUBLIC_SUPABASE|SUPABASE_SERVICE" .env.local | sed 's/=.*/=***/' 
    echo ""
    read -p "Хотите обновить? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Введите NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
        read -p "Введите NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
        read -p "Введите SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_KEY
        
        cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}

# Admin Host
ADMIN_HOST=admin.localhost:3000
EOF
        
        echo "✅ .env.local обновлен!"
    fi
fi


