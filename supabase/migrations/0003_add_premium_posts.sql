-- Add requires_subscription column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS requires_subscription boolean NOT NULL DEFAULT false;

-- Create index for premium posts
CREATE INDEX IF NOT EXISTS idx_posts_requires_subscription ON posts(creator_id, requires_subscription, is_published);

-- Seed premium posts with photos from Jane's casual folder
-- These posts require subscription to view

DO $$
DECLARE
  creator_uuid uuid;
  post1_uuid uuid;
  post2_uuid uuid;
  post3_uuid uuid;
  post4_uuid uuid;
  post5_uuid uuid;
  post6_uuid uuid;
  post7_uuid uuid;
  post8_uuid uuid;
  post9_uuid uuid;
  post10_uuid uuid;
BEGIN
  -- Get creator ID
  SELECT id INTO creator_uuid FROM creators WHERE slug = 'test-creator' LIMIT 1;
  
  IF creator_uuid IS NULL THEN
    RAISE EXCEPTION 'Creator test-creator not found';
  END IF;

  -- Post 1: Naughty casual moment
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Feeling playful tonight 😈',
    'Sometimes I just want to tease a little... hope you like what you see 💋',
    true,
    NOW() - INTERVAL '5 days',
    true
  )
  RETURNING id INTO post1_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post1_uuid, '/jane-casual/388c30d7f7491dd78ca45be581c74a3500bcef6b2e7d851f627a49472d091ce86398fbd0.jpg', 0);

  -- Post 2: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Just thinking about you... 💭',
    'Wondering what you''d do if you were here right now. My mind is wandering... 😏',
    true,
    NOW() - INTERVAL '4 days',
    true
  )
  RETURNING id INTO post2_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post2_uuid, '/jane-casual/d8bf36ded34f13dd15a5b2f401f0f6228acf6e502f0d7cbe0964624793a9c86093b91c65.jpg', 0);

  -- Post 3: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Can''t help myself 🔥',
    'I know I shouldn''t, but I love showing off a little. You make me feel so confident...',
    true,
    NOW() - INTERVAL '3 days',
    true
  )
  RETURNING id INTO post3_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post3_uuid, '/jane-casual/28fc39fc248b1bdefb2f2c379afd62fd7e4edda52bdd7639f6eda287d3594e2ea6014376.jpg', 0);

  -- Post 4: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Late night thoughts 💭',
    'It''s getting late and I''m feeling a little naughty. What would you do if you were here? 😈',
    true,
    NOW() - INTERVAL '2 days',
    true
  )
  RETURNING id INTO post4_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post4_uuid, '/jane-casual/98513f07966314d8cc8ed74c0f005b2624f89ee3223d73b5c25daae75ae937e2dfe2225f.jpg', 0);

  -- Post 5: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Feeling bold today ✨',
    'Sometimes I just want to be a little daring. Hope you''re enjoying the view... 💕',
    true,
    NOW() - INTERVAL '1 day',
    true
  )
  RETURNING id INTO post5_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post5_uuid, '/jane-casual/68a431cefde21fd2276ccde1ac71cf5f099255022e9da17bd185ab570ba94af86b6dbdaa.jpg', 0);

  -- Post 6: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Missing you already 💋',
    'Wish you were here to see this... I''m thinking about you and it''s making me feel things 😈',
    true,
    NOW() - INTERVAL '18 hours',
    true
  )
  RETURNING id INTO post6_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post6_uuid, '/jane-casual/08903f6eecb019d4a500e3f932eff54fdd2ce6272efdba8c9190699a88097ea6ea106802.jpg', 0);

  -- Post 7: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'You make me feel so good ✨',
    'Knowing you''re watching makes me want to show you more... I love how you make me feel confident 💕',
    true,
    NOW() - INTERVAL '12 hours',
    true
  )
  RETURNING id INTO post7_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post7_uuid, '/jane-casual/08f4345e0e841bdcee5e60efa82e77db5e48cd942cad7ad97418f00a9ed9ef5f4cae5731.jpg', 0);

  -- Post 8: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Can''t stop thinking... 💭',
    'My mind keeps wandering to places it shouldn''t. You have that effect on me... 🔥',
    true,
    NOW() - INTERVAL '8 hours',
    true
  )
  RETURNING id INTO post8_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post8_uuid, '/jane-casual/283c37fce0bb19dbf843453c5ee563b966807a37077d9d8ee33630efe869759ebc2c1277.jpg', 0);

  -- Post 9: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Feeling a little wild tonight 🌙',
    'It''s one of those nights where I just want to let loose. Hope you''re ready for this... 😏',
    true,
    NOW() - INTERVAL '4 hours',
    true
  )
  RETURNING id INTO post9_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post9_uuid, '/jane-casual/58c63daca98910d90532786a5a21354b2ea97eee0c7d3c73904194cf7539053c73e0ae33.jpg', 0);

  -- Post 10: Naughty casual
  INSERT INTO posts (creator_id, title, body_md, is_published, published_at, requires_subscription)
  VALUES (
    creator_uuid,
    'Just for you 💋',
    'I took this thinking about what you might like to see... hope it lives up to your expectations 😈',
    true,
    NOW() - INTERVAL '2 hours',
    true
  )
  RETURNING id INTO post10_uuid;
  
  INSERT INTO post_images (post_id, storage_path, sort_order)
  VALUES (post10_uuid, '/jane-casual/68e233e5097a1ed50e4a52ed83d4bd8eabe9eac6267d90a024ec267a8c8916db31050e96.jpg', 0);

  RAISE NOTICE 'Successfully created 10 premium posts with images for test-creator';
END $$;

