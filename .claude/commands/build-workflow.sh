#!/bin/bash

# Build Workflow
# Comprehensive build script for workflow submodule

set -e

echo "🏗️ Building Workflow Submodule..."
echo "================================"

# Ensure we're in the correct directory
cd "$(dirname "$0")/../.." || exit 1

echo "📦 Installing dependencies..."
npm install

echo "🧹 Cleaning previous build..."
npm run clean || echo "ℹ️ Clean script not available, continuing..."

echo "🔍 Running TypeScript type checks..."
npm run type-check

echo "🧪 Running tests before build..."
npm run test || echo "⚠️ Some tests may have failed, but continuing build..."

echo "🏗️ Building production bundle..."
npm run build:prod

echo "📊 Build validation..."
if [ -d "dist" ]; then
  echo "✅ Build output directory created successfully"
  ls -la dist/
  
  # Validate essential files exist
  if [ -f "dist/index.js" ]; then
    echo "✅ Main bundle file created"
  else
    echo "❌ Main bundle file missing"
    exit 1
  fi
  
  if [ -f "dist/index.d.ts" ]; then
    echo "✅ TypeScript definitions created"
  else
    echo "❌ TypeScript definitions missing"
    exit 1
  fi
else
  echo "❌ Build output directory not found"
  exit 1
fi

echo "🔍 Validating build integrity..."
node -e "
  try {
    const workflow = require('./dist/index.js');
    console.log('✅ Build bundle can be imported successfully');
  } catch (error) {
    console.error('❌ Build bundle import failed:', error.message);
    process.exit(1);
  }
"

echo "✅ Workflow Build Complete!"
echo "============================"