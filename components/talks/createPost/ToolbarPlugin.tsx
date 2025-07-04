import "./styles.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { toggleCodeBlock } from './helpers';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export interface ToolbarPluginProps {
  changeBold: boolean;
  setIsBold: (isBold: boolean) => void;
  changeItalic: boolean;
  setIsItalic: (isItalic: boolean) => void;
  changeUnderline: boolean;
  setIsUnderline: (isUnderline: boolean) => void;
  changeCodeBlock: boolean;
  changeHighlight: boolean;
  setIsHighlight: (isHighlight: boolean) => void;
  changeHeading: boolean;
  setIsHeading: (isHeading: boolean) => void;
  undo: boolean;
  redo: boolean;
}

export default function ToolbarPlugin({ changeBold,
  setIsBold,
  changeItalic,
  setIsItalic,
  changeUnderline,
  setIsUnderline,
  changeCodeBlock,
  changeHighlight,
  setIsHighlight,
  changeHeading,
  setIsHeading,
  undo,
  redo
}: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }, [changeBold, editor])

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [changeItalic, editor])

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }, [changeUnderline, editor])

  useEffect(() => {
    toggleCodeBlock(editor);
  }, [changeCodeBlock, editor])

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
  }, [changeHighlight, editor])

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  }, [changeHeading, editor])

  useEffect(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [undo, editor]);

  useEffect(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [redo, editor]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsHighlight(selection.hasFormat("highlight"));
      setIsHeading(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
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
  }, [editor, $updateToolbar]);

  return (
    null
  );
}
