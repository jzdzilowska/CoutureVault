import { useRecoilValue } from "recoil";
import { currentNodeState } from "../../../global/Atoms";
import { IOutfitNode, INode } from "../../../types";
import { FolderContent } from "./FolderContent";
import { ImageContent } from "./ImageContent";
import { MediaContent } from "./MediaContent";
import "./NodeContent.scss";
import { TextContent } from "./TextContent";
import { ClothingContent } from "./ClothingContent";
import stc from "string-to-color";

/** Props needed to render any node content */

export interface INodeContentProps {
  childNodes?: INode[];
  onCreateNodeButtonClick: () => void;
  // searchResults: INode[] | undefined;
}

/**
 * This is the node content.
 *
 * @param props: INodeContentProps
 * @returns Content that any type of node renders
 */
export const NodeContent = (props: INodeContentProps) => {
  const { onCreateNodeButtonClick, childNodes } = props;
  const currentNode = useRecoilValue(currentNodeState);
  console.log(currentNode.title);

    // Render content based on the type of the current node, 2 types 
  switch (currentNode.type) {
    // Render Clothing Item content
    case "clothingitem":
      return (
        <div className="clothing-all">
          <div className="clothing-elements">
            <ClothingContent
              price={currentNode.price}
              clothingType={currentNode.clothingType}
              description={currentNode.description}
              brand={currentNode.brand}
              color={currentNode.color}
            />
          </div>
          <div className="clothing-image">
            <ImageContent />
          </div>
        </div>
      );
    case "outfit":
      // Render Clothing Item content
      if (childNodes) {
        return (
          <FolderContent
            node={currentNode as IOutfitNode}
            onCreateNodeButtonClick={onCreateNodeButtonClick}
            childNodes={childNodes}
            description={currentNode.description}
            image={currentNode.content}
          />
        );
      }
  }
    // Return null for unknown node types
  return null;
};
