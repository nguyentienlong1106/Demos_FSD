import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";

import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
// import { useDebouncedCallback } from "use-debounce";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const parentNode = anchorNode.getParent();

      let headingType = "";
      if (parentNode && $isHeadingNode(parentNode)) {
        headingType = parentNode.getTag(); // Gọi getTag() nếu là HeadingNode
      }

      // Cập nhật kiểu tiêu đề đang được chọn
      setActiveHeading(headingType);

      // Cập nhật các định dạng văn bản
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  // const handleSave = useDebouncedCallback((content) => {
  //   console.log(content);
  // }, 100);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });

        // , dirtyElements, dirtyLeaves
        // if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
        //   return;
        // }
        // handleSave(JSON.stringify(editorState));
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]); // , handleSave

  const LowPriority = 1;

  const handleHeadingToggle = (headingType: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection || !$isRangeSelection(selection)) {
        console.error("Invalid selection. Ensure text is selected.");
        return;
      }

      const anchorNode = selection.anchor.getNode();
      const parentNode = anchorNode.getParent();

      let isCurrentHeading = false;

      // Kiểm tra nếu parentNode là HeadingNode và lấy tag
      if (parentNode && $isHeadingNode(parentNode)) {
        isCurrentHeading = parentNode.getTag() === headingType;
      }

      // Nếu đang là heading hiện tại, chuyển về paragraph
      if (isCurrentHeading) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        // Ngược lại, chuyển thành heading (H1, H2, H3, H4)
        $setBlocksType(selection, () =>
          $createHeadingNode(headingType as HeadingTagType)
        );
      }
    });
  };

  return (
    <div
      className="border-b-2 bg-slate-100 flex gap-2 overflow-x-auto"
      ref={toolbarRef}
    >
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="size-8 hover:bg-gray-200 mx-3"
        aria-label="Undo"
        type="button"
      >
        <RotateCcw className="scale-75" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="size-8 hover:bg-gray-200"
        aria-label="Redo"
        type="button"
      >
        <RotateCw className="scale-75" />
      </button>
      <div className="w-[1px] bg-gray-400 m-1"></div>
      <button
        className={`font-bold size-8 ${isBold ? "bg-gray-200" : ""}`}
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`px-3 italic size-8 ${isItalic ? "bg-gray-200" : ""}`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={`underline size-8 ${isUnderline ? "bg-gray-200" : ""}`}
      >
        U
      </button>
      <div className="w-[1px] bg-gray-400 m-1"></div>
      <button
        type="button"
        onClick={() => handleHeadingToggle("h1")}
        className={`size-8 hover:bg-gray-200 ${
          activeHeading === "h1" ? "bg-gray-200" : ""
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => handleHeadingToggle("h2")}
        className={`size-8 hover:bg-gray-200 ${
          activeHeading === "h2" ? "bg-gray-200" : ""
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => handleHeadingToggle("h3")}
        className={`size-8 hover:bg-gray-200 ${
          activeHeading === "h3" ? "bg-gray-200" : ""
        }`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => handleHeadingToggle("h4")}
        className={`size-8 hover:bg-gray-200 ${
          activeHeading === "h4" ? "bg-gray-200" : ""
        }`}
      >
        H4
      </button>
      <div className="w-[1px] bg-gray-400 m-1"></div>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="size-8 hover:bg-gray-200 ml-2"
        aria-label="Left Align"
      >
        <AlignLeft />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="size-8 hover:bg-gray-200"
        aria-label="Center Align"
      >
        <AlignCenter />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="size-8 hover:bg-gray-200"
        aria-label="Right Align"
      >
        <AlignRight />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <AlignJustify />
      </button>{" "}
    </div>
  );
}
