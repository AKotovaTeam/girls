-- Fix duplicate image by using an image from jane-landing folder
-- Since we have only 5 files in jane-social but 6 posts, we'll use an image from jane-landing
-- This image is only used for avatar, so it won't create a duplicate in posts

DO $$
DECLARE
  creator_uuid uuid;
  post_to_fix_id uuid;
  current_image_path text;
BEGIN
  -- Get creator ID
  SELECT id INTO creator_uuid FROM creators WHERE slug = 'test-creator' LIMIT 1;
  
  IF creator_uuid IS NULL THEN
    RAISE EXCEPTION 'Creator test-creator not found';
  END IF;

  -- Find the post that needs fixing (the one with duplicate image)
  SELECT p.id, pi.storage_path INTO post_to_fix_id, current_image_path
  FROM posts p
  INNER JOIN post_images pi ON pi.post_id = p.id
  WHERE p.creator_id = creator_uuid
    AND p.title = 'Just being me 💕'
  LIMIT 1;

  IF post_to_fix_id IS NULL THEN
    RAISE NOTICE 'Post "Just being me 💕" not found';
    RETURN;
  END IF;

  -- Use the second image from jane-landing (not used in posts, only for avatar)
  -- This image: 88ca33a0a20e14dbca18e56246efb989e078f5ba002d7b96f4d43fafb139173fb8852cd2-2.jpg
  UPDATE post_images
  SET storage_path = '/jane-landing/88ca33a0a20e14dbca18e56246efb989e078f5ba002d7b96f4d43fafb139173fb8852cd2-2.jpg'
  WHERE post_id = post_to_fix_id
    AND storage_path = current_image_path;
  
  RAISE NOTICE 'Updated post image from % to /jane-landing/88ca33a0a20e14dbca18e56246efb989e078f5ba002d7b96f4d43fafb139173fb8852cd2-2.jpg', current_image_path;
END $$;
