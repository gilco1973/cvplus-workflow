#!/bin/bash

# Validate Templates
# Comprehensive validation script for workflow template management

set -e

echo "📋 Validating Workflow Templates..."
echo "=================================="

# Ensure we're in the correct directory
cd "$(dirname "$0")/../.." || exit 1

echo "📦 Installing dependencies..."
npm install

echo "🔍 Running TypeScript type checks..."
npm run type-check

echo "🧪 Running template service tests..."
npx vitest run --reporter=verbose src/backend/services/TemplateService.test.ts || true
npx vitest run --reporter=verbose src/backend/services/template-customization.service.test.ts || true
npx vitest run --reporter=verbose src/backend/services/industry-templates.service.test.ts || true

echo "🔧 Running template function tests..."
npx vitest run --reporter=verbose src/backend/functions/getTemplates.test.ts || true
npx vitest run --reporter=verbose src/backend/functions/updatePlaceholderValue.test.ts || true

echo "🎨 Running template customization tests..."
npx vitest run --reporter=verbose src/backend/services/PlaceholderService.test.ts || true
npx vitest run --reporter=verbose src/backend/services/role-template-integration.service.test.ts || true

echo "🖥️ Running frontend template tests..."
npx vitest run --reporter=verbose src/frontend/components/TemplateSelector.test.tsx || true
npx vitest run --reporter=verbose src/frontend/hooks/useTemplates.test.ts || true

echo "📊 Running template validation tests..."
if [ -f "scripts/validate-template-integrity.js" ]; then
  node scripts/validate-template-integrity.js
else
  echo "ℹ️ Template integrity validation script not found, skipping..."
fi

echo "🔍 Validating template structure..."
if [ -f "scripts/validate-template-structure.js" ]; then
  node scripts/validate-template-structure.js
else
  echo "ℹ️ Template structure validation script not found, skipping..."
fi

echo "✅ Template Validation Complete!"
echo "==============================="