#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Настройка Feed с фото и постами\n')

// Step 1: Copy photos
console.log('📸 Шаг 1: Копирование фото...')
const sourceDir = path.join(__dirname, 'Jane 800816933', 'social')
const destDir = path.join(__dirname, 'public', 'jane-social')

try {
  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  // Copy files
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.jpg'))
  let count = 0
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file)
    const destPath = path.join(destDir, file)
    fs.copyFileSync(sourcePath, destPath)
    console.log(`  ✓ ${file}`)
    count++
  }

  console.log(`\n✅ Скопировано ${count} фото в public/jane-social/\n`)
} catch (error) {
  console.error('❌ Ошибка при копировании фото:', error.message)
  process.exit(1)
}

// Step 2: SQL Migration instructions
console.log('📝 Шаг 2: Выполнение SQL миграции\n')
console.log('⚠️  SQL миграцию нужно выполнить вручную через Supabase Dashboard\n')
console.log('📋 Инструкция:')
console.log('   1. Откройте: https://supabase.com/dashboard')
console.log('   2. Выберите ваш проект')
console.log('   3. Перейдите в SQL Editor (в левом меню)')
console.log('   4. Нажмите "New query"')
console.log('   5. Откройте файл: supabase/migrations/0002_seed_jane_posts.sql')
console.log('   6. Скопируйте весь SQL код (Cmd+A, Cmd+C)')
console.log('   7. Вставьте в SQL Editor (Cmd+V)')
console.log('   8. Нажмите "Run" (или Cmd+Enter)\n')
console.log('✅ После выполнения вы увидите:')
console.log('   - Success message')
console.log('   - 6 новых постов в таблице posts')
console.log('   - 6 изображений в таблице post_images\n')

// Try to open the SQL file
const sqlFile = path.join(__dirname, 'supabase', 'migrations', '0002_seed_jane_posts.sql')
if (fs.existsSync(sqlFile)) {
  console.log('💡 Открываю SQL файл для вас...\n')
  try {
    // Try to open with default editor
    if (process.platform === 'darwin') {
      execSync(`open "${sqlFile}"`, { stdio: 'ignore' })
    } else if (process.platform === 'win32') {
      execSync(`start "" "${sqlFile}"`, { stdio: 'ignore' })
    } else {
      execSync(`xdg-open "${sqlFile}"`, { stdio: 'ignore' })
    }
  } catch (e) {
    // Ignore errors
  }
}

console.log('🎉 Готово! После выполнения SQL миграции:')
console.log('   - Откройте: http://test.localhost:3000/app')
console.log('   - Войдите в систему')
console.log('   - Вы увидите 6 постов с фото в стиле соцсетей!\n')


