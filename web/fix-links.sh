#!/bin/bash
# Fix Next.js Link usage in legal pages

for file in app/uk/legal/**/*.tsx app/us/legal/**/*.tsx components/consent/*.tsx components/legal/*.tsx; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Check if file already imports Link
    if ! grep -q "^import Link from ['\"]next/link['\"]" "$file"; then
      # Add Link import after React import or at the top
      if grep -q "^import.*from ['\"]react['\"]" "$file"; then
        sed -i '' '/^import.*from ['\''"]react['\''"]/a\
import Link from "next/link";
' "$file"
      else
        # Add at very top after any 'use client' directive
        if grep -q "^['\"]use client['\"]" "$file"; then
          sed -i '' '/^['\''"]use client['\''"]/a\
\
import Link from "next/link";
' "$file"
        else
          sed -i '' '1i\
import Link from "next/link";\
' "$file"
        fi
      fi
    fi
    
    # Convert <a href="/path"> to <Link href="/path">
    # Match opening tags
    sed -i '' 's|<a href="\(/[^"]*\)">|<Link href="\1">|g' "$file"
    
    # Convert closing tags
    sed -i '' 's|</a>|</Link>|g' "$file"
    
    echo "  ✓ Done"
  fi
done

echo ""
echo "All files processed!"
