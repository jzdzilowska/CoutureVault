import React, { useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";
import { nodeTypeIcon, pathToString } from "../../../global";
import { ClothingType, INode, NodeType } from "../../../types";
import { RecursiveNodeTree } from "../../../types/RecursiveNodeTree";
import "./TreeViewItem.scss";

interface ITreeViewProps {
  changeUrlOnClick?: boolean;
  childNodes: RecursiveNodeTree[];
  node: INode;
  parentNode: INode | null;
  setParentNode: (node: INode) => void;
  title: string;
  type: NodeType;
  clothingType: ClothingType;
}

export const TreeViewItem = ({
  node,
  type,
  clothingType,
  title,
  childNodes,
  parentNode,
  setParentNode,
  changeUrlOnClick,
}: ITreeViewProps) => {
  let childrenItems: JSX.Element[] = [];
  // glr: why does this not work?
  if (childNodes.length) {
    childrenItems = childNodes.map((child: RecursiveNodeTree) => {
      return changeUrlOnClick ? (
        <Link
          href={`/${pathToString(child.node.filePath)}`}
          key={child.node.nodeId}
        >
          <TreeViewItem
            node={child.node}
            parentNode={parentNode}
            setParentNode={setParentNode}
            type={child.node.type}
            clothingType={child.node.clothingType || "shirt"}
            title={child.node.title}
            childNodes={child.children}
            changeUrlOnClick={changeUrlOnClick}
          />
        </Link>
      ) : (
        <TreeViewItem
          node={child.node}
          parentNode={parentNode}
          setParentNode={setParentNode}
          key={child.node.nodeId}
          type={child.node.type}
          clothingType={child.node.clothingType || "shirt"}
          title={child.node.title}
          childNodes={child.children}
          changeUrlOnClick={changeUrlOnClick}
        />
      );
    });
  }

  const [isOpen, toggleOpen] = useState(false);
  const toggleFolder = () => {
    toggleOpen(!isOpen);
  };

  const TreeViewChild = () => {
    return (
      <div
        className={`item-wrapper ${isSelected}`}
        onClick={() => {
          setParentNode(node);
        }}
      >
        {hasChildren ? (
          <div className={`icon-hover ${hasChildren}`} onClick={toggleFolder}>
            <div
              className="icon-wrapper"
              style={{
                transform: hasChildren && isOpen ? "rotate(90deg)" : undefined,
              }}
            >
              {<RiArrowRightSLine />}
            </div>
          </div>
        ) : null}
        <div className={"icon-hover"}>
          <div className="icon-wrapper">{icon}</div>
        </div>
        <div className="text-wrapper">{title}</div>
      </div>
    );
  };
  let icon = nodeTypeIcon(type, clothingType);
  const hasChildren: boolean = childNodes.length > 0;
  const isSelected: boolean =
    parentNode != null && parentNode.nodeId === node.nodeId;
  return (
    <div className="treeView-item">
      {changeUrlOnClick ? (
        <Link href={`/${pathToString(node.filePath)}`}>
          <TreeViewChild />
        </Link>
      ) : (
        <TreeViewChild />
      )}
      <div className={`item-children ${isOpen}`}>{childrenItems}</div>
    </div>
  );
};
