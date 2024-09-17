import React from "react";
import { ClothingType, INode } from "../../types";
import { RecursiveNodeTree } from "../../types/RecursiveNodeTree";
import { TreeViewItem } from "./TreeViewItem";
import "./TreeView.scss";

export interface ITreeViewProps {
  changeUrlOnClick?: boolean;
  roots: RecursiveNodeTree[];
  parentNode: INode | null;
  setParentNode: (node: INode) => void;
  clothingType?: ClothingType;
}

export const TreeView = (props: ITreeViewProps) => {
  const { roots, parentNode, setParentNode, changeUrlOnClick = true } = props;
  return (
    <div className="treeView-wrapper">
      {roots.map((tree: RecursiveNodeTree) => (
        <TreeViewItem
          node={tree.node}
          parentNode={parentNode}
          setParentNode={setParentNode}
          clothingType={tree.node.clothingType || "shirt"}
          key={tree.node.nodeId}
          type={tree.node.type}
          title={tree.node.title}
          childNodes={tree.children}
          changeUrlOnClick={changeUrlOnClick}
        />
      ))}
    </div>
  );
};
