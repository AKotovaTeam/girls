-- Seed posts with photos from Jane's social folder
-- This creates social media style posts with images

-- First, get the test-creator ID
DO $$
DECLARE
  creator_uuid uuid;
  post1_uuid uuid;
  post2_uuid uuid;
  post3_uuid uuid;
  post4_uuid uuid;
  post5_uuid uuid;
  post6_uuid uuid;
BEGIN
  -- Get creator ID
  SELECT id INTO creator_uuid FROM creators WHERE slug = 'test-creator' LIMIT 1;
  
  IF creator_uuid IS NULL THEN
    RAISE EXCEPTION 'Creator test-creator not found';
  END IF;

  -- Post 1: Morning vibes
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at)
  VALUES (
    creator_uuid,
    'Good morning! ☀️',
    'Starting the day with good energy and positive vibes. Hope you all have a beautiful day! ✨',
    true,
    NOW() - INTERVAL '2 days'
  )
  RETURNING id INTO post1_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post1_uuid, '/jane-social/28ac39aabec61edadd1ea7448e2386deb720fce624ddfa0ce9108f2aeb7948428f829299.jpg', 0);

  -- Post 2: Casual moment
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at)
  VALUES (
    creator_uuid,
    'Just being me 💕',
    'Sometimes the best photos are the ones where you''re just being yourself. No filters, no poses, just real moments.',
    true,
    NOW() - INTERVAL '1 day'
  )
  RETURNING id INTO post2_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post2_uuid, '/jane-social/48cc3dc7796a12d7ecfd04eb0d542b15fd5c458a28ad33510dba07aa4cc998bee342c8f3.jpg', 0);

  -- Post 3: Golden hour
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at)
  VALUES (
    creator_uuid,
    'Golden hour magic ✨',
    'There''s something magical about golden hour. The light, the mood, everything feels perfect.',
    true,
    NOW() - INTERVAL '12 hours'
  )
  RETURNING id INTO post3_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post3_uuid, '/jane-social/b8f830d98fc41bd209ef6411e8cbb6516326d73223bdfcf290fbe70ab129902c58029f79.jpg', 0);

  -- Post 4: Simple pleasures
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at)
  VALUES (
    creator_uuid,
    'Simple pleasures 🌸',
    'Finding joy in the little things. A quiet moment, good light, and being present.',
    true,
    NOW() - INTERVAL '6 hours'
  )
  RETURNING id INTO post4_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post4_uuid, '/jane-social/d82b3f85e56d14d196cddd105dffd39052788e652a8db4e15ecefeea02e95245ad087033.jpg', 0);

  -- Post 5: Weekend vibes
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at)
  VALUES (
    creator_uuid,
    'Weekend vibes 🎉',
    'Weekends are for relaxing, taking photos, and doing what makes you happy. What are you up to?',
    true,
    NOW() - INTERVAL '3 hours'
  )
  RETURNING id INTO post5_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post5_uuid, '/jane-social/d8a1397a3a681ed0397ea04426445a552bdc9e4c020d34887d3f499fb1c9f46df92875b6.jpg', 0);

  -- Post 6: Latest
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at)
  VALUES (
    creator_uuid,
    'New here! 👋',
    'Hey everyone! Thanks for being here. I''m excited to share more with you all. Stay tuned for updates!',
    true,
    NOW() - INTERVAL '1 hour'
  )
  RETURNING id INTO post6_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post6_uuid, '/jane-social/e8c430ed82e91add0e1bec9437e8580ce9bba8f700bd88e85af4926fe689a26c2a7fed10.jpg', 0);

  RAISE NOTICE 'Successfully created 6 posts with images for test-creator';
END $$;


