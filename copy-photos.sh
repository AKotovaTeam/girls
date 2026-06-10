#!/bin/bash

echo "🚀 Копирование фото из Jane 800816933/social в public/jane-social/"
echo ""

# Создаем папку
mkdir -p public/jane-social
echo "✓ Папка public/jane-social создана"

# Копируем файлы
count=0
for file in "Jane 800816933/social"/*.jpg; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    cp "$file" "public/jane-social/$filename"
    echo "✓ Скопирован: $filename"
    count=$((count + 1))
  fi
done

echo ""
echo "✅ Готово! Скопировано $count фото"
echo ""
echo "📋 Проверка:"
ls -1 public/jane-social/*.jpg 2>/dev/null | wc -l | xargs -I {} echo "   Всего файлов: {}"
echo ""
echo "🎉 Теперь можно открыть: http://test.localhost:3000/app"


