import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_ENTER_COMMAND
} from "lexical";
import { useEffect } from "react";
import {
  $createCodeBlockNode,
  $isCodeBlockNode,
  CodeBlockNode
} from "../nodes/CodeBlockNode";
import { createCommand } from "lexical";

export const INSERT_CODE_BLOCK_COMMAND = createCommand("insert-code-block");

export default function CodeBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerNodeTransform(CodeBlockNode, () => {});

    // ENTER = newline inside code block
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        const block = anchorNode.getTopLevelElementOrThrow();

        if ($isCodeBlockNode(block)) {
          selection.insertText("\n");
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // INSERT / TOGGLE CODE BLOCK
    editor.registerCommand(
      INSERT_CODE_BLOCK_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const node = selection.anchor.getNode();
          const top = node.getTopLevelElementOrThrow();

          // TOGGLE — if already in code block → exit
          if ($isCodeBlockNode(top)) {
            const paragraph = $createParagraphNode();
            top.insertAfter(paragraph);
            paragraph.select();
            return;
          }

          // INSERT new code block
          const codeBlock = $createCodeBlockNode();
          top.insertAfter(codeBlock);
          codeBlock.select();
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  return null;
}