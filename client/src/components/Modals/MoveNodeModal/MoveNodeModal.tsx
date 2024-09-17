import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FrontendNodeGateway } from "../../../nodes";
import { INode, RecursiveNodeTree } from "../../../types";
import { Button } from "../../Button";
import { TreeView } from "../../TreeView";
import "./MoveNodeModal.scss";
import { useSetRecoilState } from "recoil";
import { selectedNodeState } from "../../../global/Atoms";

export interface IMoveNodeModalProps {
  isOpen: boolean;
  node: INode;
  onClose: () => void;
  onSubmit: () => void;
  roots: RecursiveNodeTree[];
}

/**
 * Modal for moving a node to a new location
 */
export const MoveNodeModal = (props: IMoveNodeModalProps) => {
  const { isOpen, onClose, onSubmit, node, roots } = props;
  // state variables
  const setSelectedNode = useSetRecoilState(selectedNodeState);
  const [selectedParentNode, setSelectedParentNode] = useState<INode | null>(
    null
  );
  const [error, setError] = useState<string>("");

  // called when the "Move" button is clicked
  const handleSubmit = async () => {
    const newParentId: string = selectedParentNode
      ? selectedParentNode.nodeId
      : "~";

    if (newParentId === node.nodeId) {
      setError("Error: Cannot move into itself");
      return;
    }
    if (
      selectedParentNode &&
      selectedParentNode.filePath.path.includes(node.nodeId)
    ) {
      setError("Error: Cannot move into children");
      return;
    }

  // Check if the selected parent node is an outfit node
  const isParentOutfitNode =
  selectedParentNode && selectedParentNode.type === "outfit";

// Check if the current node being moved is an outfit node
const isCurrentNodeOutfitNode = node.type === "outfit";

// Check if the conditions for moving an outfit node within another outfit node are met
if (isParentOutfitNode && isCurrentNodeOutfitNode) {
  setError("Error: Cannot move an ON within another ON");
  return;
}

 // Check if the selected parent node is an clothing item node
  const isParentClothingItemNode=
  selectedParentNode && selectedParentNode.type === "clothingitem";

// Check if the current node being moved is a clothing item node
const isCurrentNodeClothingItemNode = node.type === "clothingitem";

// Check if the conditions for moving an outfit node within another outfit node are met
if (isParentClothingItemNode && isCurrentNodeClothingItemNode) {
  setError("Error: Cannot move CN within another CN");
  return;
}

// Check if the conditions for moving an ON node within another CN node are met
if (isParentClothingItemNode && isCurrentNodeOutfitNode) {
  setError("Error: Cannot move ON within another CN");
  return;
}


    const moveNodeResp = await FrontendNodeGateway.moveNode({
      newParentId: newParentId,
      nodeId: node.nodeId,
    });
    if (moveNodeResp.success) {
      const movedNode = moveNodeResp.payload;
      setSelectedNode(movedNode);
    } else {
      setError("Error: " + moveNodeResp.message);
      return;
    }
    onSubmit();
    handleClose();
  };

  // Reset our state variables and close the modal
  const handleClose = () => {
    onClose();
    setSelectedParentNode(null);
    setError("");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Moving {`"${node.title}"`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <span className="modal-title">
              <div className="modal-title-header">
                Choose a new parent node (optional):
              </div>
            </span>
            <div className="modal-treeView">
              <TreeView
                roots={roots}
                parentNode={selectedParentNode}
                setParentNode={setSelectedParentNode}
                changeUrlOnClick={false}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            {error.length > 0 && <div className="modal-error">{error}</div>}
            <div className="modal-footer-buttons">
              <Button
                text={
                  selectedParentNode ? "Move to selected node" : "Move to root"
                }
                onClick={handleSubmit}
              />
            </div>
          </ModalFooter>
        </ModalContent>
      </div>
    </Modal>
  );
};
