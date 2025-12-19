import {
  ElementNode,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  $applyNodeReplacement,
  EditorConfig,
  LexicalEditor,
  $getNodeByKey
} from "lexical";
import Clipboard from "@react-native-clipboard/clipboard";

export class CodeBlockNode extends ElementNode {
  __copied: boolean = false;

  static getType(): string {
    return "code-block";
  }

  static clone(node: CodeBlockNode): CodeBlockNode {
    const cloned = new CodeBlockNode(node.__key);
    cloned.__copied = node.__copied;
    return cloned;
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("code-block-container");

    const header = document.createElement("div");
    header.classList.add("code-block-header");

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("copy-btn");
    copyBtn.style.userSelect = "none";
    copyBtn.contentEditable = "false";
    copyBtn.textContent = "Copy Code";

    copyBtn.onmousedown = (e) => {
      e.preventDefault(); // Prevent focus/caret from moving
      e.stopPropagation();
    };

    copyBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      editor.getEditorState().read(() => {
        const latestNode = $getNodeByKey(this.getKey());
        if (!latestNode) return;
        const codeContent = latestNode.getTextContent();
        Clipboard.setString(codeContent);
      });

      // Update the copied state
      editor.update(() => {
        const node = $getNodeByKey(this.getKey());
        if (node && $isCodeBlockNode(node)) {
          const writable = node.getWritable();
          writable.__copied = true;
        }
      });

      // Reset after 2 seconds
      setTimeout(() => {
        editor.update(() => {
          const node = $getNodeByKey(this.getKey());
          if (node && $isCodeBlockNode(node)) {
            const writable = node.getWritable();
            writable.__copied = false;
          }
        });
      }, 2000);
    };

    header.appendChild(copyBtn);

    const codeBodyContainer = document.createElement("div");
    codeBodyContainer.classList.add("code-block-body");
    
    const pre = document.createElement("pre");
    pre.classList.add("code-block-pre");
    codeBodyContainer.appendChild(pre);

    const code = document.createElement("code");
    code.classList.add("code-block-code");
    code.setAttribute("data-lexical-code", "true");
    code.contentEditable = editor.isEditable() ? "true" : "false";

    pre.appendChild(code);

    container.appendChild(header);
    container.appendChild(codeBodyContainer);

    return container;
  }

  updateDOM(prevNode: CodeBlockNode, dom: HTMLElement): boolean {
    // Only update if the copied state has changed
    if (prevNode.__copied !== this.__copied) {
      const copyBtn = dom.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.textContent = this.__copied ? 'Copied!' : 'Copy Code';
      }
    }
    return false;
  }

  static importJSON(serializedNode: SerializedElementNode): CodeBlockNode {
    return $applyNodeReplacement(new CodeBlockNode());
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: "code-block",
      version: 1,
    };
  }

  // Required override → only <code> child is editable
  getContentDOM(): HTMLElement | null {
    return null; // Lexical will handle finding the contentEditable element
  }
}

export function $createCodeBlockNode(): CodeBlockNode {
  return new CodeBlockNode();
}

export function $isCodeBlockNode(node: LexicalNode | null): node is CodeBlockNode {
  return node instanceof CodeBlockNode;
}