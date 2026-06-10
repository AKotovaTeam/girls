#!/bin/bash

echo "📸 Копирование фото из Jane 800816933/casual в public/jane-casual/"
echo ""

# Создаем папку
mkdir -p public/jane-casual
echo "✓ Папка public/jane-casual создана"

# Копируем файлы для premium постов
files=(
  "388c30d7f7491dd78ca45be581c74a3500bcef6b2e7d851f627a49472d091ce86398fbd0.jpg"
  "d8bf36ded34f13dd15a5b2f401f0f6228acf6e502f0d7cbe0964624793a9c86093b91c65.jpg"
  "28fc39fc248b1bdefb2f2c379afd62fd7e4edda52bdd7639f6eda287d3594e2ea6014376.jpg"
  "98513f07966314d8cc8ed74c0f005b2624f89ee3223d73b5c25daae75ae937e2dfe2225f.jpg"
  "68a431cefde21fd2276ccde1ac71cf5f099255022e9da17bd185ab570ba94af86b6dbdaa.jpg"
)

count=0
for file in "${files[@]}"; do
  if [ -f "Jane 800816933/casual/$file" ]; then
    cp "Jane 800816933/casual/$file" "public/jane-casual/$file"
    echo "✓ Скопирован: $file"
    count=$((count + 1))
  else
    echo "⚠️  Файл не найден: $file"
  fi
done

echo ""
echo "✅ Готово! Скопировано $count фото"
echo ""
echo "📋 Проверка:"
ls -1 public/jane-casual/*.jpg 2>/dev/null | wc -l | xargs -I {} echo "   Всего файлов: {}"
echo ""
echo "🎉 Теперь выполните SQL миграцию: supabase/migrations/0003_add_premium_posts.sql"


