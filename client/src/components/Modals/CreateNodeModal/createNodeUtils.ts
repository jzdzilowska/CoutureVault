import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { generateObjectId } from "../../../global";
import { FrontendNodeGateway } from "../../../nodes";
import {
  INodePath,
  IOutfitNode,
  INode,
  makeINodePath,
  NodeIdsToNodesMap,
  NodeType,
  ClothingType,
} from "../../../types";

export async function http<T>(request: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await axios(request);
  return response.data;
}

export interface ICreateNodeModalAttributes {
  content: string;
  nodeIdsToNodesMap: NodeIdsToNodesMap;
  parentNodeId: string | null;
  title: string;
  type: NodeType; // if null, add node as a root
  clothingType: ClothingType;
  price: number;
  description: string;
  brand: string;
  color: string;
  imageHeight?: number; // metadata of the resized variable for the height of an image
  imageWidth?: number; // properties are optional, metadata of the resized variable for the width of an image
  originalHeight?: number; // metadata of the  variable for the original height of an image
  originalWidth?: number; // metadata of the  variable for the original width of an image
}

/**
 *
 * The metadata of the image is added. This should be
 * used when the user imports the image / before
 * it gets added into the database
 *
 * @input imageUrl
 * @output An object with the following interface:
 * {
 *    normalizedHeight: number
 *    normalizedWidth: number
 * }
 */
export const getMeta = async (imageUrl: string) => {
  const img = new Image();
  let naturalHeight = 0;
  let naturalWidth = 0;
  let normalizedHeight = 0;
  let normalizedWidth = 0;
  img.src = imageUrl;
  const promise = await new Promise<{
    normalizedHeight: number;
    normalizedWidth: number;
  }>((resolve) => {
    img.addEventListener("load", function () {
      naturalWidth = img.naturalWidth;
      naturalHeight = img.naturalHeight;
      // The height and the width are normalized so that the height will always be 300px
      const mult = 300 / naturalHeight;
      normalizedHeight = mult * naturalHeight;
      normalizedWidth = mult * naturalWidth;
      resolve({
        normalizedHeight: normalizedHeight,
        normalizedWidth: normalizedWidth,
      });
    });
  });
  return {
    normalizedHeight: promise.normalizedHeight,
    normalizedWidth: promise.normalizedWidth,
  };
};

/** Create a new node based on the inputted attributes in the modal */
export async function createNodeFromModal({
  title,
  type,
  parentNodeId,
  content,
  nodeIdsToNodesMap,
  clothingType,
  price,
  description,
  brand,
  color,
  imageHeight, // Added resized imageHeight as a variable
  imageWidth, // Added resized imageWidth as a variable
  originalHeight, // Added original height of an image as a variable
  originalWidth, // Added original width of an image as a variable
}: ICreateNodeModalAttributes): Promise<INode | null> {
  const nodeId = generateObjectId(type);
  // Initial filePath value: create node as a new root
  let filePath: INodePath = makeINodePath([nodeId]);
  // If parentNodeId is provided, we edit filePath so that we can
  // create the node as a child of the parent
  if (parentNodeId) {
    const parentNode = nodeIdsToNodesMap[parentNodeId];
    if (parentNode) {
      filePath = makeINodePath(parentNode.filePath.path.concat([nodeId]));
    } else {
      console.error("Error: parent node is null");
    }
  }

  let newNode: INode | IOutfitNode = {
    content: content,
    dateCreated: new Date(),
    filePath: filePath,
    nodeId: nodeId,
    title: title,
    type: type, // revised for outfit or clothingItem type
    clothingType: clothingType, // added for categorization 
    price, // price attribute added to specifiy price for outfit/clothingItem
    description, // attribute added to add details about outfit/clothingItem
    brand, // attribute added to specify brand about outfit/clothingItem
    color, // attribute added to specify color about outfit/clothingItem
    imageHeight, //added for resizing height of an image
    imageWidth, //added for resizing width of an image
    originalHeight, //added for keeping track of the original height of an image
    originalWidth, //added for keeping track of the original width of an image
  };

  switch (type) {
    case "outfit":
      newNode = {
        ...newNode,
        viewType: "grid",
      };
      break;
  }

  const nodeResponse = await FrontendNodeGateway.createNode(newNode);
  if (nodeResponse.success) {
    return nodeResponse.payload;
  } else {
    console.error("Error: " + nodeResponse.message);
    return null;
  }
}

export const uploadImage = async (file: any): Promise<string> => {
  // begin file upload
  console.log("Uploading file to Imgur..");

  // using key for imgur API
  const apiUrl = "https://api.imgur.com/3/image";
  const apiKey = "f18e19d8cb9a1f0";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const data: any = await http({
      data: formData,
      headers: {
        Accept: "application/json",
        Authorization: "Client-ID " + apiKey,
      },
      method: "POST",
      url: apiUrl,
    });
    return data.data.link;
  } catch (exception) {
    return "Image was not uploaded";
  }
};
