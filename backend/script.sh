#!/usr/bin/env bash
set -e

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing project dependencies..."
  npm install
fi

# Ensure Playwright is installed
npx playwright install chromium

# Set default paths if not already set
export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-"$HOME/.cache/ms-playwright"}
export XDG_CACHE_HOME=${XDG_CACHE_HOME:-"$HOME/.cache"}

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

