// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// @ts-ignore - Export conflicts// Re-export Firebase configuration from core package for workflow module
export {
  db,
  storage,
  auth,
  admin,
  initializeAdminApp,
  getSecureConfig
} from '@cvplus/core';

// Additional workflow-specific Firebase utilities can be added here if needed
export const WORKFLOW_COLLECTIONS = {
  JOBS: 'jobs',
  FEATURES: 'features',
  TEMPLATES: 'templates',
  ROLE_PROFILES: 'roleProfiles',
  CERTIFICATIONS: 'certifications',
  PLACEHOLDERS: 'placeholders'
} as const;