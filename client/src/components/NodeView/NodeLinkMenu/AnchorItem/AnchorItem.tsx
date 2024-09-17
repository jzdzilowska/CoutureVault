import React from "react";
import * as ri from "react-icons/ri";
import { FrontendAnchorGateway } from "../../../../anchors";
import { FrontendLinkGateway } from "../../../../links";
import { Extent, IAnchor, ILink, INode } from "../../../../types";
import { ContextMenuItems } from "../../../ContextMenu";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  refreshState,
  selectedAnchorsState,
  alertOpenState,
  alertTitleState,
  alertMessageState,
} from "../../../../global/Atoms";
import "./AnchorItem.scss";

export interface IAnchorItemProps {
  linkItems: any;
  anchorsMap: {
    [anchorId: string]: {
      anchor: IAnchor;
      links: { link: ILink; oppNode: INode; oppAnchor: IAnchor }[];
    };
  };
  anchorId: string;
  extent: Extent | null;
  isAnchorSelected: boolean;
}

export const AnchorItem = (props: IAnchorItemProps) => {
  const { extent, isAnchorSelected, linkItems, anchorsMap, anchorId } = props;
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const setSelectedAnchors = useSetRecoilState(selectedAnchorsState);
  const setAlertIsOpen = useSetRecoilState(alertOpenState);
  const setAlertTitle = useSetRecoilState(alertTitleState);
  const setAlertMessage = useSetRecoilState(alertMessageState);

  const handleAnchorDelete = async (anchorId: string) => {
    const anchorLinks = anchorsMap[anchorId].links;
    const linkIds: string[] = [];
    anchorLinks.forEach((anchorLink) => {
      linkIds.push(anchorLink.link.linkId);
    });
    const deleteLinksResp = await FrontendLinkGateway.deleteLinks(linkIds);
    if (!deleteLinksResp.success) {
      setAlertIsOpen(true);
      setAlertTitle("Delete links failed");
      setAlertMessage(deleteLinksResp.message);
    }

    const deleteAnchorResp = await FrontendAnchorGateway.deleteAnchor(anchorId);
    if (!deleteAnchorResp.success) {
      setAlertIsOpen(true);
      setAlertTitle("Delete anchors failed");
      setAlertMessage(deleteAnchorResp.message);
    }
    setRefresh(!refresh);
  };

  /* Method called on link right click */
  const handleAnchorRightClick = () => {
    // Open custom context menu
    ContextMenuItems.splice(1, ContextMenuItems.length);
    const menuItem: JSX.Element = (
      <div
        key={"anchorDelete"}
        className="contextMenuItem"
        onClick={() => {
          ContextMenuItems.splice(0, ContextMenuItems.length);
          handleAnchorDelete(anchorId);
        }}
      >
        <div className="itemText">
          <ri.RiDeleteBin6Line />
          Delete anchor
        </div>
      </div>
    );
    ContextMenuItems.push(menuItem);
  };

  return (
    <div
      className={`anchorItem ${isAnchorSelected ? "selected" : ""}`}
      key={anchorId}
      onContextMenu={handleAnchorRightClick}
      onClick={() => {
        setSelectedAnchors([anchorsMap[anchorId].anchor]);
      }}
    >
      <div className="anchorContent">
        <div className="anchorInfo">
          {extent?.type === "media" && extent?.timestamp
            ? "Media anchor on " + Math.floor(extent.timestamp) + " second"
            : "Media anchor on whole node"}
        </div>
      </div>
      {linkItems}
    </div>
  );
};
