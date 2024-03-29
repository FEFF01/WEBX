declare abstract class Sibling {
    target: any;
    prev?: Sibling;
    next: Sibling;
    nodes: Array<Node>;
    siblings: Array<Sibling>;
    constructor(target: any, prev?: Sibling);
    abstract appendTo(): void;
    abstract insertBefore(node: Node): void;
    abstract setNodes(val: any): void;
    moveTo(to: number): void;
    firstNode(): any;
    firstSibling(): Sibling;
    lastSibling(): Sibling;
    parent: Sibling;
    index: number;
    nextSibling(): Sibling;
    removeAllSibling(): void;
    removeSibling(sibling: Sibling): void;
    destory(): void;
}
declare class Children extends Sibling {
    target: Element;
    setNodes(val: any): void;
    appendTo(): void;
    insertBefore: (referenceNode: Node) => void;
}
declare class NodeList extends Sibling {
    target: Array<Node>;
    raw: Array<Node>;
    constructor(target: any, prev?: Sibling);
    setNodes(val: any): void;
    appendTo(): void;
    insertBefore: (referenceNode: Node) => void;
    removeAllNodes(): void;
}
export { Sibling, Children, NodeList };
