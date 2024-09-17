import { Editor } from "@tiptap/react";
import "./TextMenu.scss";
import { useState } from "react";
import * as ai from "react-icons/ai";
import * as lia from "react-icons/lia";
import * as lu from "react-icons/lu";
import { PiListNumbers } from "react-icons/pi";

interface IEditorProps {
  editor: Editor | null;
  handleSave: () => void; // A callback function for saving edited text
}

/**
 * TextMenu component represents the menu for text formatting.
 *
 * @param props - The component props including the text editor (its features) and save handler.
 * @returns The TextMenu component.
 */
export const TextMenu = (props: IEditorProps) => {
  const { editor, handleSave } = props;
  // State to track if saving is in progress
  const [isSaving, setIsSaving] = useState(false);

  if (!editor) {
    return null;
  }

  /**
   * Function to handle save button click functionality
   */
  const handleSaveClick = () => {
    setIsSaving(true);
    handleSave(); // logic of saving edited text is called here, logic was made in textContent.tsx
    setIsSaving(false);
  };

  // TODO: Add a menu of buttons for your text editor here
  return (
    <div id="textMenu">
      <button // bold button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          "textEditorButton" +
          (editor.isActive("bold") ? " activeTextEditorButton" : "")
        }
      >
        <span className="icon">
          <ai.AiOutlineBold />
        </span>
      </button>
      <button // italic button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          "textEditorButton" +
          (editor.isActive("italic") ? " activeTextEditorButton" : "")
        }
      >
        <span className="icon">
          <ai.AiOutlineItalic />
        </span>
      </button>

      <button // highlight button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        className={
          "textEditorButton" +
          (editor.isActive("highlight") ? " activeTextEditorButton" : "")
        }
      >
        <span className="icon">
          <lia.LiaMarkerSolid />
        </span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={
          "textEditorButton" +
          (editor.isActive("heading", { level: 1 })
            ? " activeTextEditorButton"
            : "")
        }
      >
        <span className="icon">
          <lu.LuHeading1 />
        </span>
      </button>

      <button // h3 button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={
          "textEditorButton" +
          (editor.isActive("orderedList") ? " activeTextEditorButton" : "")
        }
      >
        <span className="icon">
          <PiListNumbers />
        </span>
      </button>

      <button
        onClick={handleSaveClick}
        disabled={isSaving}
        className={`saveEditorButton ${
          isSaving ? "activeTextEditorButton" : ""
        }`}
      >
        <span className="icon">
          <ai.AiOutlineCheck />
        </span>
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};
