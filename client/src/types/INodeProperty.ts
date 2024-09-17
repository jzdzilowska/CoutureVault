import { NodeFields } from ".";

export interface INodeProperty {
  fieldName: NodeFields;
  value: any;
}

/**
 * Factory function to create an INodeProperty.
 * @param fieldName - The field name or property key.
 * @param newValue - The new value to assign to the property.
 * @returns An INodeProperty object.
 */
export function makeINodeProperty(
  fieldName: NodeFields,
  newValue: any
): INodeProperty {
  return {
    fieldName: fieldName,
    value: newValue,
  };
}
