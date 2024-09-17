import React from "react";
import { FrontendNodeGateway } from "~/nodes";
import { INode } from "~/types";
import { IComment } from "~/types";

export interface CommentsListProps {
  currentNode: INode;
}

/**
 * Function to asynchronously load comments for a given node.
 * @param props 
 * @returns {Promise<IComment[]>} A promise that resolves to an array of comments retrieved from the node.
 */
export const loadComments = async (props: CommentsListProps) => {
  const { currentNode } = props;
  // Async function to fetch and return comments
  const awaitComments = async () => {
     // Initialize an empty array to store comments
    let comments: IComment[] = [];
    // Fetch the updated node using the FrontendNodeGateway
    const nodeUpdated = await FrontendNodeGateway.getNode(currentNode.nodeId);
    if (nodeUpdated.success) {
      // Extract comments from the payload or initialize an empty array if comments are undefined
      comments =
      comments =
        nodeUpdated.payload.comments === undefined
          ? []
          : nodeUpdated.payload.comments;
    }
     // Return the retrieved comments
    return comments;
  };
   // Call the async function and return the result
  return awaitComments();
};
