import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { NodeKey, $getNodeByKey } from 'lexical'; // Import $getNodeByKey
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import './styles.css';

interface CodeBlockComponentProps {
  nodeKey: NodeKey;
  code: string;
}

export default function CodeBlockComponent({ nodeKey, code }: CodeBlockComponentProps) {
  const [editor] = useLexicalComposerContext();
  const [isCopied, setIsCopied] = useState(false);
  const [value, setValue] = useState<string>(code ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    // Use scrollHeight to fit content exactly
    const newHeight = ta.scrollHeight;
    ta.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    // initialize value and adjust
    setValue(code ?? '');
    // Delay to next frame to ensure styles applied
    requestAnimationFrame(adjustHeight);
  }, [code]);

  useEffect(() => {
    // also adjust when component mounts
    requestAnimationFrame(adjustHeight);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.focus();
        // Move cursor to end
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
    // Optionally update Lexical node text here if needed
    // editor.update(() => { const node = $getNodeByKey(nodeKey); ... })
  };

  const handleCopy = async () => {
    try {
      // Safely read node content from Lexical editor state
      let textToCopy = value;
      try {
        editor.read(() => {
          const node = $getNodeByKey(nodeKey);
          // Node methods must be called inside editor.read/update
          if (node && (node as any).getTextContent) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            textToCopy = (node as any).getTextContent();
          }
        });
      } catch (e) {
        // if reading from editor fails, fall back to local value
      }

      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="code-container">
      {/* Header */}
      <div className="button-container">
        <button 
          className="copy-button"
          onClick={handleCopy}
          type="button"
        >
          {isCopied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <textarea
          ref={textareaRef}
          className="code-textarea"
          spellCheck={false}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          style={{ overflow: 'hidden', resize: 'none', fontSize: 13 }}
          rows={1}
        />
      </div>
    </div>
  );
}