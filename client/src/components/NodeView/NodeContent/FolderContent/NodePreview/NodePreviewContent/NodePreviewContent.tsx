import React from "react";
import { INode, NodeType } from "../../../../../../types";
import { ImagePreviewContent } from "./ImagePreviewContent";
import "./NodePreviewContent.scss";
import { TextPreviewContent } from "./TextPreviewContent";
import { MediaPreviewContent } from "./MediaPreviewContent";
import { ClothingPreviewContent } from "./ClothingPreviewContent";
import { OutfitPreviewContent } from "./OutfitPreviewContent";

/** Props needed to render any node content */
export interface INodeContentPreviewProps {
  content: any;
  type: NodeType;
  node: INode;
}

export const NodePreviewContent = (props: INodeContentPreviewProps) => {
  const { type, content, node } = props;
  switch (type) {
    case "image":
      return <ImagePreviewContent content={content} />;
    case "text":
      return <TextPreviewContent content={content} />;
    case "media":
      return <MediaPreviewContent content={content} />;
    case "clothingitem":
      return <ClothingPreviewContent content={content} node={node} />;
    case "outfit":
      return <OutfitPreviewContent content={content} />;
    default:
      return null;
  }
};
