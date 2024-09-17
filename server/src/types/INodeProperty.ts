import {
  isINodePath,
  allNodeFields,
  NodeFields,
  nodeTypes,
  clothingTypesList,
} from ".";

export interface INodeProperty {
  fieldName: NodeFields;
  value: any;
}

export function makeINodeProperty(
  fieldName: NodeFields,
  newValue: any
): INodeProperty {
  return {
    fieldName: fieldName,
    value: newValue,
  };
}
export function isINodeProperty(object: any): boolean {
  const propsDefined: boolean =
    typeof (object as INodeProperty).fieldName !== "undefined" &&
    typeof (object as INodeProperty).value !== "undefined";
  if (
    propsDefined &&
    allNodeFields.includes((object as INodeProperty).fieldName)
  ) {
    switch ((object as INodeProperty).fieldName) {
      case "nodeId":
        return typeof (object as INodeProperty).value === "string";
      case "title":
        return typeof (object as INodeProperty).value === "string";
      case "type":
        return nodeTypes.includes((object as INodeProperty).value);
      case "content":
        return typeof (object as INodeProperty).value === "string";
      case "filePath":
        return isINodePath((object as INodeProperty).value);
      case "viewType":
        return typeof (object as INodeProperty).value === "string";
      case "imageHeight":
        return typeof (object as INodeProperty).value === "number";
      case "imageWidth":
        return typeof (object as INodeProperty).value === "number";
      case "originalHeight": //new metadata added for resizing purposes of image node
        return typeof (object as INodeProperty).value === "number";
      case "originalWidth": //new metadata added for resizing purposes of image node
        return typeof (object as INodeProperty).value === "number";
      case "clothingType":
        return clothingTypesList.includes((object as INodeProperty).value);
      case "brand":
        return typeof (object as INodeProperty).value === "string";
      case "color":
        return typeof (object as INodeProperty).value === "string";
      case "price":
        return typeof (object as INodeProperty).value === "number";
      default:
        return true;
    }
  }
}
