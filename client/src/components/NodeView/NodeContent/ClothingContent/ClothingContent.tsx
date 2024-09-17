import React, { useEffect, useRef, useState } from "react";
import stc from "string-to-color";
import { nodeTypeIcon } from "~/global";
import { FrontendNodeGateway } from "~/nodes";
import { ClothingType, INode } from "~/types";
import { ImageContent } from "../ImageContent";
import "./ClothingContent.scss";

interface ClothingContentProps {
  price: number | undefined;
  clothingType: ClothingType | undefined;
  description: string | undefined;
  brand: string | undefined;
  color: string | undefined;
}

/**
 * Displays the content of a clothing item node, including details such as brand, color, price, and description.
 *
 * @component
 * @param {ClothingContentProps} props - Props for the ClothingContent component.
 * @returns {JSX.Element} The rendered ClothingContent component.
 */
export const ClothingContent = (props: ClothingContentProps) => {
  const { price, clothingType, description, brand, color } = props;

  return (
    <div className="clothing-info-all">
      {clothingType && (
        <div>
          <div
            className="cl-container"
            style={{ marginLeft: "150px", marginTop: "30px" }}
          >
            <p className="brand">
              <b>BRAND: </b>
              {brand}
            </p>
          </div>
          <div
            className="cl-container"
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "120px",
              marginLeft: "750px",
            }}
          >
            <p className="color">
              <b>COLOR: </b>
            </p>{" "}
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: stc(color),
                marginRight: "3px",
                marginLeft: "3px",
              }}
            ></div>
            <p>{color}</p>
          </div>
          <div
            className="cl-container"
            style={{ marginTop: "320px", marginLeft: "750px" }}
          >
            <p className="price">
              <b>PRICE: </b>
              {price && price.toFixed(2)}
            </p>
          </div>
          <div
            className="cl-container"
            style={{ marginLeft: "150px", marginTop: "330px" }}
          >
            <p>
              <b>DESCRIPTION: </b>
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
