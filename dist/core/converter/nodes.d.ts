import { Node } from '../../Dison/js/interfaces';
declare function NEXT_CHILD_STATEMENT(getter?: Node, is_reactive?: boolean): {
    type: string;
    expression: Node;
};
declare function NEXT_BLOCK_SIBLING(nodes: Array<Node>, depth: number, autorun?: boolean, binding?: boolean): Node | {
    type: string;
};
declare function BINDING_DECLARATION(node: Node, depth: number): any[];
declare function SET_ATTRIBUTE(name: string, value: Node, is_literal?: boolean): {
    type: string;
    expression: Node;
};
export { NEXT_CHILD_STATEMENT, NEXT_BLOCK_SIBLING, SET_ATTRIBUTE, BINDING_DECLARATION, };
