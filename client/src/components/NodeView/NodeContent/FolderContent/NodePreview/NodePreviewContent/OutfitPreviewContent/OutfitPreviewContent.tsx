import React from "react";
import "./OutfitPreviewContent.scss";
import { INode } from "~/types";

interface IOutfitPreviewProps {
  content: any;
}

/** The content of an image node, including any anchors */
export const OutfitPreviewContent = (props: IOutfitPreviewProps) => {
  const { content } = props;

  /**
   * Return the preview container if we are rendering an image preview
   */
  if (content === "") {
    return (
      <div className="outfitContent-preview">
        <img src="/outfitpreviewlight.png" alt="" />
      </div>
    );
  } else
    return (
      <div className="outfitContent-preview">
        <img src={content} alt="" />
      </div>
    );
};
