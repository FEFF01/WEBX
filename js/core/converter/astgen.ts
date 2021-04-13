import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';


function EMPTY_STATEMENT() {
    return {
        type: "EmptyStatement"
    }
}

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
        raw: typeof value === "string" ? `"${value}"` : ("" + value)
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
    if (!(body instanceof Array)) {
        if (body.type === "BlockStatement") {
            return body;
        }
        body = [body];
    }
    return {
        type: "BlockStatement",
        body: body
    };
}
function FUNCTION_EXPRESSION(body: Array<Node> | Node, params: Array<Node> = []) {
    return {
        type: "FunctionExpression",
        id: null,
        params,
        body: BLOCK_STATEMENT(body),
        generator: false,
        expression: false,
        async: false
    };
}
function VARABLE_DECLARATOR(id: string | Node, init: Node = null) {
    return {
        type: "VariableDeclarator",
        id: typeof id === "string" ? IDENTIFIER(id) : id,
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
function CALL_STATEMENT(callee: Node, ...args: Array<Node>) {
    return EXPRESSION_STATEMENT(
        {
            type: "CallExpression",
            callee: callee,
            arguments: args
        }
    )
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
export {

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
    CALL_STATEMENT,
    CALL_EXPRESSION,
    ARRAY_EXPRESSION,
    EXPRESSION_STATEMENT,
    ASSIGNMENT_STATEMENT,
    EMPTY_STATEMENT,
}