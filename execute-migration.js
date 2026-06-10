const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Читаем .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Не найдены Supabase credentials в .env.local');
  console.error('Убедитесь, что файл .env.local содержит:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Проверяем, что это не заглушки
if (supabaseUrl.includes('your-project') || serviceRoleKey.includes('your_service')) {
  console.error('❌ .env.local содержит заглушки, а не реальные значения');
  process.exit(1);
}

console.log('🔧 Подключение к Supabase...');
console.log(`URL: ${supabaseUrl.substring(0, 30)}...`);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Читаем SQL файл
const sqlFile = path.join(__dirname, 'supabase/migrations/0001_init_white_label.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('📄 SQL файл прочитан');
console.log(`Размер: ${sql.length} символов`);

// Supabase JS client не поддерживает выполнение произвольного SQL напрямую
// Нужно использовать RPC или напрямую подключиться к PostgreSQL
console.log('');
console.log('⚠️  Supabase JS client не поддерживает выполнение произвольного SQL');
console.log('');
console.log('📝 Альтернативные варианты:');
console.log('');
console.log('1. Используйте Supabase Dashboard (рекомендуется):');
console.log('   - Откройте: https://supabase.com/dashboard');
console.log('   - SQL Editor → New Query');
console.log('   - Вставьте SQL из: supabase/migrations/0001_init_white_label.sql');
console.log('   - Run');
console.log('');
console.log('2. Установите Supabase CLI:');
console.log('   npm install -g supabase');
console.log('   supabase login');
console.log('   supabase link --project-ref <your-project-ref>');
console.log('   supabase db push');
console.log('');
console.log('3. Используйте psql напрямую (если есть доступ к БД)');

process.exit(0);


