#!/usr/bin/env bash
set -e

echo "🔄 Installing project dependencies..."
npm install

# Set Puppeteer cache directory
PUPPETEER_CACHE_DIR="$HOME/.cache/puppeteer"

echo "🔄 Ensuring Puppeteer is installed..."
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer


# Download Chromium if not already cached
if [ ! -d "$PUPPETEER_CACHE_DIR" ]; then
  echo "📂 Creating Puppeteer cache directory..."
  mkdir -p "$PUPPETEER_CACHE_DIR"
fi

# Ensure Puppeteer fetches its required browser
echo "📥 Downloading Puppeteer's Chromium..."
npx puppeteer browsers install chrome

# Verify Puppeteer installation
if node -e "require('puppeteer'); console.log('✅ Puppeteer is working');" 2>/dev/null; then
  echo "🚀 Puppeteer installation successful!"
else
  echo "❌ Puppeteer installation failed!"
  exit 1
fi
