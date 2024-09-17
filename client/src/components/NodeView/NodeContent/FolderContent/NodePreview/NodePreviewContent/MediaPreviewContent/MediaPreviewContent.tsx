import React from "react";
import "./MediaPreviewContent.scss";

interface IMediaPreviewProps {
  content: string;
}

/** The content of a media preview node*/
export const MediaPreviewContent = (props: IMediaPreviewProps) => {
  const { content } = props;

  /* extracts youtube video id to retrieve the thumbnail */
  function extractYouTubeVideoId(url: string): string | null {
    // match YouTube video ID
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    // extract the video ID using the regular expression
    const match = url.match(regex);
    // return the video ID or null if not found
    return match ? match[1] : "";
  }

  /* returns thumnail to be previewed */
  const returnContent = () => {
    if (content.includes("youtube")) {
      return (
        "https://img.youtube.com/vi/" +
        extractYouTubeVideoId(content) +
        "/mqdefault.jpg"
      );
    } else return content;
  };

  /**
   * Return the preview container if we are rendering a media preview
   */
  return (
    <div className="mediaContent-preview">
      <img src={returnContent()} alt="" />
    </div>
  );
};
