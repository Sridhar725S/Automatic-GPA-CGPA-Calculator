#!/usr/bin/env bash
set -e

echo "🔄 Installing project dependencies..."
npm install

# Ensure Puppeteer is installed correctly
echo "🔄 Installing Puppeteer..."
npm install puppeteer

# Verify Puppeteer installation
if node -e "require('puppeteer'); console.log('✅ Puppeteer is working');" 2>/dev/null; then
  echo "🚀 Puppeteer installation successful!"
else
  echo "❌ Puppeteer installation failed!"
  exit 1
fi
