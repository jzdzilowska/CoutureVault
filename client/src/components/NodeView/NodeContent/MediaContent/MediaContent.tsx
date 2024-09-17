import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentNodeState,
  selectedAnchorsState,
  selectedExtentState,
  isPlayingState,
} from "../../../../global/Atoms";

/** The content of a temporal media node */
export const MediaContent = () => {
  const currentNode = useRecoilValue(currentNodeState);
  const setSelectedExtent = useSetRecoilState(selectedExtentState);
  const [selectedAnchors, setSelectedAnchors] =
    useRecoilState(selectedAnchorsState);
  const [timestamp, setTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  /* Ref to the internal player */
  const mediaRef = useRef<ReactPlayer | null>(null);

  /* Upon change of a node (traversing a link) deselects all anchors - seeks to before */
  useEffect(() => {
    setSelectedAnchors([]);
  }, [currentNode]);

  /* Reselects the extent with timestamp progression */
  useEffect(() => {
    if (mediaRef.current) {
      setSelectedExtent({
        type: "media",
        timestamp: timestamp,
      });
    }
  }, [timestamp]);

  /* Compares selected (through a link click) anchors, and if their nodeId is the current node Id,
  seeks to the timestamp specified in their extent. Sets playing to true first to start playing on seek*/
  useEffect(() => {
    if (selectedAnchors && selectedAnchors.length > 0) {
      // Iterate through selected anchors
      for (const anchor of selectedAnchors) {
        // Check if anchor belongs to the current node
        if (anchor.nodeId === currentNode.nodeId) {
          // Check if extent and timestamp are available
          if (
            anchor.extent &&
            anchor.extent.type === "media" &&
            anchor.extent.timestamp
          ) {
            const linkTimestamp = anchor.extent.timestamp;
            const delay = 900;

            setTimeout(() => {
              setIsPlaying(true);
              navigateToTimestamp(linkTimestamp);
            }, delay);
          }
          // Break the loop if a matching anchor is found
          break;
        }
      }
    }
  }, [selectedAnchors, currentNode]);

  /* Navigates to timestamp - seeks to and starts playing; if num between 0 and 1 sets to 1 
  since otherwise indicates percent */
  function navigateToTimestamp(linkTimestamp: number) {
    if (mediaRef.current) {
      if (linkTimestamp > 0 && linkTimestamp < 1) {
        linkTimestamp = 1;
      }
      mediaRef.current.seekTo(linkTimestamp);
      setTimestamp(linkTimestamp);
    }
  }

  return (
    <div className="media" style={{ marginTop: 10 }}>
      <ReactPlayer
        controls={true}
        url={currentNode.content}
        ref={mediaRef}
        onProgress={(progress) => setTimestamp(progress.playedSeconds)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        playing={isPlaying}
        height={560}
        width={"80vw"}
      />
    </div>
  );
};
