import { Node } from '../../Dison/js/interfaces';
declare function EMPTY_STATEMENT(): {
    type: string;
};
declare function SEQUENCE_EXPRESSION(...args: Array<Node>): {
    type: string;
    expressions: Node[];
};
declare function RETURN_STATEMENT(argument: Node): {
    type: string;
    argument: Node;
};
declare function LITERAL(value: any): {
    type: string;
    value: any;
    raw: string;
};
declare function IDENTIFIER(name: string): {
    type: string;
    name: string;
};
declare function MEMBER_EXPRESSION(object: Node, property: Node, computed?: boolean): {
    type: string;
    computed: boolean;
    object: Node;
    property: Node;
};
declare function BLOCK_STATEMENT(body: Array<Node> | Node): Node;
declare function FUNCTION_EXPRESSION(body: Array<Node> | Node, params?: Array<Node>): {
    type: string;
    id: any;
    params: Node[];
    body: Node;
    generator: boolean;
    expression: boolean;
    async: boolean;
};
declare function VARABLE_DECLARATOR(id: string | Node, init?: Node): {
    type: string;
    id: Node | {
        type: string;
        name: string;
    };
    init: Node;
};
declare function VARIABLE_DECLARATION(declarations: Array<Node>, kind?: string): {
    type: string;
    declarations: Node[];
    kind: string;
};
declare function ASSIGNMENT_EXPRESSION(left: Node, right: Node): {
    type: string;
    operator: string;
    left: Node;
    right: Node;
};
declare function CALL_STATEMENT(callee: Node, ...args: Array<Node>): {
    type: string;
    expression: Node;
};
declare function CALL_EXPRESSION(callee: Node, ...args: Array<Node>): {
    type: string;
    callee: Node;
    arguments: Node[];
};
declare function ARRAY_EXPRESSION(...elements: Array<Node>): {
    type: string;
    elements: Node[];
};
declare function EXPRESSION_STATEMENT(expression: Node): {
    type: string;
    expression: Node;
};
declare function ASSIGNMENT_STATEMENT(left: Node, right: Node): {
    type: string;
    expression: Node;
};
export { SEQUENCE_EXPRESSION, RETURN_STATEMENT, LITERAL, IDENTIFIER, MEMBER_EXPRESSION, BLOCK_STATEMENT, FUNCTION_EXPRESSION, VARABLE_DECLARATOR, VARIABLE_DECLARATION, ASSIGNMENT_EXPRESSION, CALL_STATEMENT, CALL_EXPRESSION, ARRAY_EXPRESSION, EXPRESSION_STATEMENT, ASSIGNMENT_STATEMENT, EMPTY_STATEMENT, };
