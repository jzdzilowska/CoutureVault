import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FrontendAnchorGateway } from "../../../../anchors";
import {
  currentNodeState,
  refreshAnchorState,
  refreshLinkListState,
  refreshState,
  selectedExtentState,
} from "../../../../global/Atoms";
import { FrontendLinkGateway } from "../../../../links";
import { FrontendNodeGateway } from "../../../../nodes";
import {
  Extent,
  IServiceResponse,
  failureServiceResponse,
  makeINodeProperty,
  successfulServiceResponse,
} from "../../../../types";
import "./TextContent.scss";
import { TextMenu } from "./TextMenu";
import { Link } from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Heading } from "@tiptap/extension-heading";

/** The content of an text node, including all its anchors */
export const TextContent = () => {
  const currentNode = useRecoilValue(currentNodeState);
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const [anchorRefresh, setAnchorRefresh] = useRecoilState(refreshAnchorState);
  const [linkMenuRefresh, setLinkMenuRefresh] =
    useRecoilState(refreshLinkListState);
  const setSelectedExtent = useSetRecoilState(selectedExtentState);
  const [, setAlertIsOpen] = useState(false);
  const [, setAlertTitle] = useState("");
  const [, setAlertMessage] = useState("");

  // TODO: Add all of the functionality for a rich text editor!
  // (This file is where the majority of your work on text editing will be done)
  //const editor = null;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: false,
        linkOnPaste: false,
      }),
      Highlight,
      Text,
      TextStyle,
      Color,
      OrderedList,
      ListItem, // extensions for textEditor is added here
      Heading,
    ],
    content: currentNode.content,
  });

  /**
   * In this function, the content is updated based on the user's changes and we
   * save it to the database by clicking on the save button.
   */
  const handleSaveButtonClick = async () => {
    if (editor) {
      const updatedContent = editor.getHTML(); // current content is extracted
      // Save the updated content to the database
      await handleUpdateContent2(updatedContent); // nodes, anchors, and links are updated based on edited text

      // updateAnchorsInDatabase();
      // setOnSave(true);
    }
  };

  /**
   * Handle the update of content in the database and associated anchors.
   *
   * @param content The updated content to be saved
   * @returns {Promise<void>}
   */

  const handleUpdateContent2 = async (content: string) => {
    if (!editor) {
      return null;
    }

    try {
      // Create an INodeProperty for the content update
      const nodeProperty = makeINodeProperty("content", content);

      // Call API to update the content in the database
      const contentUpdateResp = await FrontendNodeGateway.updateNode(
        currentNode.nodeId,
        [nodeProperty]
      );

      if (!contentUpdateResp.success) {
        setAlertIsOpen(true);
        setAlertTitle("Content update failed");
        setAlertMessage(contentUpdateResp.message);
        return;
      }

      // Fetch all anchors associated with the current node
      const anchorsResponse = await FrontendAnchorGateway.getAnchorsByNodeId(
        currentNode.nodeId
      );

      if (anchorsResponse.success) {
        const anchorsInDatabase = anchorsResponse.payload;

        // Create a set to keep track of anchor IDs in the editor
        const anchorIdsInEditor = new Set();

        // Iterate through the document's descendants using a loop
        const anchorPromises: Promise<any>[] = [];

        editor.state.doc.descendants((node, pos) => {
          node.marks.forEach((mark) => {
            if (
              mark.type.name === "link" &&
              mark.attrs.target.startsWith("anchor")
            ) {
              const anchorId = mark.attrs.target;
              const text = node.text || "";

              const associatedAnchor = anchorsInDatabase.find(
                (anchor) => anchor.anchorId === anchorId
              );

              if (associatedAnchor) {
                const updatedExtent = {
                  type: "text",
                  startCharacter: pos,
                  endCharacter: pos + text.length,
                  text: node.text,
                } as Extent;
                anchorPromises.push(
                  FrontendAnchorGateway.updateExtent(
                    associatedAnchor.anchorId,
                    updatedExtent
                  )
                );

                // Mark this anchor as still in the editor
                anchorIdsInEditor.add(anchorId);
              }
            }
          });
        });

        const anchorsToDelete = anchorsInDatabase.filter(
          (dbAnchor) => !anchorIdsInEditor.has(dbAnchor.anchorId)
        );

        // Delete the anchors that are no longer in the editor and are orphaned
        for (const anchorToDelete of anchorsToDelete) {
          const anchorId = anchorToDelete.anchorId;

          // Get the list of links associated with this anchor
          const linksResponse = await FrontendLinkGateway.getLinksByAnchorId(
            anchorId
          );
          // checks if the request to fetch associated links was successful
          if (linksResponse.success) {
            const associatedLinks = linksResponse.payload;

            if (associatedLinks.length === 1) {
              // This anchor is associated with only one link and can be considered an orphan
              const linkId = associatedLinks[0].linkId;
              //is extracting the linkId from the first (and only) element in the associatedLinks array.

              // associated orphan case:
              // Delete the link
              await FrontendLinkGateway.deleteLinks([linkId]);
              //It deletes the associated link by calling FrontendLinkGateway.deleteLinks([linkId]). This ensures that the link is removed from the database.

              // Delete the anchor
              await FrontendAnchorGateway.deleteAnchor(anchorId);
              //It deletes the anchor itself by calling FrontendAnchorGateway.deleteAnchor(anchorId). This action removes the orphan anchor.
            }
          }
        }

        // Wait for all anchor updates and deletions to complete
        await Promise.all(anchorPromises);
        setRefresh(!refresh);
        setAnchorRefresh(!anchorRefresh);
        setLinkMenuRefresh(!linkMenuRefresh);
      } else {
        console.error("Failed to fetch anchors:", anchorsResponse.message);
      }
    } catch (error) {
      console.error("Error updating content and anchors:", error);
    }
  };

  /** This function adds anchor marks for anchors in the database to the text editor */
  const addAnchorMarks = async (): Promise<IServiceResponse<any>> => {
    if (!editor) {
      return failureServiceResponse("no editor");
    }
    const anchorResponse = await FrontendAnchorGateway.getAnchorsByNodeId(
      currentNode.nodeId
    );
    if (!anchorResponse || !anchorResponse.success) {
      return failureServiceResponse("failed to get anchors");
    }
    if (!anchorResponse.payload) {
      return successfulServiceResponse("no anchors to add");
    }
    for (let i = 0; i < anchorResponse.payload?.length; i++) {
      const anchor = anchorResponse.payload[i];
      const linkResponse = await FrontendLinkGateway.getLinksByAnchorId(
        anchor.anchorId
      );
      if (!linkResponse.success) {
        return failureServiceResponse("failed to get link");
      }
      const link = linkResponse.payload[0];
      let node = link.anchor1NodeId;
      if (node == currentNode.nodeId) {
        node = link.anchor2NodeId;
      }
      if (anchor.extent && anchor.extent.type == "text") {
        editor.commands.setTextSelection({
          from: anchor.extent.startCharacter + 1,
          to: anchor.extent.endCharacter + 1,
        });
        editor.commands.setLink({
          href: "/" + node + "/",
          target: anchor.anchorId,
        });
      }
    }
    return successfulServiceResponse("added anchors");
  };

  // Set the content and add anchor marks when this component loads
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(currentNode.content);
      addAnchorMarks();
    }
  }, [currentNode, editor]);

  // Set the selected extent to null when this component loads
  useEffect(() => {
    setSelectedExtent(null);
  }, [currentNode]);

  const onPointerUp = () => {
    if (!editor) {
      return;
    }
    const from = editor.state.selection.from;
    const to = editor.state.selection.to;
    const text = editor.state.doc.textBetween(from, to);
    if (from !== to) {
      const selectedExtent: Extent = {
        type: "text",
        startCharacter: from - 1,
        endCharacter: to - 1,
        text: text,
      };
      setSelectedExtent(selectedExtent);
    } else {
      setSelectedExtent(null);
    }
  };

  if (!editor) {
    return <div>{currentNode.content}</div>;
  }

  return (
    <div>
      <TextMenu editor={editor} handleSave={handleSaveButtonClick} />
      <EditorContent
        editor={editor}
        onPointerUp={onPointerUp}
        className="editorContent"
      />
    </div>
  );
};
