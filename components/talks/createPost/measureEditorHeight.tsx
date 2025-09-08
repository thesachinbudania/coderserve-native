import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { createRoot } from "react-dom/client";
import { CodeNode } from "@lexical/code";
import { ImageNode } from "./nodes/ImageNode";
import { ListItemNode, ListNode } from "@lexical/list";
import ExampleTheme from "./Theme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from 'react';

export async function measureEditorHeight(editorState: string): Promise<number> {
  return new Promise((resolve) => {
    // Create an off-screen container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.visibility = "hidden";
    container.style.pointerEvents = "none";
    container.style.width = "100%"; // or fixed width to match your layout
    document.body.appendChild(container);
    console.log('Measuring editor height...');
    const editorConfig = {
      namespace: "MeasureEditor",
      nodes: [CodeNode, ImageNode, ListNode, ListItemNode],
      editable: false,
      theme: ExampleTheme,
      onError: (e: Error) => console.error(e),
    };

    function LoadStatePlugin({ editorState }: { editorState: string }) {
      const [editor] = useLexicalComposerContext();
      React.useEffect(() => {
        try {
          const parsed = JSON.parse(editorState);
          editor.setEditorState(editor.parseEditorState(parsed));
          // Delay to allow rendering
          setTimeout(() => {
            const height = container.scrollHeight;
            document.body.removeChild(container);
            resolve(height);
          }, 0);
        } catch (err) {
          console.error("Failed to parse editor state", err);
          document.body.removeChild(container);
          resolve(0);
        }
      }, [editorState, editor]);
      return null;
    }

    const root = createRoot(container);
    root.render(
      <LexicalComposer initialConfig={editorConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LoadStatePlugin editorState={editorState} />
      </LexicalComposer>
    );
  });
}
