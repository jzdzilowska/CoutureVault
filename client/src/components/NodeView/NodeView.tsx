import React, { useCallback, useEffect, useRef, useState } from "react";
import { FrontendAnchorGateway } from "../../anchors";
import { generateObjectId } from "../../global";
import {
  IAnchor,
  IComment,
  INode,
  isSameExtent,
  NodeIdsToNodesMap,
} from "../../types";
import { NodeBreadcrumb } from "./NodeBreadcrumb";
import { NodeContent } from "./NodeContent";
import { NodeHeader } from "./NodeHeader";
import { NodeLinkMenu } from "./NodeLinkMenu";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isLinkingState,
  refreshState,
  startAnchorState,
  endAnchorState,
  selectedAnchorsState,
  selectedExtentState,
  alertOpenState,
  alertTitleState,
  alertMessageState,
  currentNodeState,
  isPlayingState,
} from "../../global/Atoms";
import "./NodeView.scss";
import { FrontendNodeGateway } from "~/nodes/FrontendNodeGateway";

export interface INodeViewProps {
  currentNode: INode;
  // map of nodeIds to nodes
  nodeIdsToNodesMap: NodeIdsToNodesMap;
  // handler for completing link
  onCompleteLinkClick: () => void;
  // handler for opening create node modal
  onCreateNodeButtonClick: () => void;
  // handler for deleting currentNode
  onDeleteButtonClick: (node: INode) => void;
  // handler for opening move node modal
  onMoveButtonClick: (node: INode) => void;
  // children used when rendering outfit node
  childNodes?: INode[];
}

