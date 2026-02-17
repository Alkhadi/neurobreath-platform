/**
 * template-schema.ts — Template-driven field schema system (Minimal MVP)
 * Allows templates to define which fields are required/visible
 * 
 * IMPLEMENTATION NOTES:
 * - This is a minimal viable implementation for Phase 1
 * - Schemas are optional: templates without schemas use default form behavior
 * - Future: Expand with more field types, validation, custom layouts
 */

import type { Profile } from "@/lib/utils";

export type FieldType = "text" | "email" | "phone" | "textarea" | "url";

export interface FieldDescriptor {
  key: string; // Field key in Profile (e.g., "fullName", "phone", "addressCard.addressLine1")
  label: string; // Display label
  type: FieldType; // Input type
  required?: boolean; // Whether the field is required (defaults to false)
  maxLen?: number; // Maximum length for text inputs
  placeholder?: string; // Placeholder text
}

export interface TemplateSchema {
  templateId: string; // Template ID this schema applies to
  fields: FieldDescriptor[]; // Fields to show in the form
  description?: string; // Schema description
}

// Registry of template schemas (extensible)
const SCHEMA_REGISTRY: Record<string, TemplateSchema> = {
  // Example: Address card schema
  "address-card-minimal": {
    templateId: "address-card-minimal",
    description: "Minimal address card showing only essential address fields",
    fields: [
      { key: "addressCard.recipientName", label: "Recipient Name", type: "text" },
      { key: "addressCard.addressLine1", label: "Address Line 1", type: "text", required: true },
      { key: "addressCard.addressLine2", label: "Address Line 2", type: "text" },
      { key: "addressCard.city", label: "City", type: "text" },
      { key: "addressCard.postcode", label: "Postcode", type: "text" },
      { key: "addressCard.country", label: "Country", type: "text" },
      { key: "addressCard.directionsNote", label: "Directions Note", type: "textarea", maxLen: 60 },
      { key: "addressCard.mapLinkLabel", label: "Map Link Label", type: "text", placeholder: "Get Directions" },
    ],
  },
  // Add more schemas as needed
};

/**
 * Get schema for a template ID (returns undefined if no schema exists)
 */
export function getSchemaForTemplate(templateId: string): TemplateSchema | undefined {
  return SCHEMA_REGISTRY[templateId];
}

/**
 * Get list of fields that should be shown for a template
 * Returns undefined if the template has no schema (use default form)
 */
export function getFieldsForTemplate(templateId: string): FieldDescriptor[] | undefined {
  const schema = getSchemaForTemplate(templateId);
  return schema?.fields;
}

/**
 * Check if a template has a defined schema
 */
export function hasSchema(templateId: string): boolean {
  return !!SCHEMA_REGISTRY[templateId];
}

/**
 * Register a new template schema (for dynamic/runtime registration)
 */
export function registerTemplateSchema(schema: TemplateSchema): void {
  SCHEMA_REGISTRY[schema.templateId] = schema;
}

/**
 * Get default layers for a template based on its schema
 * (Future: Generate layers from schema field definitions)
 */
export function getDefaultLayersForTemplate(
  templateId: string,
  _profile: Profile
): Profile["layers"] | undefined {
  const schema = getSchemaForTemplate(templateId);
  if (!schema) return undefined;
  
  // Placeholder: In a full implementation, this would generate layers
  // from field bindings defined in the schema
  return undefined;
}
