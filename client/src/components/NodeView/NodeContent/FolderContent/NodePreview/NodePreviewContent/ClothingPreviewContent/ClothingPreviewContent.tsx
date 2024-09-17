import React from "react";
import "./ClothingPreviewContent.scss";
import { INode } from "~/types";
import { nodeTypeIcon } from "~/global";

interface IClothingPreviewProps {
  content: any;
  node: INode;
}

/** The content of an image node, including any anchors */
export const ClothingPreviewContent = (props: IClothingPreviewProps) => {
  const { content, node } = props;

  /**
   * Return the preview container if we are rendering an image preview
   */
  if (content === "") {
    return (
      <div className="clothingContent-preview">
        <div className="outfitIcon-preview">
          {nodeTypeIcon(node.type, node.clothingType || "shirt")}
          {/* <img src="/clothingpreview2.png" alt="" /> */}
        </div>
      </div>
    );
  } else
    return (
      <div className="clothingContent-preview">
        <img src={content} alt="" />
      </div>
    );
};
