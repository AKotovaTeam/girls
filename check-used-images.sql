-- Check which images are currently used in posts
-- This helps identify which images are available

SELECT 
  p.title as post_title,
  pi.storage_path,
  COUNT(*) OVER (PARTITION BY pi.storage_path) as usage_count
FROM posts p
INNER JOIN post_images pi ON pi.post_id = p.id
WHERE p.creator_id = (SELECT id FROM creators WHERE slug = 'test-creator' LIMIT 1)
ORDER BY pi.storage_path, p.published_at DESC;


