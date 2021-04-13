import { Node } from '../../Dison/js/interfaces';
import { ProxyNode } from './proxy';
declare type DeclareProps = Array<Node | number | string | DeclareProps>;
declare function setReferenceRecords(proxy_node: ProxyNode, rules: Record<string, any>, node: Node, record: Record<string, Array<[Node, string | number, ProxyNode]>>): void;
declare function initScope(scope_node: ProxyNode, is_function_scope: boolean): void;
declare function num2id(num: number): string;
declare function nextEpoch(root: ProxyNode): void;
declare function makeMarks(scoped_node: ProxyNode): void;
declare function makeObserver(scoped_node: ProxyNode, depth: number): void;
declare function decodeDeclarator(declaration: Node, callback: Function, props: DeclareProps): void;
declare function decodeDeclarations(declarations: Array<Node>, callback: Function, props?: DeclareProps): void;
declare function volatileId(): number;
export { volatileId, DeclareProps, decodeDeclarations, decodeDeclarator, nextEpoch, makeMarks, makeObserver, num2id, initScope, setReferenceRecords };