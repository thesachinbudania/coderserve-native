"use dom";
// @ts-ignore
import './styles.css';
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useRef, useState, useEffect } from 'react';
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { ToolbarPluginProps } from "./ToolbarPlugin";
import { CustomCodeNode } from "./CustomCodeNode";
import CustomCodePlugin from "./CustomCodePlugin";
import ExampleTheme from "./Theme";
import ToolbarPlugin from "./ToolbarPlugin";
import { $getRoot, LexicalEditor } from "lexical";
import { ImageNode } from "./nodes/ImageNode";
import ImagePlugin from "./ImagePlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CodeNode } from "@lexical/code";


function useDebouncedSetter<T>(value: T, delay = 10) {
  const [state, setState] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setDebouncedState = (value: T) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState(value), delay);
  };

  return [state, setDebouncedState] as const;
}

const placeholder = "Write the main content of your post here";

export default function Editor({
  initialEditorState, // <-- new prop
  setPlainText,
  setEditorState,
  changeBold,
  setIsBold,
  changeItalic,
  setIsItalic,
  changeUnderline,
  setIsUnderline,
  changeCodeBlock,
  changeAddImage,
  changeHighlight,
  setIsHighlight,
  changeHeading,
  setIsHeading,
  changeHeading2,
  setIsHeading2,
  undo,
  redo,
  undoEnabled,
  redoEnabled,
  setRedoEnabled,
  setIsUndoEnabled,
  setIsOrderedList,
  setIsUnorderedList,
  changeOrderedList,
  changeUnorderedList,
}: ToolbarPluginProps & {
  initialEditorState?: string | null; // <-- new type
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  changeAddImage: boolean;
}) {
  const editorConfig = {
    namespace: "React.js Demo",
    nodes: [CustomCodeNode, ImageNode, ListNode, ListItemNode, CodeNode],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
    editorState: initialEditorState
      ? (editor: LexicalEditor) => {
        try {
          const parsed = JSON.parse(initialEditorState);
          const state = editor.parseEditorState(parsed);
          editor.setEditorState(state);
        } catch (e) {
          console.error("Failed to parse initial editor state:", e);
        }
      }
      : undefined,
  };
  const [internalUndoEnabled, setInternalUndoEnabled] = useDebouncedSetter<boolean>(false);
  const [internalRedoEnabled, setInternalRedoEnabled] = useDebouncedSetter<boolean>(false);

  useEffect(() => {
    if (internalRedoEnabled!== undefined && internalRedoEnabled!== redoEnabled) {
      setRedoEnabled(internalRedoEnabled);
    }
  }, [internalRedoEnabled]);

  useEffect(() => {
    if (internalUndoEnabled!== undefined && internalUndoEnabled!== undoEnabled) {
      setIsUndoEnabled(internalUndoEnabled);
    }
  }, [internalUndoEnabled])
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container" style={{fontFamily: 'Roboto, sans-serif'}}>
        <ImagePlugin changeAddImage={changeAddImage} />
        <CustomCodePlugin />
        <ToolbarPlugin
          changeBold={changeBold}
          setIsBold={setIsBold}
          changeItalic={changeItalic}
          setIsItalic={setIsItalic}
          changeUnderline={changeUnderline}
          setIsUnderline={setIsUnderline}
          changeCodeBlock={changeCodeBlock}
          changeHighlight={changeHighlight}
          setIsHighlight={setIsHighlight}
          changeHeading={changeHeading}
          setIsHeading={setIsHeading}
          changeHeading2={changeHeading2}
          setIsHeading2={setIsHeading2}
          undo={undo}
          redo={redo}
          undoEnabled={undoEnabled}
          redoEnabled={redoEnabled}
          setIsUndoEnabled={setInternalUndoEnabled}
          setRedoEnabled={setInternalRedoEnabled}
          changeOrderedList={changeOrderedList}
          changeUnorderedList={changeUnorderedList}
          setIsOrderedList={setIsOrderedList}
          setIsUnorderedList={setIsUnorderedList}
        />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorState.read(() => {
                const root = $getRoot();
                setPlainText(root.getTextContent());
              });
              setEditorState(JSON.stringify(editorState.toJSON()));
            }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
