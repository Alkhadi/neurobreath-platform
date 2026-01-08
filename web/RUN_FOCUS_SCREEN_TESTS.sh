#!/usr/bin/env bash
#
# One-Shot Command to Run All Focus Screen Tests
# 
# This script:
# 1. Ensures dependencies are installed
# 2. Installs Playwright browsers if needed
# 3. Runs E2E tests (assumes dev server running on :3000)
# 4. Shows where screenshots were saved
#

set -e

echo "🎯 NeuroBreath Focus Screens - Responsive Testing Suite"
echo "=========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this from /web directory."
  exit 1
fi

echo "📦 Step 1: Installing dependencies (if needed)..."
yarn install --frozen-lockfile --silent 2>/dev/null || yarn install

echo ""
echo "🎭 Step 2: Installing Playwright browsers (if needed)..."
yarn playwright install chromium --with-deps 2>&1 | grep -E "downloaded|already|Chromium" || true

echo ""
echo "🏗️  Step 3: Type checking..."
yarn tsc --noEmit

echo ""
echo "🧪 Step 4: Running E2E tests..."
echo "   (Assuming dev server running on http://localhost:3000)"
echo "   (Use SKIP_SERVER=1 if server already running, or remove to auto-start)"
echo ""

# Run tests
SKIP_SERVER=1 yarn test:e2e

echo ""
echo "✅ Tests Complete!"
echo ""
echo "📸 Screenshots saved to:"
ls -lh tests/screenshots/*.png 2>/dev/null || echo "   (No screenshots found - tests may have failed)"

echo ""
echo "📊 To view detailed HTML report:"
echo "   yarn playwright show-report"
echo ""
echo "🎨 To run tests with UI mode:"
echo "   SKIP_SERVER=1 yarn test:e2e:ui"
echo ""
echo "🐛 To debug failing tests:"
echo "   SKIP_SERVER=1 yarn test:e2e:debug"
