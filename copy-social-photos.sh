#!/bin/bash

# Copy photos from Jane's social folder to public/jane-social

mkdir -p public/jane-social

echo "📸 Copying photos from Jane 800816933/social to public/jane-social/..."

for file in "Jane 800816933/social"/*.jpg; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    cp "$file" "public/jane-social/$filename"
    echo "✓ $filename"
  fi
done

count=$(ls public/jane-social/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "✅ Done! Copied $count photos to public/jane-social/"


