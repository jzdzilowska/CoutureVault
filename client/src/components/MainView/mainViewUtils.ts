import {
  INode,
  makeIOutfitNode,
  makeINode,
  NodeIdsToNodesMap,
} from "../../types";
import { traverseTree, RecursiveNodeTree } from "../../types/RecursiveNodeTree";

export const createNodeIdsToNodesMap = (rootNodes: any) => {
  const result: NodeIdsToNodesMap = {};
  for (const root of rootNodes) {
    traverseTree(root, (tree) => {
      result[tree.node.nodeId] = tree.node;
    });
  }
  return result;
};

export const makeRootWrapper = (rootNodes: any) => {
  const rootRecursiveNodeTree: RecursiveNodeTree = {
    addChild: () => null,
    children: rootNodes,
    node: makeIOutfitNode(
      "root",
      [],
      "homepage",
      [],
      "outfit",
      "MyHypermedia Dashboard",
      "",
      "grid"
    ),
  };
  return rootRecursiveNodeTree;
};

export const emptyNode: INode = makeINode(
  "nodeId",
  ["path"],
  ["children"],
  0, // height
  0, // width
  0, // originalHeight
  0, // originalWidth
  "text", // Replace with the actual NodeType
  "title",
  null // or provide appropriate content
);
