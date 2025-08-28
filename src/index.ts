/**
 * CVPlus Workflow Module - Main Export
 * 
 * This is the main entry point for the CVPlus workflow management module.
 * It provides job management, feature orchestration, template management,
 * placeholder value management, certification badges system, and feature skipping functionality.
 */

// Backend Services
export * from './backend/services';
export * from './backend/functions';

// Frontend Components and Hooks
export * from './frontend/components';
export * from './frontend/hooks';

// Type Definitions
export * from './types';

// Constants
export * from './constants';

// Utility Functions
export * from './utils';

// Version information
export const VERSION = '1.0.0';
export const MODULE_NAME = '@cvplus/workflow';

// Module metadata
export const WORKFLOW_MODULE = {
  name: MODULE_NAME,
  version: VERSION,
  description: 'CVPlus workflow management module for job processing, feature orchestration, templates, and certification badges',
  author: 'Gil Klainert',
  license: 'MIT'
} as const;