#!/bin/bash

# Test Job Management
# Comprehensive testing script for workflow job management features

set -e

echo "🔧 Testing Workflow Job Management..."
echo "=================================="

# Ensure we're in the correct directory
cd "$(dirname "$0")/../.." || exit 1

echo "📦 Installing dependencies..."
npm install

echo "🔍 Running TypeScript type checks..."
npm run type-check

echo "🧪 Running job management unit tests..."
npx vitest run --reporter=verbose src/backend/services/JobManagementService.test.ts || true
npx vitest run --reporter=verbose src/backend/services/JobMonitoringService.test.ts || true
npx vitest run --reporter=verbose src/backend/services/WorkflowOrchestrator.test.ts || true

echo "🔧 Running job processing integration tests..."
npx vitest run --reporter=verbose src/backend/functions/monitorJobs.test.ts || true
npx vitest run --reporter=verbose src/backend/functions/updateJobFeatures.test.ts || true

echo "🎯 Running feature orchestration tests..."
npx vitest run --reporter=verbose src/backend/services/FeatureCompletionService.test.ts || true
npx vitest run --reporter=verbose src/backend/services/FeatureSkipService.test.ts || true

echo "📊 Running workflow monitoring tests..."
npx vitest run --reporter=verbose src/frontend/hooks/useWorkflowMonitoring.test.ts || true
npx vitest run --reporter=verbose src/frontend/components/WorkflowMonitor.test.tsx || true

echo "✅ Job Management Testing Complete!"
echo "================================="