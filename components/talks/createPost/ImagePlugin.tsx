
import * as ImagePicker from 'expo-image-picker';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { $createImageNode } from './nodes/ImageNode';
import React from 'react';

import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
} from 'lexical';

function insertNewLine(editor: any) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const paragraphNode = $createParagraphNode();
    const textNode = $createTextNode('');
    paragraphNode.append(textNode);

    const parent = selection.anchor.getNode().getTopLevelElementOrThrow();
    parent.insertAfter(paragraphNode);

    // Move cursor to the new paragraph
    textNode.select();
  });
}
export default function ImagePlugin({ changeAddImage, image }: { changeAddImage: boolean, image: any }) {
  const [editor] = useLexicalComposerContext();
  const lastInsertedRef = React.useRef<string | null>(null);

  const pickImage = async () => {
    console.log("Picking image...");
      const asset = image; 

      const originalWidth = asset.width || 400;
      const originalHeight = asset.height || 300;

      const targetWidth = 400;
      const scale = targetWidth / originalWidth;
      const targetHeight = Math.round(originalHeight * scale);

      const base64 = `data:image/jpeg;base64,${asset.base64}`;
      // avoid inserting the same image multiple times if `image` prop doesn't change identity
      if (lastInsertedRef.current === base64) {
        return;
      }

      insertImage(base64, targetWidth, targetHeight);
      insertNewLine(editor);
      lastInsertedRef.current = base64;
  };

  const insertImage = (src: string, width: number, height: number) => {
    editor.update(() => {
      const node = $createImageNode({ src, width, height });
      $insertNodes([node]);
    });
  };
  React.useEffect(() => {
    if (image) {
      pickImage();
    }
  }, [image])

  return (
    null
  );
}

