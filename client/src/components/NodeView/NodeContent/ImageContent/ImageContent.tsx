import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ri from "react-icons/ri";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { fetchAnchors, fetchLinks } from "../TextContent";
import {
  currentNodeState,
  refreshState,
  selectedAnchorsState,
  selectedExtentState,
  startAnchorState,
} from "../../../../global/Atoms";
import {
  failureServiceResponse,
  IAnchor,
  IImageExtent,
} from "../../../../types";
import "./ImageContent.scss";
import { FrontendAnchorGateway } from "~/anchors/FrontendAnchorGateway";
import { includesAnchorId } from "../../NodeLinkMenu/nodeLinkMenuUtils";
import { nodeTypeIcon } from "~/global";

/** The content of an image node, including any anchors */
export const ImageContent = () => {
  const currentNode = useRecoilValue(currentNodeState);
  const refresh = useRecoilValue(refreshState);
  const startAnchor = useRecoilValue(startAnchorState);
  const [selectedAnchors, setSelectedAnchors] =
    useRecoilState(selectedAnchorsState);
  const setSelectedExtent = useSetRecoilState(selectedExtentState);
  let dragging = false; // Indicated whether we are currently dragging the image
  let currentTop: number; // To store the top of the currently selected region for onMove
  let currentLeft: number; // To store the left of the currently selected region for onMove
  let xSelectionLast: number; // To store the last x for resizing the selection
  let ySelectionLast: number; // To store the last y for resizing the selection

  /**
   * useRef EXAMPLE: Here is an example of use ref to store a mutable html object
   * The selection ref is how we can access the selection that we render
   */
  const imageContainer = useRef<HTMLHeadingElement>(null);
  const selection = useRef<HTMLHeadingElement>(null);

  /* State variable to keep track of anchors rendered on image */
  const [imageAnchors, setImageAnchors] = useState<JSX.Element[]>([]);

  /**
   * State variable to keep track of the currently selected anchor IDs.
   * Compare with selectedAnchors to update previous state
   */
  const [selectedAnchorIds] = useState<string[]>([]);

  const router = useRouter();

  /**
   * Handle click on anchor that is displayed on image
   * Single click: Select the anchor
   * Double click: Navigate to the opposite node
   */
  const handleAnchorSelect = async (e: React.MouseEvent, anchor: IAnchor) => {
    e.stopPropagation();
    e.preventDefault();
    const links = await fetchLinks(anchor.anchorId);
    const anchors = await fetchAnchors(links);
    if (links.length > 0) {
      if (links[0].anchor1Id !== anchor.anchorId) {
        router.push(`/${links[0].anchor1NodeId}/`);
      } else if (links[0].anchor2Id !== anchor.anchorId) {
        router.push(`/${links[0].anchor2NodeId}/`);
      }
      setSelectedExtent(anchor.extent);
      setSelectedAnchors(anchors);
    }
  };

  /**
   * // TODO [Lab]: This method displays the existing anchors.
   * Normally we would fetch these from the database, but for the simplicity
   * of this lab we are randomly generating them in the `imageAnchors.ts` file in the
   * `ImageContent` folder.
   *
   * Hints:
   * We want to loop through our list of existing anchors and have access and render
   * them on top of the image.
   *
   * You will also want to make sure that it renders ON TOP of the image, so you should
   * look into changing the SCSS for whatever you render (hint: use absolute!)
   *
   * // TODO [Assignment]
   * During the assignment, you should change this to display this node's anchors instead
   */
  const displayImageAnchors = useCallback(async () => {
    const imageWidth = imageContainer.current?.getBoundingClientRect().width;
    const imageHeight = imageContainer.current?.getBoundingClientRect().height;

    // Step 1: We want to fill this list with divs to render on top of our image!
    const anchorElementList: JSX.Element[] = [];
    if (imageWidth && imageHeight) {
      const getAnchorResponse = await FrontendAnchorGateway.getAnchorsByNodeId(
        currentNode.nodeId
      );

      if (!getAnchorResponse.success) {
        return failureServiceResponse("Unable to get anchors by nodeId.");
      }

      const imageAnchors = getAnchorResponse.payload;

      if (startAnchor && startAnchor.extent?.type == "image") {
        anchorElementList.push(
          <div
            id={startAnchor.anchorId}
            key={"image." + startAnchor.anchorId}
            className="image-startAnchor"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              height: startAnchor.extent.height,
              left: startAnchor.extent.left,
              top: startAnchor.extent.top,
              width: startAnchor.extent.width,
            }}
          ></div>
        );
      }

      // Step 2: Loop through our anchors and add the div to the list we created in Step 1
      imageAnchors.forEach((anchor) => {
        if (
          anchor.extent === null &&
          imageContainer.current &&
          includesAnchorId(anchor.anchorId, selectedAnchors)
        ) {
          imageContainer.current.style.border = "2px solid blue";
        } else if (imageContainer.current) {
          imageContainer.current.style.border = "white";
        }

        if (anchor.extent?.type == "image") {
          // TODO: Add div to
          if (includesAnchorId(anchor.anchorId, selectedAnchors)) {
            anchorElementList.push(
              <div
                id={anchor.anchorId}
                key={"image." + anchor.anchorId}
                className="image-anchor selected"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  height: anchor.extent.height,
                  left: anchor.extent.left,
                  top: anchor.extent.top,
                  width: anchor.extent.width,
                }}
              ></div>
            );
          } else {
            anchorElementList.push(
              <div
                id={anchor.anchorId}
                key={"image." + anchor.anchorId}
                className="image-anchor"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  height: anchor.extent.height,
                  left: anchor.extent.left,
                  top: anchor.extent.top,
                  width: anchor.extent.width,
                }}
                onClick={(e) => {
                  handleAnchorSelect(e, anchor);
                }}
              />
            );
          }
        }
      });

      console.log(anchorElementList);

      // Step 3: Call setImageAnchors and pass the filled anchorElementList that you just created
      setImageAnchors(anchorElementList);
    }
  }, [currentNode, startAnchor, selectedAnchorIds, selectedAnchors]);

  /**
   * To trigger on load and when we setSelectedExtent
   */
  useEffect(() => {
    setSelectedExtent && setSelectedExtent(null);
    if (selection.current) {
      selection.current.style.left = "-50px";
      selection.current.style.top = "-50px";
      selection.current.style.width = "0px";
      selection.current.style.height = "0px";
    }
  }, [setSelectedExtent, refresh]);

  useEffect(() => {
    displayImageAnchors();
  }, [selectedAnchors, currentNode, refresh, startAnchor]);

  /* onSelectionPointerDown initializes the selection */
  const onSelectionPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    // The y location of the image top in the browser
    const imageTop = imageContainer.current?.getBoundingClientRect().top;
    // The x location of the image left in the browser
    const imageLeft = imageContainer.current?.getBoundingClientRect().left;

    const x = e.clientX; // The x location of the pointer in the browser
    const y = e.clientY; // The y location of the pointer in the browser
    xSelectionLast = e.clientX;
    ySelectionLast = e.clientY;
    if (selection.current && imageLeft && imageTop) {
      selection.current.style.left = String(x - imageLeft) + "px";
      selection.current.style.top = String(y - imageTop) + "px";
      currentLeft = x - imageLeft;
      currentTop = y - imageTop;
      selection.current.style.width = "0px";
      selection.current.style.height = "0px";
    }
    document.removeEventListener("pointermove", onSelectionPointerMove);
    document.addEventListener("pointermove", onSelectionPointerMove);
    document.removeEventListener("pointerup", onSelectionPointerUp);
    document.addEventListener("pointerup", onSelectionPointerUp);
  };

  /* onMove resizes the selection */
  const onSelectionPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragging) {
      const x = e.clientX; // The x location of the pointer in the browser
      const y = e.clientY; // The y location of the pointer in the browser
      const deltaX = x - xSelectionLast; // The change in the x location
      const deltaY = y - ySelectionLast; // The change in the y location
      xSelectionLast = e.clientX;
      ySelectionLast = e.clientY;

      if (selection.current) {
        const imageTop = imageContainer.current?.getBoundingClientRect().top;
        const imageLeft = imageContainer.current?.getBoundingClientRect().left;
        let left = parseFloat(selection.current.style.left);
        let top = parseFloat(selection.current.style.top);
        let width = parseFloat(selection.current.style.width);
        let height = parseFloat(selection.current.style.height);

        // Horizontal dragging
        // Case A: Dragging above start point
        if (imageLeft && x - imageLeft < currentLeft) {
          width -= deltaX;
          left += deltaX;
          selection.current.style.left = String(left) + "px";
          // Case B: Dragging below start point
        } else {
          width += deltaX;
        }

        // Vertical dragging
        // Case A: Dragging to the left of start point
        if (imageTop && y - imageTop < currentTop) {
          height -= deltaY;
          top += deltaY;
          selection.current.style.top = String(top) + "px";
          // Case B: Dragging to the right of start point
        } else {
          height += deltaY;
        }

        // Update height and width
        selection.current.style.width = String(width) + "px";
        selection.current.style.height = String(height) + "px";
      }
    }
  };

  /**
   * onSelectionPointerUp so we have completed making our selection,
   * therefore we should create a new IImageExtent and
   * update the currently selected extent
   * @param e
   */
  const onSelectionPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
    if (selection.current) {
      currentTop = 0;
      currentLeft = 0;
      const extent: IImageExtent = {
        type: "image",
        height: parseFloat(selection.current.style.height),
        left: parseFloat(selection.current.style.left),
        top: parseFloat(selection.current.style.top),
        width: parseFloat(selection.current.style.width),
      };
      // Check if setSelectedExtent exists, if it does then update it
      if (setSelectedExtent) {
        setSelectedExtent(extent);
      }
    }
    // Remove pointer event listeners
    document.removeEventListener("pointermove", onSelectionPointerMove);
    document.removeEventListener("pointerup", onSelectionPointerUp);
  };

  const onHandleClearSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (setSelectedExtent) {
      setSelectedExtent(null);
      if (selection.current) {
        // Note: This is a rather hacky solution to hide the selected region
        selection.current.style.left = "-50px";
        selection.current.style.top = "-50px";
        selection.current.style.width = "0px";
        selection.current.style.height = "0px";
      }
    }
  };

  return (
    <div className="imageWrapper">
      <div
        ref={imageContainer}
        onPointerDown={onSelectionPointerDown}
        className="imageContainer"
      >
        <div className="image">
          {
            <div className="selection" ref={selection}>
              <div
                onClick={onHandleClearSelectionClick}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="selection-close"
              >
                <ri.RiCloseFill />
              </div>
            </div>
          }
          {imageAnchors}
          {currentNode.content !== "" && (
            <img src={currentNode.content} alt={currentNode.title} />
          )}
          {currentNode.content === "" && (
            <div className="noImage">
              {nodeTypeIcon(
                currentNode.type,
                currentNode.clothingType || "shirt"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
