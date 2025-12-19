import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_CODE_BLOCK_COMMAND } from "./CustomCodeNode";
import React from 'react';

export default function CustomCodePlugin({changeCodeBlock}: {changeCodeBlock: boolean}) : null {
    const [editor] = useLexicalComposerContext();
    React.useEffect(() => {
        if (changeCodeBlock) {
            editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, undefined);
        }
    }, [changeCodeBlock, editor]);
    return null;
}