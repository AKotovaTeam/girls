-- Обновление приветственного сообщения с "Test Creator" на "Jane"
-- Выполните в Supabase Dashboard → SQL Editor

-- 1. Сначала обновим имя creator
UPDATE creators 
SET display_name = 'Jane'
WHERE slug = 'test-creator';

-- 2. Найдем все приветственные сообщения от creator account
-- (сообщения, которые содержат "I'm Test Creator")
UPDATE messages
SET body = REPLACE(
  body, 
  'I''m Test Creator', 
  'I''m Jane'
)
WHERE body LIKE '%I''m Test Creator%';

-- 3. Также обновим другие упоминания "Test Creator" в сообщениях
UPDATE messages
SET body = REPLACE(
  body, 
  'Test Creator', 
  'Jane'
)
WHERE body LIKE '%Test Creator%';

-- 4. Проверяем результат
SELECT 
  id,
  LEFT(body, 100) as message_preview,
  created_at
FROM messages
WHERE body LIKE '%Jane%'
ORDER BY created_at DESC
LIMIT 5;


