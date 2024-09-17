import { isSameFilePath } from ".";
import INodePath, { makeINodePath } from "./INodePath";

// nodeTypes returns a string array of the types available
export const nodeTypes: string[] = [
  "text",
  "image",
  "outfit",
  
  "media",
  "clothingitem",
];
// Supported nodeTypes for file browser
export type NodeType =
  | "text"
  | "image"
  | "outfit"
  | "pdf"
  | "media"
  | "clothingitem";

/**
 * Interface representing a comment on a node.
 */
export interface IComment {
  name: string;
  comment: string;
  timestamp: string;
}

/**
 * Factory function to create an IComment.
 * @param name - The name of the user.
 * @param comment - The comment text.
 * @param timestamp - The timestamp of the comment.
 * @returns An IComment object.
 */

export function makeIComment(
  name: string,
  comment: string,
  timestamp: string
): IComment {
  return {
    name: name,
    comment: comment,
    timestamp: timestamp,
  };
}

/**
 * // TODO [Editable]: Since we want to store new metadata for images we should add
 * new metadata fields to our INode object. There are different ways you can do this.
 *
 * 1. One would be creating a new interface that extends INode.
 * You can have a look at IOutfitNode to see how it is done.
 * 2. Another would be to add optional metadata to the INode object itself.
 */

// INode with node metadata
/**
 * Array of available clothing types.
 */
export interface INode {
  type: NodeType; // type of node that is created
  content: any; // the content of the node
  filePath: INodePath; // unique randomly generated ID which contains the type as a prefix
  nodeId: string; // unique randomly generated ID which contains the type as a prefix
  title: string; // user create node title
  dateCreated?: Date; // date that the node was created
  imageHeight?: number; // New metadata for image resizing
  imageWidth?: number; // New metadata for image resizing
  originalHeight?: number; // New metadata for getting originalHeight of an image
  originalWidth?: number; // New metadata for getting originalWidth of an image
  comments?: IComment[]; //new functionality
  clothingType?: ClothingType;
  price?: number;
  brand?: string;
  color?: string;
  description?: string;
}

/**
 * Array of available clothing types.
 */
export const clothingTypesList: string[] = [
  "shirt",
  "sweater",
  "coat",
  "hoodie",
  "top",
  "dress",
  "jeans",
  "pants",
  "skirt",
  "shorts",
  "shoes",
  "lingerie",
  "loungewear",
  "accessory",
];


/**
 * Type representing clothing types.
 */
export type ClothingType =
  | "shirt"
  | "sweater"
  | "coat"
  | "hoodie"
  | "top"
  | "dress"
  | "jeans"
  | "pants"
  | "skirt"
  | "shorts"
  | "shoes"
  | "lingerie"
  | "loungewear"
  | "accessory";

export type FolderContentType = "list" | "grid";

export interface IOutfitNode extends INode {
  viewType: FolderContentType;
}

export type NodeFields = keyof INode | keyof IOutfitNode;

export const allNodeFields: string[] = [
  "nodeId",
  "title",
  "type",
  "content",
  "filePath",
  "viewType",
  "imageHeight",
  "imageWidth",
  "originalHeight",
  "originalWidth",
  "clothingType",
  "price",
  "brand",
  "color",
  "description",
  "comments",
];

// Type declaration for map from nodeId --> INode
export type NodeIdsToNodesMap = { [nodeId: string]: INode };

/**
 * Function to create an INode.
 * @param nodeId - The unique identifier for the node.
 * @param path - The path of the node.
 * @param children - The children nodes.
 * @param type - The type of the node.
 * @param title - The title of the node.
 * @param content - The content of the node.
 * @param height - The height of the image.
 * @param width - The width of the image.
 * @param originalHeight - The original height of the image.
 * @param originalWidth - The original width of the image.
 * @param comments - The comments on the node.
 * @param clothingType - The clothing type of the node.
 * @param price - The price of the node.
 * @param brand - The brand of the node.
 * @param color - The color of the node.
 * @param description - The description of the node.
 * @returns An INode object.
 */
export function makeINode(
  nodeId: any,
  path: any,
  children?: any,
  type?: any,
  title?: any,
  content?: any,
  height?: number,
  width?: number,
  originalHeight?: number,
  originalWidth?: number,
  comments?: IComment[],
  clothingType?: ClothingType,
  price?: number,
  brand?: string,
  color?: string,
  description?: string
): INode {
  return {
    content: content ?? "content" + nodeId,
    filePath: makeINodePath(path, children),
    nodeId: nodeId,
    title: title ?? "node" + nodeId,
    type: type ?? "text",
    imageHeight: height, // value for resized height of an image
    imageWidth: width, // value for resized width of an image
    originalHeight: originalHeight, // value for originalHeight of an image
    originalWidth: originalWidth, // value for originalHeight of an image
    comments: comments,
    clothingType: clothingType,
    price: price,
    brand: brand,
    color: color,
    description: description,
  };
}

/**
 * Factory function to create an IOutfitNode.
 * @param nodeId - The unique identifier for the node.
 * @param path - The path of the node.
 * @param description - The description of the outfit node.
 * @param children - The children nodes.
 * @param type - The type of the node.
 * @param title - The title of the node.
 * @param content - The content of the node.
 * @param viewType - The view type of the outfit node.
 * @param comments - The comments on the node.
 * @returns An IOutfitNode object.
 */
export function makeIOutfitNode(
  nodeId: any,
  path: any,
  description: any,
  children?: any,
  type?: any,
  title?: any,
  content?: any,
  viewType?: any,
  comments?: IComment[]
): IOutfitNode {
  return {
    content: content ?? "content" + nodeId,
    filePath: makeINodePath(path, children),
    nodeId: nodeId,
    description: description,
    title: title ?? "node" + nodeId,
    type: type ?? "text",
    viewType: viewType ?? "grid",
    comments: comments,
  };
}

export function isINode(object: any): object is INode {
  const propsDefined: boolean =
    typeof (object as INode).nodeId !== "undefined" &&
    typeof (object as INode).title !== "undefined" &&
    typeof (object as INode).type !== "undefined" &&
    typeof (object as INode).content !== "undefined" &&
    typeof (object as INode).filePath !== "undefined";

  const filePath: INodePath = object.filePath;
  // if both are defined
  if (filePath && propsDefined) {
    for (let i = 0; i < filePath.path.length; i++) {
      if (typeof filePath.path[i] !== "string") {
        return false;
      }
    }
    // check if all fields have the right type
    // and verify if filePath.path is properly defined
    return (
      typeof (object as INode).nodeId === "string" &&
      typeof (object as INode).title === "string" &&
      nodeTypes.includes((object as INode).type) &&
      typeof (object as INode).content === "string" &&
      filePath.path.length > 0 &&
      filePath.path[filePath.path.length - 1] === (object as INode).nodeId
    );
  }
}

export function isSameNode(n1: INode, n2: INode): boolean {
  return (
    n1.nodeId === n2.nodeId &&
    n1.title === n2.title &&
    n1.type === n2.type &&
    n1.content === n2.content &&
    isSameFilePath(n1.filePath, n2.filePath)
  );
}
