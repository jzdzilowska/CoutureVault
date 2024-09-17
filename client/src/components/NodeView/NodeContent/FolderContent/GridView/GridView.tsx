import React from "react";
import { INode } from "../../../../../types";
import { NodePreview } from "../NodePreview";
import "./GridView.scss";

import * as ri from "react-icons/ri";

export interface IGridViewProps {
  childNodes: INode[];
  onCreateNodeButtonClick: () => void;
}

/** Full page view focused on a node's content, with annotations and links */
export const GridView = (props: IGridViewProps) => {
  const { childNodes, onCreateNodeButtonClick } = props;

  const nodePreviews1 = childNodes.map(
    (childNode: INode) =>
      childNode && (
        <NodePreview node={childNode} key={childNode.nodeId} isSearchResult />
      )
  );

  return (
    <div className={"gridView-wrapper"}>
      {nodePreviews1}

      <div className="grid-newNode" onClick={onCreateNodeButtonClick}>
        <ri.RiAddFill />
      </div>
    </div>
  );
};
