#!/usr/bin/env bash
set -e

echo "🚀 Installing Playwright Chromium..."
yarn playwright install chromium

# Ensure environment variables are set
if [[ -z "$PLAYWRIGHT_BROWSERS_PATH" || -z "$XDG_CACHE_HOME" ]]; then
  echo "❌ ERROR: PLAYWRIGHT_BROWSERS_PATH or XDG_CACHE_HOME is not set."
  exit 1
fi

# Store/pull Playwright cache with build cache
if [[ ! -d "$PLAYWRIGHT_BROWSERS_PATH" ]]; then 
  echo "🔄 Copying Playwright Cache from Build Cache..." 
  mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"
  cp -R "$XDG_CACHE_HOME/playwright/" "$PLAYWRIGHT_BROWSERS_PATH" || echo "⚠️ Failed to copy cache."
else 
  echo "📦 Storing Playwright Cache in Build Cache..." 
  cp -R "$PLAYWRIGHT_BROWSERS_PATH" "$XDG_CACHE_HOME" || echo "⚠️ Failed to store cache."
fi

echo "✅ Playwright setup completed successfully!"

