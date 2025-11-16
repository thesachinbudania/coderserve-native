import {
  $applyNodeReplacement,
  ElementNode,
  $createTextNode,
  NodeKey,
  LexicalNode,
  SerializedElementNode,
  EditorConfig,
  Spread
} from 'lexical';


export class CustomCodeNode extends ElementNode {
  __language?: string;

  static getType(): string {
    return 'custom-code';
  }

  static clone(node: CustomCodeNode): CustomCodeNode {
    return new CustomCodeNode(node.__language, node.__key);
  }

  constructor(language?: string, key?: NodeKey) {
    super(key);
    this.__language = language;
  }

  createDOM(): HTMLElement {
    const pre = document.createElement('pre');
    pre.className = 'custom-code-node';
    const code = document.createElement('code');
    pre.appendChild(code);
    return pre;
  }

  updateDOM(): boolean {
    return false;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'custom-code',
      version: 1,
    };
  }

  getTextContent(): string {
    return this.getChildren()
      .map((child) => child.getTextContent())
      .join('');
  }

  isInline(): false {
    return false;
  }
}

export function $createCustomCodeNode(language?: string): CustomCodeNode {
  return $applyNodeReplacement(new CustomCodeNode(language));
}

export function $isCustomCodeNode(node: LexicalNode | null | undefined): node is CustomCodeNode {
  return node instanceof CustomCodeNode;
}
