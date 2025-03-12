#!/usr/bin/env bash
set -e
# Ensure Playwright is installed
npx playwright install chromium

# Store/pull Playwright cache with build cache
if [[ ! -d "$PLAYWRIGHT_BROWSERS_PATH" ]]; then 
  echo "...Copying Playwright Cache from Build Cache"
  mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"
  cp -R "$XDG_CACHE_HOME/playwright/" "$PLAYWRIGHT_BROWSERS_PATH/"
else 
  echo "...Storing Playwright Cache in Build Cache"
  mkdir -p "$XDG_CACHE_HOME/playwright/"
  cp -R "$PLAYWRIGHT_BROWSERS_PATH/" "$XDG_CACHE_HOME/playwright/"
fi
