import { DecoratorNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, NodeKey } from 'lexical';

export const $createImageNode = ({ height, width, src }: { height?: number, width?: number, src: string }) => {
  return new ImageNode({
    src: src,
    height: height || 200,
    width: width || 300,
  });
}

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src } = domNode;
    const node = $createImageNode({ src });
    return { node };
  }
  return null;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __height: number;
  __width: number;

  constructor({ src, height, width, key }: {
    src: string,
    height: number,
    width: number,
    key?: NodeKey,
  }) {
    super(key);
    this.__src = src;
    this.__height = height;
    this.__width = width;
  }

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode({
      src: node.__src,
      height: node.__height,
      width: node.__width,
      key: node.__key,
    });
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        width={'100%'}
        alt="Post image"
      />
    );
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement('img');
    image.setAttribute('src', this.__src);
    image.setAttribute('height', this.__height.toString());
    image.setAttribute('width', this.__width.toString());
    image.setAttribute('alt', 'Post image');

    return { element: image }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => {
        return { conversion: convertImageElement, priority: 0 }
      }
    }
  }

  updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
    return false;
  }

  exportJSON(): any {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      width: this.__width,
      height: this.__height,
    };
  }

  static importJSON(serializedNode: any): ImageNode {
    const { src, width, height } = serializedNode;
    return $createImageNode({ src, width: width || 300, height: height || 200 });
  }
}

