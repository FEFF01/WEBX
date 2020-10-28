
import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from './Dison/js/interfaces';

function SEQUENCE_EXPRESSION(...args: Array<Node>) {
    return {
        type: "SequenceExpression",
        expressions: args
    }
}
function RETURN_STATEMENT(argument: Node) {
    return {
        type: "ReturnStatement",
        argument: argument
    }
}
function LITERAL(value: any) {
    return {
        type: "Literal",
        value: value,
        raw: `"${value}"`/*typeof value === "string" ? `"${value}"` : value.toString()*/
    }
}
function IDENTIFIER(name: string) {
    return {
        type: "Identifier",
        name: name
    };
}
function MEMBER_EXPRESSION(object: Node, property: Node, computed: boolean = false) {
    return {
        type: "MemberExpression",
        computed,
        object,
        property
    }
}
function BLOCK_STATEMENT(body: Array<Node> | Node) {
    return {
        type: "BlockStatement",
        body: body instanceof Array ? body : [body]
    };
}
function FUNCTION_EXPRESSION(body: Array<Node> | Node, params: Array<Node> = []) {
    return {
        type: "FunctionExpression",
        id: null,
        params,
        body: OPERATIONS.BLOCK_STATEMENT(body),
        generator: false,
        expression: false,
        async: false
    };
}
function VARABLE_DECLARATOR(id: string, init: Node = null) {
    return {
        type: "VariableDeclarator",
        id: OPERATIONS.IDENTIFIER(id),
        init: init
    }
}

function VARIABLE_DECLARATION(declarations: Array<Node>, kind: string = "var") {
    return {
        type: "VariableDeclaration",
        declarations,
        kind
    }
}
function ASSIGNMENT_EXPRESSION(left: Node, right: Node) {
    return {
        type: "AssignmentExpression",
        operator: "=",
        left: left,
        right: right
    };
}
function CALL_EXPRESSION(callee: Node, ...args: Array<Node>) {
    return {
        type: "CallExpression",
        callee: callee,
        arguments: args
    };
}
function ARRAY_EXPRESSION(...elements: Array<Node>) {
    return {
        type: "ArrayExpression",
        elements
    }
}
function EXPRESSION_STATEMENT(expression: Node) {
    return {
        type: "ExpressionStatement",
        expression
    }
}
function ASSIGNMENT_STATEMENT(left: Node, right: Node) {
    return EXPRESSION_STATEMENT(
        ASSIGNMENT_EXPRESSION(left, right)
    )
}
const OPERATIONS = {
    SEQUENCE_EXPRESSION,
    RETURN_STATEMENT,
    LITERAL,
    IDENTIFIER,
    MEMBER_EXPRESSION,
    BLOCK_STATEMENT,
    FUNCTION_EXPRESSION,
    VARABLE_DECLARATOR,
    VARIABLE_DECLARATION,
    ASSIGNMENT_EXPRESSION,
    CALL_EXPRESSION,
    ARRAY_EXPRESSION,
    EXPRESSION_STATEMENT,
    ASSIGNMENT_STATEMENT,
    ADD_EVENT_LISTENER(id: string, ...args: Array<Node>) {
        return EXPRESSION_STATEMENT(
            CALL_EXPRESSION(
                MEMBER_EXPRESSION(
                    IDENTIFIER(id),
                    IDENTIFIER("addEventListener")
                ),
                ...args
            )
        )
    },
    OBSERVER(name: string, target: Node) {
        return CALL_EXPRESSION(
            MEMBER_EXPRESSION(
                IDENTIFIER(name),
                IDENTIFIER("push")
            ),
            target
        );
    },
    REACTABLE(name: string, target: Node) {
        return CALL_EXPRESSION(
            IDENTIFIER("_webx_reactive"),
            IDENTIFIER(name),
            target
        );
    },
    REACTABLE_APPEND_TEXT(id: string, observer_name: string, getter: Node) {
        return EXPRESSION_STATEMENT(
            OPERATIONS.OBSERVER(
                observer_name,
                CALL_EXPRESSION(
                    IDENTIFIER("_webx_append_text_node"),
                    IDENTIFIER(id),
                    getter
                )
            )
        );
    },
    REACTABLE_APPEND_RESULT(id: string, observer_name: string, getter: Node) {
        getter.observer = observer_name;
        return EXPRESSION_STATEMENT(
            OPERATIONS.OBSERVER(
                observer_name,
                CALL_EXPRESSION(
                    IDENTIFIER("_webx_append_result"),
                    IDENTIFIER(id),
                    getter
                )
            )
        );
    },

    APPEND_CHILD(id: string, node: Node) {
        return EXPRESSION_STATEMENT(
            CALL_EXPRESSION(
                IDENTIFIER("_webx_append_child"),
                IDENTIFIER(id),
                node
            )
        );
    },
    APPEND_TEXT(id: string, text: Node) {//_webx_append_text_node
        return OPERATIONS.APPEND_CHILD(
            id,
            CALL_EXPRESSION(
                IDENTIFIER("_webx_create_text_node"),
                text
            )
        )
    },
    CALL_IF_EXISTED(...args: Array<Node>) {
        return CALL_EXPRESSION(
            IDENTIFIER("_webx_call"),
            ...args
            //IDENTIFIER(name)

        )
    },

    ASSIGN_ATTRIBUTE(id: string, name: string, value: Node) {
        return ASSIGNMENT_STATEMENT(
            MEMBER_EXPRESSION(
                IDENTIFIER(id),
                IDENTIFIER(name)
            ),
            value
        );
    },
    SET_ATTRIBUTE(id: string, name: string, value: Node) {
        return EXPRESSION_STATEMENT(
            CALL_EXPRESSION(
                IDENTIFIER("_webx_set_attribute"),
                IDENTIFIER(id),
                LITERAL(name),
                value

            )
        );
    },
    CREATE_ELEMENT(id: string, name: string) {
        return {
            type: "CallExpression",
            observer: false,
            callee: FUNCTION_EXPRESSION(
                [
                    {
                        type: "IfStatement",
                        test: IDENTIFIER(id),
                        consequent: BLOCK_STATEMENT(
                            RETURN_STATEMENT(
                                IDENTIFIER(id)
                            )
                        ),
                        alternate: null
                    },
                    EXPRESSION_STATEMENT(
                        ASSIGNMENT_EXPRESSION(
                            IDENTIFIER(id),
                            CALL_EXPRESSION(
                                IDENTIFIER("_webx_create_element"),
                                LITERAL(name)
                            )
                        )
                    ),
                    RETURN_STATEMENT(
                        IDENTIFIER(id)
                    )
                ]
            ),
            arguments: []
        }
    },

}

export default OPERATIONS;