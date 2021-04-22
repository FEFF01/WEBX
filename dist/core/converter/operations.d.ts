import { Node } from '../../Dison/js/interfaces';
import { DeclareProps } from './utils';
declare function CREATE_COMPONENT(id: string, props: Array<Node>, children: Array<Node>): {
    type: string;
    callee: Node;
    arguments: Node[];
};
declare function CREATE_ELEMENT(tag: string, props: Array<Node>, children: Array<Node>): Node[] | {
    type: string;
    callee: Node;
    arguments: Node[];
};
declare function ADD_EVENT_LISTENER(...args: Array<Node>): {
    type: string;
    expression: Node;
};
declare function ACTION_EXPRESSION(fn: Node): {
    type: string;
    callee: Node;
    arguments: Node[];
};
declare function RUN_IN_ACTION_STATEMENT(node: Node): {
    type: string;
    expression: Node;
};
declare function SET_MODEL_REACTIVE(event: string, target: Node, attribute: string): {
    type: string;
    expression: Node;
};
declare function OBSERVABLEABLE(target: Node): {
    type: string;
    callee: Node;
    arguments: Node[];
};
declare function PREVENT(body: Node | Array<Node>): {
    type: string;
    callee: Node;
    arguments: Node[];
};
declare function AUTORUN(body: Node | Array<Node>, passive?: boolean): any;
declare function AUTORUN_STATEMENT(body: Node | Node[], ...args: Node[]): {
    type: string;
    expression: Node;
};
declare function _AutoRun(fn: Node, passive?: boolean): Node;
declare class AutoRun {
    type: string;
    body: Array<Node>;
    readonly passive: boolean;
    constructor(body: Node, passive: boolean);
}
declare function ENTRY_STATEMENT(node: Node): {
    type: string;
    expression: Node;
};
declare function PROPS_TO_EXPRESSION(props: DeclareProps): Node;
declare function SPLIT_VARIABLE_DECLARATION(node: Node): any[];
export { _AutoRun, AutoRun, ENTRY_STATEMENT, ADD_EVENT_LISTENER, SET_MODEL_REACTIVE, SPLIT_VARIABLE_DECLARATION, CREATE_COMPONENT, CREATE_ELEMENT, AUTORUN, PREVENT, AUTORUN_STATEMENT, OBSERVABLEABLE, RUN_IN_ACTION_STATEMENT, ACTION_EXPRESSION, PROPS_TO_EXPRESSION };
