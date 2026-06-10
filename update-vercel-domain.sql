-- После деплоя на Vercel: замените домен на ваш Vercel URL
-- Пример: girls-abc123.vercel.app

UPDATE creators
SET primary_domain = 'YOUR-APP.vercel.app'
WHERE slug = 'test-creator';

SELECT slug, primary_domain FROM creators WHERE slug = 'test-creator';
