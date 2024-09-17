import { useState } from "react";
import { FrontendNodeGateway } from "../../nodes/FrontendNodeGateway";
import {
  makeIComment,
  INode,
  IComment,
  INodeProperty,
  makeINodeProperty,
} from "../../types";
import "./CommentForm.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  alertOpenState,
  alertTitleState,
  alertMessageState,
  refreshState,
  currentNodeState,
  anyNewCommentsState,
  userSessionState,
} from "~/global/Atoms";

/**
 * CommentForm that handles user input and updates the commentsArray of the comment field of the currentNode 
 * with the entered text and triggers the necessary actions to save the comment in the database. 
 * @param param0 
 * @returns 
 */

export const CommentForm: React.FC = ({}) => {
  //alert states 
  const setAlertIsOpen = useSetRecoilState(alertOpenState);
  const setAlertTitle = useSetRecoilState(alertTitleState);
  const setAlertMessage = useSetRecoilState(alertMessageState);
  //comment states 
  const setAnyNewComments = useSetRecoilState(anyNewCommentsState);
  const [userComment, setUserComment] = useState("");
  // name states (used to get the user name from their gmail account)
  const userSession = useRecoilValue(userSessionState);
  
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const currentNode = useRecoilValue(currentNodeState);


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // current state is gotten for new comment 
    const timestamp = new Date().toISOString();
    try {
      // fetch current node based on node id 
      const nodeBerResp = await FrontendNodeGateway.getNode(currentNode.nodeId);
      // extract existing comments or intialize an empty array to hold comments 
      const oldComments = nodeBerResp.payload?.comments ?? [];
      // creates a new comment object 
      const newComment = makeIComment(userSession.name, userComment, timestamp);
      // updates array of comments with the new comment 
      const updatedComments = [...oldComments, newComment];
      // creates a node property for comments in order to save the comment in the comments field in mongodb 
      const nodeProperty: INodeProperty = makeINodeProperty(
        "comments",
        updatedComments
      );
      // updates node with new comments 
      const response = await FrontendNodeGateway.updateNode(
        currentNode.nodeId,
        [nodeProperty]
      );
      // handles errors if the comment field of node can't be updated 
      if (!response.success) {
        setAlertIsOpen(true);
        setAlertTitle("Delete node failed");
        setAlertMessage("Delete node failed in MainView.tsx");
        return;
      }
      // when comments field is successfully updates then "comment input is resetted" and these changes occur 
      setUserComment("");
      setRefresh(!refresh);
      setAnyNewComments(true);
      setAnyNewComments(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // how comment user input UI is rendered 
  return (
    <div className="form-container">
      <input
        type="comment"
        placeholder="Anything?"
        value={userComment}
        onChange={(e) => setUserComment(e.target.value)}
      />
      <button onClick={handleSubmit}>Comment</button>
    </div>
  );
};
