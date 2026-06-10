#!/bin/bash

# Скрипт для добавления записей в /etc/hosts

echo "🔧 Настройка /etc/hosts для локальной разработки..."

HOSTS_FILE="/etc/hosts"
HOSTS_ENTRIES="127.0.0.1 test.localhost
127.0.0.1 admin.localhost"

# Проверяем, есть ли уже записи
if grep -q "test.localhost" "$HOSTS_FILE" 2>/dev/null; then
    echo "✅ Записи для test.localhost уже существуют в /etc/hosts"
else
    echo ""
    echo "📝 Нужно добавить следующие строки в /etc/hosts:"
    echo ""
    echo "$HOSTS_ENTRIES"
    echo ""
    echo "Выполните команду (потребуется пароль):"
    echo "sudo bash -c 'echo \"$HOSTS_ENTRIES\" >> /etc/hosts'"
    echo ""
    read -p "Выполнить сейчас? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo bash -c "echo \"$HOSTS_ENTRIES\" >> $HOSTS_FILE"
        echo "✅ Записи добавлены в /etc/hosts"
    else
        echo "⚠️  Добавьте записи вручную"
    fi
fi


