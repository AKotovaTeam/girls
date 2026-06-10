-- Проверка и создание test-creator
-- Выполните в Supabase Dashboard → SQL Editor

-- 1. Проверяем, есть ли creator
SELECT 
  id, 
  slug, 
  primary_domain, 
  display_name, 
  is_active,
  included_message_limit
FROM creators 
WHERE slug = 'test-creator';

-- 2. Если записи нет, создаем (или обновляем display_name на Jane)
INSERT INTO creators (slug, primary_domain, display_name, bio, included_message_limit, is_active)
VALUES (
  'test-creator',
  'test.localhost:3000',
  'Jane',
  'Welcome to my personal space! Subscribe to get access to premium photos, videos, and direct messaging.',
  20,
  true
) 
ON CONFLICT (slug) DO UPDATE
SET 
  primary_domain = EXCLUDED.primary_domain,
  display_name = 'Jane',
  is_active = true;

-- 3. Проверяем результат
SELECT 
  id, 
  slug, 
  primary_domain, 
  display_name, 
  is_active,
  included_message_limit
FROM creators 
WHERE slug = 'test-creator';
