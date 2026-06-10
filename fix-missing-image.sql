-- Fix missing image path in database
-- Replace the missing file with an existing one

UPDATE post_images
SET storage_path = '/jane-social/28ac39aabec61edadd1ea7448e2386deb720fce624ddfa0ce9108f2aeb7948428f829299.jpg'
WHERE storage_path = '/jane-social/48cc3dc7796a12d7ecfd04eb0d542b15fd5c458a28ad33510dba07aa4cc998bee342c8f3.jpg';


