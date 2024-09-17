import { StepDescription } from "@chakra-ui/react";
import { INodePath, makeINodePath } from "./INodePath";

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

// Interface for a comment
export interface IComment {
  name: string;
  comment: string;
  timestamp: string;
}
// Interface for a comment object
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
export interface INode {
  type: NodeType;                // Type of the node
  content: any;                  // Content of the node
  filePath: INodePath;           // Unique randomly generated ID with type as prefix
  nodeId: string;                // Unique randomly generated ID with type as prefix
  title: string;                 // User-created node title
  dateCreated?: Date;            // Date that the node was created
  imageHeight?: number;          // Metadata for image resizing
  imageWidth?: number;           // Metadata for image resizing
  originalHeight?: number;       // Metadata for tracking original image dimensions
  originalWidth?: number;        // Metadata for tracking original image dimensions
  clothingType?: ClothingType;   // Clothing type for clothing items
  comments?: IComment[];         // Comments associated with the node
  price?: number;                // Price for clothing items
  brand?: string;                // Brand for clothing items
  color?: string;                // Color for clothing items
  description?: string;          // Description for clothing items
}

// Array of supported clothing types
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

// Type for clothing types
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

// Type for folder content view type
export type FolderContentType = "list" | "grid";

export interface IOutfitNode extends INode {
  viewType: FolderContentType; // Type for folder content view type
}

export type NodeFields = keyof INode | keyof IOutfitNode;

// Type declaration for map from nodeId --> INode
export type NodeIdsToNodesMap = { [nodeId: string]: INode };

/**
 * Function to create an INode given relevant inputs.
 * @param nodeId - Unique identifier for the node.
 * @param path - Path of the node.
 * @param children - Children nodes.
 * @param height - Height of the image.
 * @param width - Width of the image.
 * @param originalHeight - Original height of the image.
 * @param originalWidth - Original width of the image.
 * @param type - Type of the node.
 * @param title - Title of the node.
 * @param content - Content of the node.
 * @param clothingType - Clothing type for clothing items.
 * @param price - Price for clothing items.
 * @param brand - Brand for clothing items.
 * @param color - Color for clothing items.
 * @param description - Description for clothing items.
 * @param comments - Comments associated with the node.
 * @returns INode object.
 */
export function makeINode(
  nodeId: string,
  path: string[],
  children: string[] = [],
  height: number,
  width: number,
  originalHeight: number,
  originalWidth: number,
  type?: NodeType,
  title: string | null = null,
  content: any = null,
  clothingType?: ClothingType,
  price?: number,
  brand?: string,
  color?: string,
  description?: string,
  comments?: IComment[]
): INode {
  return {
    nodeId: nodeId,
    title: title ?? "node" + nodeId,
    type: type ?? "text", // Provide a default value here
    content: content ?? "content" + nodeId,
    filePath: makeINodePath(path, children),
    imageHeight: height,
    imageWidth: width, //new metadata
    originalHeight: originalHeight, //new metadata
    originalWidth: originalWidth, //new metadata
    clothingType: clothingType,
    price: price,
    brand: brand,
    color: color,
    description: description,
    comments: comments,
  };
}

/**
 * Function to create an IOutfitNode given relevant inputs.
 * @param nodeId - Unique identifier for the node.
 * @param path - Path of the node.
 * @param description - Description of the node.
 * @param children - Children nodes.
 * @param type - Type of the node.
 * @param title - Title of the node.
 * @param content - Content of the node.
 * @param viewType - View type for folder content.
 * @param comments - Comments associated with the node.
 * @returns IOutfitNode object.
 */
export function makeIOutfitNode(
  nodeId: any,
  path: any,
  description: string,
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
