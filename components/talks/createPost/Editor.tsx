"use dom";
import "./styles.css";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { ToolbarPluginProps } from "./ToolbarPlugin";
import { CodeNode } from '@lexical/code';
import ExampleTheme from "./Theme";
import ToolbarPlugin from "./ToolbarPlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { ImageNode } from './nodes/ImageNode'
import ImagePlugin from './ImagePlugin'
import { ListItemNode, ListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

const placeholder = "Write the main content of your post here";

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [
    CodeNode, // Registering CodeNode to handle code blocks
    ImageNode,
    ListNode,
    ListItemNode
  ],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
};
export default function Editor({
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
  setCanUndo,
  setCanRedo,
  setIsOrderedList,
  setIsUnorderedList,
  changeOrderedList,
  changeUnorderedList,
}: ToolbarPluginProps & {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  changeAddImage: boolean;
}
) {
  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ImagePlugin changeAddImage={changeAddImage} />
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
            setCanUndo={setCanUndo}
            setCanRedo={setCanRedo}
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
              onChange={(editorState, editor, tags) => {
                editorState.read(() => {
                  const root = $getRoot();
                  const textContent = root.getTextContent();
                  setPlainText(textContent);
                });
                setEditorState(JSON.stringify(editorState.toJSON()));
              }}
              ignoreHistoryMergeTagChange
              ignoreSelectionChange
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}
