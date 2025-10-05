import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
} from 'lexical';
import { useEffect } from 'react';
import { $isCustomCodeNode, CustomCodeNode } from './CustomCodeNode';
import { mergeRegister } from '@lexical/utils';

export default function CustomCodePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      // Handle Enter key in code blocks
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;

          const anchorNode = selection.anchor.getNode();
          const topLevelNode = anchorNode.getTopLevelElementOrThrow();

          if ($isCustomCodeNode(topLevelNode)) {
            event?.preventDefault();
            editor.update(() => {
              const code = topLevelNode.getCode();
              const offset = selection.anchor.offset;
              const newCode = code.slice(0, offset) + '\n' + code.slice(offset);
              topLevelNode.setCode(newCode);
            });
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      // Handle Tab key in code blocks
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;

          const anchorNode = selection.anchor.getNode();
          const topLevelNode = anchorNode.getTopLevelElementOrThrow();

          if ($isCustomCodeNode(topLevelNode)) {
            event?.preventDefault();
            editor.update(() => {
              const code = topLevelNode.getCode();
              const offset = selection.anchor.offset;
              const newCode = code.slice(0, offset) + '  ' + code.slice(offset); // 2 spaces for tab
              topLevelNode.setCode(newCode);
            });
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      // Handle text input in code blocks
      editor.registerTextContentListener((text) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const anchorNode = selection.anchor.getNode();
          const topLevelNode = anchorNode.getTopLevelElementOrThrow();

          if ($isCustomCodeNode(topLevelNode)) {
            // Text content is automatically handled by the node
          }
        });
      })
    );
  }, [editor]);

  return null;
}
