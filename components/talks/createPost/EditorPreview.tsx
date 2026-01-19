
'use dom'
// @ts-ignore
import "./previewStyles.css"
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CodeNode } from '@lexical/code';
import ExampleTheme from "./Theme";
import { ImageNode } from './nodes/ImageNode';
import { ListItemNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { CodeBlockNode } from "./nodes/CodeBlockNode";
import CodeBlockPlugin from "./plugins/CodeBlockPlugin";

interface EditorPreviewProps {
  editorState: string | null;
  className?: string;
  dom: import('expo/dom').DOMProps
}

const editorConfig = {
  namespace: "Preview Mode",
  nodes: [
    ImageNode,
    ListNode,
    ListItemNode,
    CodeBlockNode
  ],
  editable: false, // read-only
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

function LoadStatePlugin({ editorState }: { editorState: string | null }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editorState) {
      try {
        const parsedState = JSON.parse(editorState);
        const newEditorState = editor.parseEditorState(parsedState);
        editor.setEditorState(newEditorState);
      } catch (error) {
        console.error('Failed to parse editor state:', error);
      }
    }
  }, [editorState, editor]);

  return null;
}
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
export default function EditorPreview({ editorState, className = "" }: EditorPreviewProps) {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'HEIGHT', height }));
    };

    sendHeight(); // send once on mount
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={`editor-preview-container ${className}`}
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        <LoadStatePlugin editorState={editorState} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-preview-content"
              style={{
                outline: "none",
                border: "none",
                fontSize: "13px",
                color: "#737373",
                fontFamily: "system-ui, -apple-system, sans-serif",
                cursor: "default",
                whiteSpace: "pre-wrap", // handles code/text wrapping
                overflow: "visible",    // let content expand
                resize: "none",
                height: "auto",         // key: don’t lock height
                minHeight: "unset",
              }}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}
