#!/bin/bash

echo "🔧 Добавление записей в /etc/hosts..."
echo ""

# Проверяем, есть ли уже записи
if grep -q "test.localhost" /etc/hosts 2>/dev/null; then
    echo "✅ test.localhost уже добавлен в /etc/hosts"
else
    echo "Добавляю test.localhost..."
    echo "127.0.0.1 test.localhost" | sudo tee -a /etc/hosts
    if [ $? -eq 0 ]; then
        echo "✅ test.localhost добавлен"
    else
        echo "❌ Ошибка при добавлении test.localhost"
        exit 1
    fi
fi

if grep -q "admin.localhost" /etc/hosts 2>/dev/null; then
    echo "✅ admin.localhost уже добавлен в /etc/hosts"
else
    echo "Добавляю admin.localhost..."
    echo "127.0.0.1 admin.localhost" | sudo tee -a /etc/hosts
    if [ $? -eq 0 ]; then
        echo "✅ admin.localhost добавлен"
    else
        echo "❌ Ошибка при добавлении admin.localhost"
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Готово! Записи добавлены в /etc/hosts"
echo ""
echo "Проверка:"
grep -E "test.localhost|admin.localhost" /etc/hosts | tail -2
echo ""
echo "🌐 Теперь можно открыть:"
echo "   http://test.localhost:3000"
echo "   http://admin.localhost:3000"
echo ""


