import React, { useEffect, useState } from "react";
import "./Comments.scss";
import { useRecoilValue } from "recoil";
import {
  refreshState,
  currentNodeState,
  anyNewCommentsState,
} from "~/global/Atoms";
import { IComment } from "~/types";
import { loadComments } from "./CommentsUtils";

/**
 * Comments component is responsible for displaying and managing comments related to the current node.
 * It automatically updates when there are new comments or a manual refresh is triggered.
 * @returns 
 */

export const Comments = () => {
  //Retrieve state for refreshing and tracking new comments
  const anyNewComments = useRecoilValue(anyNewCommentsState);
  const currentNode = useRecoilValue(currentNodeState);
  const refresh = useRecoilValue(refreshState);
  // State to store and manage comments for the current node
  const [comments, setComments] = useState<IComment[]>([]);

  // used to fetch comments and set the component's comments state with the result of loadComments
  useEffect(() => {
    const fetchComments = async () => {
      setComments(await loadComments({ currentNode }));
    };
    fetchComments();
  }, [currentNode, refresh, anyNewComments]);

  // function to render the comments and user name in a list
  const loadMenu = () => {
    return (
      <ul>
        {comments.map((comment, index) => (
          <div className="comment-container">
            <strong>{comment.name}:</strong> {comment.comment}
          </div>
        ))}
      </ul>
    );
  };
// return Comments component with the loaded comments
  return <div className="comments-container">{loadMenu()}</div>;
};