/** Full page view focused on a node's content, with annotations and links */
export const NodeView = (props: INodeViewProps) => {
  const {
    currentNode,
    nodeIdsToNodesMap,
    onCompleteLinkClick,
    onCreateNodeButtonClick,
    onDeleteButtonClick,
    onMoveButtonClick,

    childNodes,
  } = props;
  const setIsPlaying = useSetRecoilState(isPlayingState);
  const setIsLinking = useSetRecoilState(isLinkingState);
  const [startAnchor, setStartAnchor] = useRecoilState(startAnchorState);
  const setEndAnchor = useSetRecoilState(endAnchorState);
  const setSelectedAnchors = useSetRecoilState(selectedAnchorsState);
  const selectedExtent = useRecoilValue(selectedExtentState);
  const refresh = useRecoilValue(refreshState);
  const [anchors, setAnchors] = useState<IAnchor[]>([]);
  const setAlertIsOpen = useSetRecoilState(alertOpenState);
  const setAlertTitle = useSetRecoilState(alertTitleState);
  const setAlertMessage = useSetRecoilState(alertMessageState);
  const setCurrentNode = useSetRecoilState(currentNodeState);
  const {
    filePath: { path },
  } = currentNode;
  setCurrentNode(currentNode);

  const loadAnchorsFromNodeId = useCallback(async () => {
    const anchorsFromNode = await FrontendAnchorGateway.getAnchorsByNodeId(
      currentNode.nodeId
    );
    if (anchorsFromNode.success) {
      setAnchors(anchorsFromNode.payload);
    }
  }, [currentNode]);

  const handleStartLinkClick = () => {
    setIsPlaying(false); // stops the media on a create link click
    if (selectedExtent === undefined) {
      setAlertIsOpen(true);
      setAlertTitle("Cannot start link from this anchor");
      setAlertMessage(
        "There are overlapping anchors, or this anchor contains other anchors. Before you create this anchor you must remove the other anchors."
      );
    } else {
      const anchor = {
        anchorId: generateObjectId("anchor"),
        extent: selectedExtent,
        nodeId: currentNode.nodeId,
      };
      setStartAnchor(anchor);
      setIsLinking(true);
    }
  };

  const handleCompleteLinkClick = async () => {
    setIsPlaying(false); // stops the video on complete link click (before closing modal)
    const anchorsByNodeResp = await FrontendAnchorGateway.getAnchorsByNodeId(
      currentNode.nodeId
    );
    let anchor2: IAnchor | undefined = undefined;
    if (anchorsByNodeResp.success && selectedExtent !== undefined) {
      anchorsByNodeResp.payload?.forEach((nodeAnchor) => {
        if (isSameExtent(nodeAnchor.extent, selectedExtent)) {
          anchor2 = nodeAnchor;
        }
        if (
          startAnchor &&
          isSameExtent(nodeAnchor.extent, startAnchor.extent) &&
          startAnchor.nodeId == currentNode.nodeId
        ) {
          setStartAnchor(nodeAnchor);
        }
      });
    }
    if (selectedExtent !== undefined) {
      anchor2 = {
        anchorId: generateObjectId("anchor"),
        extent: selectedExtent,
        nodeId: currentNode.nodeId,
      };
      setEndAnchor(anchor2);
      onCompleteLinkClick();
    }
  };

  useEffect(() => {
    loadAnchorsFromNodeId();
  }, [loadAnchorsFromNodeId, currentNode, refresh, setSelectedAnchors]);

  const hasBreadcrumb: boolean = path.length > 1;
  const hasAnchors: boolean = anchors.length > 0;
  let nodePropertiesWidth: number = hasAnchors ? 200 : 0;
  const nodeViewWidth = `calc(100% - ${nodePropertiesWidth}px)`;

  const nodeProperties = useRef<HTMLHeadingElement>(null);
  const divider = useRef<HTMLHeadingElement>(null);
  let xLast: number;
  let dragging = false;

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    xLast = e.screenX;
    document.removeEventListener("pointermove", onPointerMove);
    document.addEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (divider.current) divider.current.style.width = "10px";
    if (nodeProperties.current && dragging) {
      const nodePropertiesElement = nodeProperties.current;
      let width = parseFloat(nodePropertiesElement.style.width);
      const deltaX = e.screenX - xLast; // The change in the x location
      const newWidth = (width -= deltaX);
      if (!(newWidth < 200 || newWidth > 480)) {
        nodePropertiesElement.style.width = String(width) + "px";
        nodePropertiesWidth = width;
        xLast = e.screenX;
      }
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
    if (divider.current) divider.current.style.width = "";
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const response = await FrontendNodeGateway.getComments(
  //         currentNode.nodeId
  //       );
  //       console.log("these are the comments" + response.payload);
  //       if (response.success) {
  //         setComments(response.payload);
  //       } else {
  //         console.error("Error fetching comments:", response.message);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching comments:", error);
  //     }
  //   };

  //   fetchComments();
  // }, [currentNode.nodeId, refresh, setSelectedAnchors]);

  return (
    <div className="node">
      <div className="nodeView" style={{ width: nodeViewWidth }}>
        {currentNode.title !== "MyHypermedia Dashboard" && (
          <NodeHeader
            onMoveButtonClick={onMoveButtonClick}
            onDeleteButtonClick={onDeleteButtonClick}
            onHandleStartLinkClick={handleStartLinkClick}
            onHandleCompleteLinkClick={handleCompleteLinkClick}
          />
        )}
        <div className="nodeView-scrollable">
          {hasBreadcrumb && (
            <div className="nodeView-breadcrumb">
              <NodeBreadcrumb
                path={path}
                nodeIdsToNodesMap={nodeIdsToNodesMap}
              />
            </div>
          )}
          <div className=""></div>
          <div className="nodeView-content">
            <NodeContent
              childNodes={childNodes}
              // childNodes={childNodes} //childNodes
              onCreateNodeButtonClick={onCreateNodeButtonClick}
            />
          </div>
        </div>
      </div>

      {hasAnchors && (
        <div className="divider" ref={divider} onPointerDown={onPointerDown} />
      )}
      {hasAnchors && (
        <div
          className={"nodeProperties"}
          ref={nodeProperties}
          style={{ width: nodePropertiesWidth }}
        >
          <NodeLinkMenu nodeIdsToNodesMap={nodeIdsToNodesMap} />
        </div>
      )}
    </div>
  );
};
