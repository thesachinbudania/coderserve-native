import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  LexicalEditor
} from 'lexical';
import { $isCustomCodeNode, $createCustomCodeNode } from './CustomCodeNode';

export function toggleCodeBlock(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const topLevelNode = anchorNode.getTopLevelElementOrThrow();
    const isInCodeBlock = $isCustomCodeNode(topLevelNode);

    if (isInCodeBlock) {
      // Exit code block
      const paragraph = $createParagraphNode();
      topLevelNode.insertAfter(paragraph);
      paragraph.selectStart();
    } else {
      // Create new editable code block
      const codeNode = $createCustomCodeNode();
      const textNode = $createTextNode('');
      codeNode.append(textNode);
      topLevelNode.insertAfter(codeNode);
      textNode.select();
    }
  });
}


