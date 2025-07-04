import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  LexicalEditor
} from 'lexical';
import { $isCodeNode, $createCodeNode } from '@lexical/code';

export function toggleCodeBlock(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const topLevelNode = anchorNode.getTopLevelElementOrThrow();
    const isInCodeBlock = $isCodeNode(topLevelNode);

    if (isInCodeBlock) {
      // CASE 1: Exit code block to new paragraph
      const newParagraph = $createParagraphNode();
      topLevelNode.insertAfter(newParagraph);
      newParagraph.selectStart();
    } else {
      // CASE 2: Enter code block from paragraph
      const newCodeBlock = $createCodeNode();
      const placeholderText = $createTextNode(''); // Empty code block
      newCodeBlock.append(placeholderText);

      topLevelNode.insertAfter(newCodeBlock);
      placeholderText.select();
    }
  });
}
