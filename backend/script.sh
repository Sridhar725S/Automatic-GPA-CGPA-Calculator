#!/usr/bin/env bash
set -e

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing project dependencies..."
  npm install
fi

# Clean up possible corrupt Playwright installs
if [[ -d "$HOME/.cache/ms-playwright" ]]; then
  echo "Cleaning up corrupted Playwright cache..."
  rm -rf "$HOME/.cache/ms-playwright"
fi

# Ensure Playwright is installed
npx playwright install chromium --force

# Set default paths if not already set
export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-"$HOME/.cache/ms-playwright"}
export XDG_CACHE_HOME=${XDG_CACHE_HOME:-"$HOME/.cache"}

# Verify if Playwright installation is successful
if [ ! -d "$PLAYWRIGHT_BROWSERS_PATH" ]; then
  echo "Error: Playwright installation failed."
  exit 1
fi

# Store/pull Playwright cache with build cache
if [[ ! -d "$PLAYWRIGHT_BROWSERS_PATH" ]]; then 
  echo "...Copying Playwright Cache from Build Cache"
  mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"
  cp -R "$XDG_CACHE_HOME/playwright/" "$PLAYWRIGHT_BROWSERS_PATH/" || echo "Warning: Cache copy failed."
else 
  echo "...Storing Playwright Cache in Build Cache"
  mkdir -p "$XDG_CACHE_HOME/playwright/"
  cp -R "$PLAYWRIGHT_BROWSERS_PATH/" "$XDG_CACHE_HOME/playwright/" || echo "Warning: Cache copy failed."
fi
