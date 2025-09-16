// @ts-ignore - Export conflictsimport { PlaceholderValue, PlaceholderTemplate } from '../types';
import { db } from '../config/firebase';

export class PlaceholderManager {
  private static instance: PlaceholderManager;

  public static getInstance(): PlaceholderManager {
    if (!PlaceholderManager.instance) {
      PlaceholderManager.instance = new PlaceholderManager();
    }
    return PlaceholderManager.instance;
  }

  /**
   * Update a specific placeholder value for a job
   */
  async updatePlaceholderValue(
    jobId: string,
    userId: string,
    key: string,
    value: any,
    type: PlaceholderValue['type'] = 'string'
  ): Promise<void> {
    const placeholderValue: PlaceholderValue = {
      key,
      value,
      type,
      isRequired: true,
      lastUpdated: new Date(),
      source: 'user'
    };

    await db.collection('jobs')
      .doc(jobId)
      .collection('placeholders')
      .doc(key)
      .set(placeholderValue);
  }

  /**
   * Get all placeholder values for a job
   */
  async getPlaceholderValues(jobId: string): Promise<PlaceholderValue[]> {
    const snapshot = await db.collection('jobs')
      .doc(jobId)
      .collection('placeholders')
      .get();

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      key: doc.id
    } as PlaceholderValue));
  }

  /**
   * Get placeholder template for a specific template
   */
  async getPlaceholderTemplate(templateId: string): Promise<PlaceholderTemplate | null> {
    const doc = await db.collection('placeholderTemplates')
      .doc(templateId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return doc.data() as PlaceholderTemplate;
  }

  /**
   * Create or update a placeholder template
   */
  async setPlaceholderTemplate(template: PlaceholderTemplate): Promise<void> {
    await db.collection('placeholderTemplates')
      .doc(template.templateId)
      .set(template);
  }

  /**
   * Delete a placeholder value
   */
  async deletePlaceholderValue(jobId: string, key: string): Promise<void> {
    await db.collection('jobs')
      .doc(jobId)
      .collection('placeholders')
      .doc(key)
      .delete();
  }

  /**
   * Validate placeholder value against template constraints
   */
  validatePlaceholderValue(value: any, constraints: PlaceholderTemplate['placeholders'][string]): boolean {
    // Type validation
    if (constraints.required && (value === undefined || value === null || value === '')) {
      return false;
    }

    // Pattern validation for strings
    if (constraints.type === 'string' && constraints.validation?.pattern) {
      const pattern = new RegExp(constraints.validation.pattern);
      if (!pattern.test(value)) {
        return false;
      }
    }

    // Length validation for strings
    if (constraints.type === 'string' && typeof value === 'string') {
      if (constraints.validation?.minLength && value.length < constraints.validation.minLength) {
        return false;
      }
      if (constraints.validation?.maxLength && value.length > constraints.validation.maxLength) {
        return false;
      }
    }

    // Range validation for numbers
    if (constraints.type === 'number' && typeof value === 'number') {
      if (constraints.validation?.min && value < constraints.validation.min) {
        return false;
      }
      if (constraints.validation?.max && value > constraints.validation.max) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get missing required placeholders for a job
   */
  async getMissingRequiredPlaceholders(jobId: string, templateId: string): Promise<string[]> {
    const [placeholderValues, template] = await Promise.all([
      this.getPlaceholderValues(jobId),
      this.getPlaceholderTemplate(templateId)
    ]);

    if (!template) {
      return [];
    }

    const existingKeys = new Set(placeholderValues.map(pv => pv.key));
    const missing: string[] = [];

    Object.entries(template.placeholders).forEach(([key, constraints]) => {
      if (constraints.required && !existingKeys.has(key)) {
        missing.push(key);
      }
    });

    return missing;
  }

  /**
   * Static method to detect placeholders in text
   */
  static detectPlaceholders(text: string): Array<{ key: string; fullMatch: string }> {
    const placeholderRegex = /\[([^\]]+)\]/g;
    const placeholders: Array<{ key: string; fullMatch: string }> = [];
    let match;

    while ((match = placeholderRegex.exec(text)) !== null) {
      placeholders.push({
        key: match[1],
        fullMatch: match[0]
      });
    }

    return placeholders;
  }

  /**
   * Static method to replace placeholders in text
   */
  static replacePlaceholders(text: string, replacements: Record<string, any>): string {
    let result = text;
    
    Object.entries(replacements).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  /**
   * Static method to validate placeholder value (simplified version)
   */
  static validatePlaceholderValue(
    placeholderInfo: { key: string; fullMatch: string }, 
    value: any
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (value === null || value === undefined || value === '') {
      errors.push(`Value for placeholder [${placeholderInfo.key}] is required`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}