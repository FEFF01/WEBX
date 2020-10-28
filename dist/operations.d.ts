import { Node } from './Dison/js/interfaces';
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
declare function BLOCK_STATEMENT(body: Array<Node> | Node): {
    type: string;
    body: Node[];
};
declare function FUNCTION_EXPRESSION(body: Array<Node> | Node, params?: Array<Node>): {
    type: string;
    id: any;
    params: Node[];
    body: {
        type: string;
        body: Node[];
    };
    generator: boolean;
    expression: boolean;
    async: boolean;
};
declare function VARABLE_DECLARATOR(id: string, init?: Node): {
    type: string;
    id: {
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
declare const OPERATIONS: {
    SEQUENCE_EXPRESSION: typeof SEQUENCE_EXPRESSION;
    RETURN_STATEMENT: typeof RETURN_STATEMENT;
    LITERAL: typeof LITERAL;
    IDENTIFIER: typeof IDENTIFIER;
    MEMBER_EXPRESSION: typeof MEMBER_EXPRESSION;
    BLOCK_STATEMENT: typeof BLOCK_STATEMENT;
    FUNCTION_EXPRESSION: typeof FUNCTION_EXPRESSION;
    VARABLE_DECLARATOR: typeof VARABLE_DECLARATOR;
    VARIABLE_DECLARATION: typeof VARIABLE_DECLARATION;
    ASSIGNMENT_EXPRESSION: typeof ASSIGNMENT_EXPRESSION;
    CALL_EXPRESSION: typeof CALL_EXPRESSION;
    ARRAY_EXPRESSION: typeof ARRAY_EXPRESSION;
    EXPRESSION_STATEMENT: typeof EXPRESSION_STATEMENT;
    ASSIGNMENT_STATEMENT: typeof ASSIGNMENT_STATEMENT;
    ADD_EVENT_LISTENER(id: string, ...args: Array<Node>): {
        type: string;
        expression: Node;
    };
    OBSERVER(name: string, target: Node): {
        type: string;
        callee: Node;
        arguments: Node[];
    };
    REACTABLE(name: string, target: Node): {
        type: string;
        callee: Node;
        arguments: Node[];
    };
    REACTABLE_APPEND_TEXT(id: string, observer_name: string, getter: Node): {
        type: string;
        expression: Node;
    };
    REACTABLE_APPEND_RESULT(id: string, observer_name: string, getter: Node): {
        type: string;
        expression: Node;
    };
    APPEND_CHILD(id: string, node: Node): {
        type: string;
        expression: Node;
    };
    APPEND_TEXT(id: string, text: Node): {
        type: string;
        expression: Node;
    };
    CALL_IF_EXISTED(...args: Array<Node>): {
        type: string;
        callee: Node;
        arguments: Node[];
    };
    ASSIGN_ATTRIBUTE(id: string, name: string, value: Node): {
        type: string;
        expression: Node;
    };
    SET_ATTRIBUTE(id: string, name: string, value: Node): {
        type: string;
        expression: Node;
    };
    CREATE_ELEMENT(id: string, name: string): {
        type: string;
        observer: boolean;
        callee: {
            type: string;
            id: any;
            params: Node[];
            body: {
                type: string;
                body: Node[];
            };
            generator: boolean;
            expression: boolean;
            async: boolean;
        };
        arguments: any[];
    };
};
export default OPERATIONS;
