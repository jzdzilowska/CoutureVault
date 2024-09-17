import React from "react";
import { nodeTypeIcon, pathToString } from "../../../../../global";
import { INode } from "../../../../../types";
import "./NodePreview.scss";
import { NodePreviewContent } from "./NodePreviewContent";
import { useSetRecoilState } from "recoil";
import { selectedNodeState } from "../../../../../global/Atoms";
import { useRouter } from "next/router";

export interface INodePreviewProps {
  node: INode;
  isSearchResult?: boolean;
}

/** Full page view focused on a node's content, with annotations and links */
export const NodePreview = (props: INodePreviewProps) => {
  const { node } = props;
  const { type, title, content } = node;
  const setSelectedNode = useSetRecoilState(selectedNodeState);
  // console.log(`Generated route: /${pathToString(node.filePath)}`);
  const router = useRouter();

  const handleClick = () => {
    setSelectedNode(node);
    router.push(`/${pathToString(node.filePath)}`);
  };

  // suddenly works????? what the hell
  return (
    <div className={"grid-nodePreview"} onClick={handleClick}>
      <div className="content-preview">
        <NodePreviewContent type={type} content={content} node={node} />
      </div>
      <div className="node-info">
        <div className="info-container">
          <div className="main-info">
            {nodeTypeIcon(node.type, node.clothingType || "shirt")}
            <div className="title">{title}</div>
          </div>
          <div className="sub-info">
            {node.dateCreated && (
              <div className="dateCreated">
                {"Created on " +
                  new Date(node.dateCreated).toLocaleDateString("en-US")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
