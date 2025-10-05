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
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_CRITICAL
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode
} from "@lexical/list";
import {
  $createParagraphNode,
  $insertNodes,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { toggleCodeBlock } from "./helpers";
import { useUndoRedoStore } from "@/zustand/talks/newPostStore";



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
  changeHeading2: boolean;
  setIsHeading2: (isHeading2: boolean) => void;
  undo: boolean;
  redo: boolean;
  undoEnabled: boolean;
  redoEnabled: boolean;
  setIsUndoEnabled: (canUndo: boolean) => void;
  setRedoEnabled: (canRedo: boolean) => void;

  // New props
  changeOrderedList: boolean;
  changeUnorderedList: boolean;
  setIsOrderedList: (isList: boolean) => void;
  setIsUnorderedList: (isList: boolean) => void;
}

export default function ToolbarPlugin({
  changeBold,
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
  changeHeading2,
  setIsHeading2,
  undo,
  redo,
  setRedoEnabled,
  setIsUndoEnabled,
  changeOrderedList,
  changeUnorderedList,
  setIsOrderedList,
  setIsUnorderedList,
}: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();


    // Text styles
  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }, [changeBold, editor]);

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [changeItalic, editor]);

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }, [changeUnderline, editor]);

  useEffect(() => {
    toggleCodeBlock(editor);
  }, [changeCodeBlock, editor]);

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
  }, [changeHighlight, editor]);

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  }, [changeHeading, editor]);

  useEffect(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  }, [changeHeading2, editor]);


  // Undo / Redo
  useEffect(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [undo, editor]);

  useEffect(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [redo, editor]);

  // Fixed list handling
  useEffect(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const topLevelNode = anchorNode.getTopLevelElementOrThrow();

        if ($isListNode(topLevelNode)) {
          // If we're already in a list, exit by creating a new paragraph after the list
          const newParagraph = $createParagraphNode();
          $insertNodes([newParagraph]);
          newParagraph.select();
        } else {
          // If we're not in a list, insert ordered list
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      }
    });
  }, [changeOrderedList, editor]);

  useEffect(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const topLevelNode = anchorNode.getTopLevelElementOrThrow();

        if ($isListNode(topLevelNode)) {
          // If we're already in a list, exit by creating a new paragraph after the list
          const newParagraph = $createParagraphNode();
          $insertNodes([newParagraph]);
          newParagraph.select();
        } else {
          // If we're not in a list, insert unordered list
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      }
    });
  }, [changeUnorderedList, editor]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Text formatting
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsHighlight(selection.hasFormat("highlight"));
      setIsHeading(selection.hasFormat("strikethrough"));
      setIsHeading2(selection.hasFormat("code"));

      // List detection
      const anchorNode = selection.anchor.getNode();
      const topLevelNode = anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(topLevelNode)) {
        const listType = topLevelNode.getListType();
        setIsOrderedList(listType === "number");
        setIsUnorderedList(listType === "bullet");
      } else {
        setIsOrderedList(false);
        setIsUnorderedList(false);
      }
    }

editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setIsUndoEnabled(payload); 
        return false; // observe only, allow others to react
      },
      COMMAND_PRIORITY_LOW
    ),

    editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setRedoEnabled(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW
    )

  }, [setIsBold, setIsItalic, setIsUnderline, setIsHighlight, setIsHeading, setIsHeading2, setIsOrderedList, setIsUnorderedList, setIsUndoEnabled, setRedoEnabled]);

useEffect(() => {

  // register listeners and commands
  const unregister = mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
        return false;
      });
    }),

    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        // keep selection-driven state synced
        editor.getEditorState().read($updateToolbar);
        return false; // don't swallow
      },
      COMMAND_PRIORITY_LOW
    ),

    
  );

  // initial sync of toolbar UI
  editor.getEditorState().read(() => {
    $updateToolbar();
  });

  return () => unregister();
}, [editor, $updateToolbar ]);

return <></>
}
