#!/bin/bash
echo "🔍 Git Push Verification"
echo "========================"
echo ""

echo "1. Branch tracking status:"
git branch -vv
echo ""

echo "2. Remote connection details:"
git remote show origin
echo ""

echo "3. Verify no unpushed commits:"
UNPUSHED=$(git log origin/main..main --oneline 2>/dev/null | wc -l)
if [ "$UNPUSHED" -eq 0 ]; then
    echo "   ✅ All commits pushed successfully"
else
    echo "   ⚠️  $UNPUSHED commit(s) still not pushed"
fi
echo ""

echo "4. Latest remote commit:"
git log origin/main -n 1 --oneline 2>/dev/null || echo "   (Will show after first push)"
echo ""

echo "✅ Verification complete! Check GitHub.com to confirm:"
echo "   https://github.com/Alkhadi/neurobreath-platform"
