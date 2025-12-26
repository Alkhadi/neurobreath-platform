#!/bin/bash
echo "🔧 Git Credential Helper Setup"
echo "==============================="
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected: macOS"
    echo "Setting up macOS Keychain helper..."
    git config --global credential.helper osxkeychain
    echo "✅ Credentials will be stored in macOS Keychain"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected: Linux"
    echo "Setting up memory cache (8 hours)..."
    git config --global credential.helper 'cache --timeout=28800'
    echo "✅ Credentials will be cached in memory for 8 hours"
else
    echo "Unknown OS: $OSTYPE"
    echo "Setting up memory cache (8 hours) as fallback..."
    git config --global credential.helper 'cache --timeout=28800'
    echo "✅ Credentials will be cached in memory for 8 hours"
fi

echo ""
echo "Current credential helper:"
git config --global credential.helper

echo ""
echo "📝 Alternative: Store PAT in remote URL"
echo "========================================"
echo "If you prefer to store PAT directly (less secure but convenient):"
echo ""
echo "  git remote set-url origin https://Alkhadi:YOUR_PAT@github.com/Alkhadi/neurobreath-platform.git"
echo ""
echo "⚠️  Note: PAT will be visible in .git/config"
