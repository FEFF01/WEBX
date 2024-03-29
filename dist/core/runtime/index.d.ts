import { observable, action, runInAction } from '../../obb/js/obb';
import { Sibling, Children, NodeList } from './siblings';
import { entryStatement, nextIfSibling, nextEntrySibling } from './polyfill';
declare global {
    const _webx: any;
}
declare function prevent(fn: Function): any;
declare function autorun(fn: Function, passive?: boolean): any;
declare function removeAllSibling(sibling: Sibling): void;
declare function nextSibling(sibling: Sibling): Sibling;
declare function nextNodes(sibling: Sibling, els: Node | any, is_reactive: boolean): void;
declare function nextChild(el: Element, getter?: Function | any, is_reactive?: boolean | number, passive?: boolean): NodeList | Children;
declare function setAttribute(el: Element, name: string, value: any, literal?: boolean): void;
declare function setText(node: Text, text: string): void;
declare function addEventListener(el: Element, ...args: [string, (e: Event) => void, any?]): void;
declare function removeNode(child: Node): void;
declare function appendChild(el: Element, child: Node): void;
declare function insertBefore(parent: Element, target: Node, ref: Element): void;
declare function createElement(tagName: string): HTMLElement;
declare function createTextNode(data: any): Text;
declare function setNodes(sibling: Sibling, els: Node | any): void;
declare function createComponent(component: Function, gen_props: Function, gen_children: Function): () => any;
declare let webx: {
    prevent: typeof prevent;
    autorun: typeof autorun;
    action: typeof action;
    runInAction: (fn: Function, ...args: any[]) => any;
    observable: typeof observable;
    nextChild: typeof nextChild;
    nextSibling: typeof nextSibling;
    nextNodes: typeof nextNodes;
    setNodes: typeof setNodes;
    nextIfSibling: typeof nextIfSibling;
    nextEntrySibling: typeof nextEntrySibling;
    entryStatement: typeof entryStatement;
    removeAllSibling: typeof removeAllSibling;
    setAttribute: typeof setAttribute;
    setText: typeof setText;
    addEventListener: typeof addEventListener;
    removeNode: typeof removeNode;
    appendChild: typeof appendChild;
    insertBefore: typeof insertBefore;
    createElement: typeof createElement;
    createTextNode: typeof createTextNode;
    createComponent: typeof createComponent;
};
export default webx;
export { prevent, autorun, action, runInAction, observable, nextChild, nextSibling, nextNodes, setNodes, nextIfSibling, nextEntrySibling, entryStatement, removeAllSibling, setAttribute, setText, addEventListener, removeNode, appendChild, insertBefore, createElement, createTextNode, createComponent };
