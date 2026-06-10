-- Обновление display_name с "Test Creator" на "Jane"
-- Выполните в Supabase Dashboard → SQL Editor

-- Обновляем имя на Jane
UPDATE creators 
SET display_name = 'Jane'
WHERE slug = 'test-creator';

-- Проверяем результат
SELECT 
  id, 
  slug, 
  primary_domain, 
  display_name, 
  is_active
FROM creators 
WHERE slug = 'test-creator';

-- Должно показать: display_name = 'Jane'

