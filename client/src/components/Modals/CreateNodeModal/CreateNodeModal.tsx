import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  ClothingType,
  clothingTypesList,
  INode,
  NodeIdsToNodesMap,
  NodeType,
  nodeTypes,
  RecursiveNodeTree,
} from "../../../types";
import { Button } from "../../Button";
import { TreeView } from "../../TreeView";
import "./CreateNodeModal.scss";
import { createNodeFromModal, uploadImage } from "./createNodeUtils";
import { useSetRecoilState } from "recoil";
import { selectedNodeState } from "../../../global/Atoms";

export interface ICreateNodeModalProps {
  isOpen: boolean;
  nodeIdsToNodesMap: NodeIdsToNodesMap;
  onClose: () => void;
  onSubmit: () => unknown;
  roots: RecursiveNodeTree[];
}

/**
 * Modal for adding a new node; lets the user choose a title, type,
 * and parent node
 *
 * @component
 * @param {ICreateNodeModalProps} props - Props for the CreateNodeModal component.
 * @returns {JSX.Element} The rendered CreateNodeModal component.
 */
export const CreateNodeModal = (props: ICreateNodeModalProps) => {
  // deconstruct props variables
  const { isOpen, onClose, roots, nodeIdsToNodesMap, onSubmit } = props;

  // state variables
  const setSelectedNode = useSetRecoilState(selectedNodeState);
  const [selectedParentNode, setSelectedParentNode] = useState<INode | null>(
    null
  );
  // state variables for our customized features for our CoutureValut Features
  const [title, setTitle] = useState(""); // State for node title
  const [price, setPrice] = useState(""); // State for clothing item price
  const [content, setContent] = useState(""); // State for various content types
  const [description, setDescription] = useState(""); // State for item/outfit description
  const [clothingImage, setClothingImage] = useState(""); // State for clothing item image URL
  const [clothingRetailer, setClothingRetailer] = useState(""); // State for clothing retailer
  const [clothingBrand, setClothingBrand] = useState(""); // State for clothing brand
  const [color, setColor] = useState(""); // State for clothing color


  const [selectedClothingType, setSelectedClothingType] = useState("");
  const [selectedType, setSelectedType] = useState<NodeType>("" as NodeType);
  const [error, setError] = useState<string>("");

  // event handlers for the modal inputs and dropdown selects
  const handleSelectedTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedType(event.target.value.toLowerCase() as NodeType);
    setContent("");
  };

  // event handlers for the modal inputs and dropdown selects
  const handleSelectedClothingTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedClothingType(event.target.value.toLowerCase() as ClothingType);
    setContent("");
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleImageContentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContent(event.target.value);
  };

  const handleDescriptionContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleMediaContentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContent(event.target.value);
  };

  const handleClothingContentChange = () => {
    /* CHECK THIS ---------------------------------- */
    const content =
      "clIm:" + { clothingImage } + "clRet:" + { clothingRetailer };
    setContent(content);
  };

  const handleClothingImageSource = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClothingImage(event.target.value);
  };

  const handleClothingRetailerSource = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClothingRetailer(event.target.value);
  };

  const handleClothingBrand = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClothingBrand(event.target.value);
  };

  const handleColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  // called when the "Create" button is clicked
  const handleSubmit = async () => {
    if (!nodeTypes.includes(selectedType)) {
      setError("Error: No type selected");
      return;
    }
    if (title.length === 0) {
      setError("Error: No title");
      return;
    }

    // if (!description || description.length === 0) { // check if this is required ??
    //   setError("Error: Description is required");
    //   return;
    // }

    if (price === undefined) {
      setError("Error: Price input undefined");
      return;
    }

    if (selectedType === "clothingitem") {
      if (content === "" || clothingBrand === "" || color === "") {
        setError("Error: Missing input values");
        return;
      } else handleClothingContentChange();
    }
    const priceNumber = parseFloat(price);
    if (selectedType === "clothingitem") {
      if (isNaN(priceNumber)) {
        setError("Error: Price input is not a number");
        return;
      }
    }
    
 // Check if the selected parent node is an outfit node
  const isParentOutfitNode =
    selectedParentNode && selectedParentNode.type === "outfit";

  // Check if the current node being created is an outfit node
  const isCurrentNodeOutfitNode = selectedType === "outfit";

  // Check if the conditions for creating an outfit node within another outfit node are met
  if (isParentOutfitNode && isCurrentNodeOutfitNode) {
    setError("Error: Cannot create an outfit node within another outfit node");
    return;
  }

  const isParentClothingItemNode=
  selectedParentNode && selectedParentNode.type === "clothingitem";

// Check if the current node being moved is a clothing item node
const isCurrentNodeClothingItemNode = selectedType === "clothingitem";

// Check if the conditions for moving an CN node within another CN node are met
if (isParentClothingItemNode && isCurrentNodeClothingItemNode) {
  setError("Error: Cannot move CN within another CN");
  return;
}

// Check if the current node being moved is a clothing item node
const isCurrentNodeClothingItemNode1 = selectedType === "clothingitem";

// Check if the conditions for moving an ON node within another CN node are met
if (isParentClothingItemNode && isCurrentNodeOutfitNode) {
  setError("Error: Cannot move ON within another CN");
  return;
}
    if (selectedType === "outfit") {
    }

    const attributes = {
      content,
      nodeIdsToNodesMap,
      parentNodeId: selectedParentNode ? selectedParentNode.nodeId : null,
      title,
      type: selectedType as NodeType,
      clothingType: selectedClothingType as ClothingType,
      price: priceNumber,
      description,
      brand: clothingBrand,
      color,
    };
    const node = await createNodeFromModal(attributes); // creates a node based on these attributes 
    node && setSelectedNode(node);
    onSubmit();
    handleClose();
  };

  /** Reset all our state variables and close the modal */
  const handleClose = () => {
    onClose();
    setTitle("");
    setSelectedParentNode(null);
    setSelectedType("" as NodeType);
    setContent("");
    setClothingImage("");
    setSelectedClothingType("");
    setPrice("");
    setDescription("");
    setClothingRetailer("");
    setClothingBrand("");
    setColor("");
    setError("");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const link = files && files[0] && (await uploadImage(files[0]));
    link && setContent(link);
  };

  // content prompts for the different node types
  let contentInputPlaceholder: string;
  switch (selectedType) {
    case "text":
      contentInputPlaceholder = "Text content...";
      break;
    case "image":
      contentInputPlaceholder = "Image URL...";
      break;
    case "media":
      contentInputPlaceholder = "Temporal Media URL...";
      break;
    case "clothingitem":
      contentInputPlaceholder = "Clothing item image URL...";
      break;
    default:
      contentInputPlaceholder = "Content...";
  }

  const isImage: boolean = selectedType === "image";
  const isText: boolean = selectedType === "text";
  const isMedia: boolean = selectedType === "media";
  const isClothing: boolean = selectedType === "clothingitem"; //one out of the 2 types for CV
  const isOutfit: boolean = selectedType === "outfit"; //one out of the 2 types for CV

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new node</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="Title..."
            />
            <div className="modal-input">
              <Select
                value={selectedType}
                onChange={handleSelectedTypeChange}
                placeholder="Select a type"
              >
                {/* {nodeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))} */}
                <option key="outfit" value="outfit">
                  Outfit
                </option>
                <option key="clothingitem" value="clothingitem">
                  Clothing Item
                </option>
              </Select>
            </div>
            {selectedType && isClothing && (
              <div className="modal-input">
                <Select
                  value={selectedClothingType}
                  onChange={handleSelectedClothingTypeChange}
                  placeholder="Select a type"
                > 
                  {clothingTypesList.map((type) => ( // creates all of the types for clothingTypes for user selection
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {selectedType && isClothing && (
              <div className="modal-input">
                <Input
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Price in $..."
                />
              </div>
            )}

            {selectedType && isClothing && (
              <div className="modal-input">
                <Input
                  value={clothingBrand}
                  onChange={handleClothingBrand}
                  placeholder="Brand..."
                />
              </div>
            )}
            {selectedType && isClothing && (
              <div className="modal-input">
                <Input
                  value={color}
                  onChange={handleColor}
                  placeholder="Color..."
                />
              </div>
            )}

            {selectedType && isOutfit && (
              <div className="modal-input">
                <Textarea
                  value={description}
                  onChange={handleDescriptionContentChange}
                  placeholder="Outfit Description..."
                />
              </div>
            )}

            {selectedType && isClothing && (
              <div className="modal-input">
                <Textarea
                  value={description}
                  onChange={handleDescriptionContentChange}
                  placeholder="Item Description..."
                />
              </div>
            )}
            {selectedType && isImage && (
              <div className="modal-input">
                <Input
                  value={content}
                  onChange={handleImageContentChange}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isImage && (
              <div className="modal-input">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isMedia && (
              <div className="modal-input">
                <Input
                  value={content}
                  onChange={handleMediaContentChange}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isOutfit && (
              <div className="modal-input">
                <Input
                  value={content}
                  onChange={handleImageContentChange}
                  placeholder="Outfit image URL..."
                />
              </div>
            )}

            {selectedType && isClothing && (
              <div className="modal-input">
                <Input
                  value={content}
                  onChange={handleImageContentChange}
                  placeholder="Clothing image URL..."
                />
              </div>
            )}

            <div className="modal-section">
              <span className="modal-title">
                <div className="modal-title-header">
                  Choose a parent node (optional):
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
            </div>
          </ModalBody>
          <ModalFooter>
            {error.length > 0 && <div className="modal-error">{error}</div>}
            <div className="modal-footer-buttons">
              <Button text="Create" onClick={handleSubmit} />
            </div>
          </ModalFooter>
        </ModalContent>
      </div>
    </Modal>
  );
};
