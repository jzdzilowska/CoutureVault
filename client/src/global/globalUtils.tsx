import React from "react";
import {
  RiFolderLine,
  RiImageLine,
  RiStickyNoteLine,
  RiVideoLine,
  RiFilePdfLine,
  RiQuestionLine,
} from "react-icons/ri";
import {
  GiLargeDress,
  GiClothes,
  GiTShirt,
  GiShirt,
  GiMonclerJacket,
  GiArmoredPants,
  GiSkirt,
  GiShorts,
  GiSonicShoes,
  GiPearlNecklace,
  GiHoodie,
  GiUnderwear,
} from "react-icons/gi";
import { PiHoodieFill, PiPantsFill, PiShirtFoldedFill } from "react-icons/pi";
import uniqid from "uniqid";
import { ClothingType, NodeType } from "../types";
import { INodePath } from "../types";


/**
 * Returns an icon element based on the provided node type and clothing type.
 * @param {NodeType} type - The type of the node.
 * @param {ClothingType} clothingType - The clothing type if the node type is "clothingitem".
 * @returns {JSX.Element} - Icon element based on the node type.
 */
export const nodeTypeIcon = (
  type: NodeType,
  clothingType: ClothingType
): JSX.Element => {
  switch (type) {
    // case "text":
    //   return <RiStickyNoteLine />;
    // case "media":
    //   return <RiVideoLine />;
    case "outfit":
      return <GiClothes />;
    // case "image":
    //   return <RiImageLine />;
    // case "pdf":
    //   return <RiFilePdfLine />;
    case "clothingitem":
      // Clothing item icons based on clothing type
      switch (clothingType) {
        case "shirt":
          return <GiTShirt />;
        case "sweater":
          return <GiShirt />;
        case "coat":
          return <GiMonclerJacket />;
        case "hoodie":
          return <GiHoodie />;
        case "top":
          return <PiShirtFoldedFill />;
        case "dress":
          return <GiLargeDress />;
        case "jeans":
          return <PiPantsFill />;
        case "pants":
          return <GiArmoredPants />;
        case "skirt":
          return <GiSkirt />;
        case "shorts":
          return <GiShorts />;
        case "shoes":
          return <GiSonicShoes />;
        case "lingerie":
          return <GiUnderwear />;
        case "loungewear":
          return <PiHoodieFill />;
        case "accessory":
          return <GiPearlNecklace />;
      }
    default:
      return <RiQuestionLine />;
  }
};

export const pathToString = (filePath: INodePath): string => {
  let urlPath = "";
  if (filePath.path) {
    for (const id of filePath.path) {
      urlPath = urlPath + id + "/";
    }
  }
  return urlPath;
};

/**
 * Helpful for filtering out null and undefined values
 * @example
 * const validNodes = myNodes.filter(isNotNullOrUndefined)
 */
export const isNotNullOrUndefined = (data: any) => {
  return data != null;
};

type hypertextObjectType = NodeType | "link" | "anchor";

export function generateObjectId(prefix: hypertextObjectType) {
  return uniqid(prefix + ".");
}
