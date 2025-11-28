import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection';
import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_NORMAL,
	createCommand,
	ElementNode,
	LexicalEditor,
	$createTextNode,
	type NodeKey,
	type EditorConfig
} from 'lexical';
// using `any` for child nodes serialization fallback
import * as React from 'react';

export class CodeNode extends ElementNode {
	static getType(): string {
		return 'code';
	}

	constructor(key?: NodeKey) {
		super(key);
	}

	static clone(node: CodeNode): CodeNode {
		return new CodeNode(node.__key);
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = document.createElement('pre');
		element.className = (config.theme && (config.theme as any).code) || 'code-block';
		return element;
	}

	static importJSON(_serializedNode: any): CodeNode {
		return $createCodeNode();
	}

	exportJSON(): any {
		return {
			type: 'code',
			version: 1,
			children: this.getChildren().map((c: any) => {
				// Each child node should implement exportJSON
				// Fallback to an empty object
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return (c as any).exportJSON ? (c as any).exportJSON() : {};
			}),
		};
	}

	updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
		return false;
	}
}

export function $createCodeNode(): CodeNode {
	return new CodeNode();
}

export function $createCustomCodeNode(): CodeNode {
	return $createCodeNode();
}

export function $isCustomCodeNode(node: any): node is CodeNode {
	return node instanceof CodeNode;
}

export const INSERT_CODE_BLOCK_COMMAND = createCommand('insertCodeBlock');

export function CodePlugin(): null {
	const [editor] = useLexicalComposerContext();

	React.useEffect(() => {
		if (!editor.hasNodes([CodeNode])) {
			throw new Error('CodePlugin: CodeNode not registered on editor');
		}
	}, [editor]);

	editor.registerCommand(
		INSERT_CODE_BLOCK_COMMAND,
		() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				try {
					const anchorNode = selection.anchor.getNode();
					const topLevelNode = anchorNode.getTopLevelElementOrThrow();
					const codeNode = $createCodeNode();
					const textNode = $createTextNode('');
					codeNode.append(textNode);
					topLevelNode.insertAfter(codeNode);
					textNode.select();
				} catch (err) {
					// fallback: replace block type
					$setBlocksType(selection, $createCodeNode);
				}
			}
			return true;
		},
		COMMAND_PRIORITY_NORMAL,
	);

	return null;
}

