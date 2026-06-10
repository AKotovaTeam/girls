-- Remove duplicate post that uses the same image as post 1
-- This removes the post with the fixed image path that now duplicates post 1

DO $$
DECLARE
  creator_uuid uuid;
  duplicate_post_id uuid;
BEGIN
  -- Get creator ID
  SELECT id INTO creator_uuid FROM creators WHERE slug = 'test-creator' LIMIT 1;
  
  IF creator_uuid IS NULL THEN
    RAISE EXCEPTION 'Creator test-creator not found';
  END IF;

  -- Find the post that uses the same image as the first post
  -- (the one that was fixed from the missing image)
  SELECT p.id INTO duplicate_post_id
  FROM posts p
  INNER JOIN post_images pi ON pi.post_id = p.id
  WHERE p.creator_id = creator_uuid
    AND p.title = 'Just being me 💕'
    AND pi.storage_path = '/jane-social/28ac39aabec61edadd1ea7448e2386deb720fce624ddfa0ce9108f2aeb7948428f829299.jpg'
  LIMIT 1;

  -- Delete the duplicate post (images will be deleted automatically due to CASCADE)
  IF duplicate_post_id IS NOT NULL THEN
    DELETE FROM posts WHERE id = duplicate_post_id;
    RAISE NOTICE 'Deleted duplicate post with id: %', duplicate_post_id;
  ELSE
    RAISE NOTICE 'No duplicate post found';
  END IF;
END $$;


