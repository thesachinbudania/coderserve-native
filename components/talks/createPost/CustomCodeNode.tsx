import {
  $applyNodeReplacement,
  DecoratorNode,
  NodeKey,
  LexicalNode,
  SerializedLexicalNode,
  LexicalEditor,
  EditorConfig,
  DOMExportOutput,
  Spread
} from 'lexical';
import React from 'react';
import CodeBlockWithCopy from './CodeBlockWithCopy';

export type SerializedCustomCodeNode = Spread<
  {
    code: string;
    language?: string;
  },
  SerializedLexicalNode
>;

export class CustomCodeNode extends DecoratorNode<JSX.Element> {
  __code: string;
  __language?: string;

  static getType(): string {
    return 'custom-code';
  }

  static clone(node: CustomCodeNode): CustomCodeNode {
    return new CustomCodeNode(node.__code, node.__language, node.__key);
  }

  constructor(code: string, language?: string, key?: NodeKey) {
    super(key);
    this.__code = code;
    this.__language = language;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div');
    element.className = 'custom-code-node';
    return element;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('pre');
    element.className = 'custom-code-export';
    const codeElement = document.createElement('code');
    codeElement.textContent = this.__code;
    element.appendChild(codeElement);
    return { element };
  }

  static importJSON(serializedNode: SerializedCustomCodeNode): CustomCodeNode {
    const { code, language } = serializedNode;
    return $createCustomCodeNode(code, language);
  }

  exportJSON(): SerializedCustomCodeNode {
    return {
      code: this.__code,
      language: this.__language,
      type: 'custom-code',
      version: 1,
    };
  }

  setCode(code: string): void {
    const writable = this.getWritable();
    writable.__code = code;
  }

  getCode(): string {
    return this.__code;
  }

  setLanguage(language: string): void {
    const writable = this.getWritable();
    writable.__language = language;
  }

  getLanguage(): string | undefined {
    return this.__language;
  }

  getTextContent(): string {
    return this.__code;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return <CodeBlockWithCopy code={this.__code} language={this.__language} />;
  }

  isInline(): false {
    return false;
  }

  isKeyboardSelectable(): boolean {
    return true;
  }
}

export function $createCustomCodeNode(code: string = '', language?: string): CustomCodeNode {
  return $applyNodeReplacement(new CustomCodeNode(code, language));
}

export function $isCustomCodeNode(node: LexicalNode | null | undefined): node is CustomCodeNode {
  return node instanceof CustomCodeNode;
}
