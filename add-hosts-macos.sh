#!/bin/bash

echo "🔧 Добавление записей в /etc/hosts для macOS..."
echo ""

# Проверяем, есть ли уже записи
if grep -q "test.localhost" /etc/hosts 2>/dev/null; then
    echo "✅ test.localhost уже добавлен"
    TEST_EXISTS=true
else
    TEST_EXISTS=false
fi

if grep -q "admin.localhost" /etc/hosts 2>/dev/null; then
    echo "✅ admin.localhost уже добавлен"
    ADMIN_EXISTS=true
else
    ADMIN_EXISTS=false
fi

if [ "$TEST_EXISTS" = true ] && [ "$ADMIN_EXISTS" = true ]; then
    echo ""
    echo "✅ Все записи уже добавлены в /etc/hosts"
    echo ""
    grep -E "test.localhost|admin.localhost" /etc/hosts | tail -2
    exit 0
fi

echo ""
echo "Добавляю записи в /etc/hosts..."
echo "Система запросит пароль администратора"
echo ""

# Используем osascript для запроса пароля на macOS
if [ "$TEST_EXISTS" = false ]; then
    echo "127.0.0.1 test.localhost" | sudo tee -a /etc/hosts > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ test.localhost добавлен"
    else
        echo "❌ Ошибка: не удалось добавить test.localhost"
        echo "   Попробуйте выполнить вручную:"
        echo "   sudo bash -c 'echo \"127.0.0.1 test.localhost\" >> /etc/hosts'"
    fi
fi

if [ "$ADMIN_EXISTS" = false ]; then
    echo "127.0.0.1 admin.localhost" | sudo tee -a /etc/hosts > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ admin.localhost добавлен"
    else
        echo "❌ Ошибка: не удалось добавить admin.localhost"
        echo "   Попробуйте выполнить вручную:"
        echo "   sudo bash -c 'echo \"127.0.0.1 admin.localhost\" >> /etc/hosts'"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Проверка результата:"
grep -E "test.localhost|admin.localhost" /etc/hosts | tail -2
echo ""
echo "🌐 Теперь можно открыть:"
echo "   http://test.localhost:3000"
echo "   http://admin.localhost:3000"
echo ""


