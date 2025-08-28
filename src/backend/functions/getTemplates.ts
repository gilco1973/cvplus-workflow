import { HttpsFunction } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { TemplateService } from '../services/TemplateService';

/**
 * HTTP function to retrieve available CV templates
 * 
 * This function will be migrated from the main functions directory
 * and enhanced with the workflow orchestration capabilities.
 * 
 * @param request - HTTP request for template retrieval
 * @param response - HTTP response with available templates
 */
export const getTemplates: HttpsFunction = onRequest(
  { cors: true },
  async (request, response) => {
    try {
      // TODO: Implement after migration from main functions
      // Will use TemplateService for managing CV templates
      
      response.status(501).json({
        error: 'Function not yet implemented - pending migration'
      });
    } catch (error) {
      console.error('Error retrieving templates:', error);
      response.status(500).json({
        error: 'Internal server error'
      });
    }
  }
);