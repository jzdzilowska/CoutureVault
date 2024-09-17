import React, { useEffect, useCallback, useState } from "react";
import { FolderContentType, IOutfitNode, INode } from "../../../../types";
import "./FolderContent.scss";
import { GridView } from "./GridView";
import { ListView } from "./ListView";
import { useSetRecoilState } from "recoil";
import { selectedExtentState } from "../../../../global/Atoms";
import { FrontendNodeGateway } from "~/nodes";
import { background } from "@chakra-ui/react";
import { ImageContent } from "../ImageContent";

export interface IFolderContentProps {
  childNodes: INode[];
  node: IOutfitNode;
  onCreateNodeButtonClick: () => unknown;
  viewType?: FolderContentType;
  description: string | undefined;
  image: string | undefined;
}

/**
 * Full page view focused on a node's content, with annotations and links.
 *
 * @component
 * @param {IFolderContentProps} props - Props for the FolderContent component.
 * @returns {JSX.Element} The rendered FolderContent component.
 */
export const FolderContent = (props: IFolderContentProps) => {
  const { node, childNodes, onCreateNodeButtonClick, description } = props;
  const setSelectedExtent = useSetRecoilState(selectedExtentState);
  const [overallPrice, setOverallPrice] = useState("0");

  // useEffect to reset selected extent
  useEffect(() => {
    setSelectedExtent && setSelectedExtent(null);
  }, []);

   // useCallback to handle setting the view based on the node's view type
  const handleSetView = useCallback(() => {
    let nodes;
    switch ((node as IOutfitNode).viewType) {
      case "grid":
        nodes = (
          <GridView
            onCreateNodeButtonClick={onCreateNodeButtonClick}
            childNodes={childNodes}
          />
        );
        break;
      case "list":
        nodes = (
          <ListView
            onCreateNodeButtonClick={onCreateNodeButtonClick}
            childNodes={childNodes}
          />
        );
        break;
      default:
        nodes = null;
        break;
    }
    return nodes;
  }, [childNodes, node]);

  // useEffect to handle setting the view when the node's view type changes
  useEffect(() => {
    handleSetView();
  }, [node.viewType, handleSetView]);

   // useEffect to calculate the overall price of the outfit based on child nodes
  useEffect(() => {
    const listChildren = node.filePath.children;

    // Create an array of promises for each getNode call
    const promises = listChildren.map((child) => {
      return FrontendNodeGateway.getNode(child)
        .then((res) => {
          if (res.payload && res.payload.price) {
            return res.payload.price;
          }
          return 0; // Return 0 if price is not available
        })
        .catch((error) => {
          console.error(`Error fetching node ${child}:`, error);
          return 0; // Return 0 in case of an error
        });
    });

    // Wait for all promises to resolve
    Promise.all(promises)
      .then((prices) => {
        // Calculate overall price by summing all prices
        const total = prices.reduce((acc, price) => acc + price, 0);
        const roundedPrice = Math.round(total * 100) / 100;
        setOverallPrice(roundedPrice.toFixed(2));
      })
      .catch((error) => {
        console.error("Error in Promise.all:", error);
      });
  }, [node]);

  <div
    style={{
      display: "flex",
      padding: "24px",
      margin: "22px",
      borderRadius: "4px",
      backgroundColor: "#f9ecf3",
    }}
  >
    <div style={{ flex: 1, marginRight: "20px" }}>
      <ImageContent />
    </div>
    <div style={{ flex: 2 }}></div>
  </div>;

  return (
    <div className="fullWidthFolder">
      {description !== "homepage" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: "100%",
            margin: "20px",
            marginBottom: "-5px",
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 0 5px grey",
          }}
        >
          <div style={{ flex: "1" }}>
            <ImageContent />
          </div>
          <div style={{ flex: "2", marginLeft: "0" }}>
            <div
              style={{
                padding: "20px",
                borderRadius: "4px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "darkgray",
                }}
              >
                OVERALL OUTFIT PRICE
              </p>
              <h1
                style={{
                  fontSize: "20px",
                  marginBottom: "20px",
                }}
              >
                ${overallPrice}
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "darkgray",
                }}
              >
                DESCRIPTION
              </p>
              <p
                style={{
                  fontSize: "18px",
                }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      )}
      {handleSetView()}
    </div>
  );
};
