

import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';

import {
    isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem
} from '../parser'

import {
    _AutoRun,
    AutoRun,
    ENTRY_STATEMENT,
    ADD_EVENT_LISTENER,
    SET_MODEL_REACTIVE,
    SPLIT_VARIABLE_DECLARATION,
    CREATE_ELEMENT,
    AUTORUN,
    PREVENT,
    AUTORUN_STATEMENT,
    OBSERVABLEABLE,
    RUN_IN_ACTION_STATEMENT,
    ACTION_EXPRESSION
} from './operations'

import {

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
} from './astgen'


function NEXT_NODES(expr: Node, depth: number, is_reactive: boolean) {
    let args = [
        IDENTIFIER("_webx_next_nodes"),
        IDENTIFIER("_webx_t_sibling" + depth),
        expr
    ];
    is_reactive && args.push(LITERAL(1));
    return CALL_STATEMENT.apply(null, args);
}

function SET_NODES(expr: Node, depth: number) {
    return CALL_STATEMENT(
        IDENTIFIER("_webx_set_nodes"),
        IDENTIFIER("_webx_t_sibling" + depth),
        expr
    );
}



function NEXT_SIBLING(curr: number, prev: number = curr - 1) {

    return VARIABLE_DECLARATION(
        [
            VARABLE_DECLARATOR(
                "_webx_t_sibling" + curr,
                prev >= 0 ?
                    CALL_EXPRESSION(
                        IDENTIFIER("_webx_next_sibling"),
                        IDENTIFIER(
                            "_webx_t_sibling" + prev
                        )
                    )
                    : NEXT_CHILD()
            )
        ],
        "let"
    )
}


let child_count = 0;
function NEXT_ENTRY_SIBLING_STATEMENT(
    node: Node,
    depth: number,
    tag: string | number
) {
    let { object, params, body } = node;

    body = body.type === "BlockStatement" ? body.body : [body]

    let keys = ["v", "k", "i", "t"];
    let declarations = [];


    let id = IDENTIFIER(`_webx$_T${tag}_D${depth}_entry`);
    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (!param) {
            continue;
        }
        switch (param.type) {
            case "RestElement":
                let elements = [];
                for (; i < params.length; i++) {
                    keys[i] && elements.push(
                        MEMBER_EXPRESSION(
                            id,
                            IDENTIFIER(keys[i])
                        )
                    )
                }
                declarations.push(
                    VARABLE_DECLARATOR(
                        param,
                        ARRAY_EXPRESSION(...elements)
                    )
                );
                break;
            case "AssignmentPattern":
                param = param.left;
            default:
                declarations.push(
                    VARABLE_DECLARATOR(
                        param,
                        MEMBER_EXPRESSION(
                            id,
                            IDENTIFIER(keys[i])
                        )
                    )
                )
                break;
        }
    }


    body = NEXT_BLOCK_SIBLING(body, depth + 2, tag, false, false);

    body.type !== "BlockStatement" && (body = BLOCK_STATEMENT(body))


    /**
     * _webx_next_entry_sibling 方法需要每个循环体有单独的根
     */
    let prop_depth = depth;
    if (child_count > 1) {
        child_count = 1;
        body.body.unshift(NEXT_SIBLING(depth + 1));
    } else {
        prop_depth += 1;
    }
    declarations.length && body.body.unshift(VARIABLE_DECLARATION(declarations));

    let res: Node = CALL_STATEMENT(
        IDENTIFIER("_webx_next_entry_sibling"),
        child_count ? IDENTIFIER("_webx_t_sibling" + prop_depth) : LITERAL(0),
        _AutoRun(FUNCTION_EXPRESSION(RETURN_STATEMENT(object))),
        _AutoRun(FUNCTION_EXPRESSION(
            body,
            [id]
        ))
    );
    if (child_count) {
        res = BLOCK_STATEMENT([NEXT_SIBLING(prop_depth, depth - 1), res])
    }

    return res;
}


function NEXT_FOR_EACH_SIBLING_STATEMENT(node: Node, depth: number, tag: string | number) {
    let { left, right, body, type } = node;
    if (left.type !== "VariableDeclaration" || left.kind !== "let") {
        return;
    }

    let id = left.declarations[0].id;
    return NEXT_ENTRY_SIBLING_STATEMENT(
        {
            type: "EntryStatement",
            object: right,
            params: type === "ForOfStatement" ? [id] : [null, id],
            body
        },
        depth,
        tag
    );
}


function NEXT_CHILD(getter?: Node, is_reactive?: boolean) {
    let args: Array<Node> = [
        IDENTIFIER("_webx_next_child"),
        IDENTIFIER("_webx_el")
    ];
    if (getter) {
        if (is_reactive) {
            args.push(_AutoRun(getter));
            args.push(LITERAL(1));
            /*args.push(_AutoRun(FUNCTION_EXPRESSION(RETURN_STATEMENT(getter))));
            args.push(LITERAL(1));*/
        } else {
            args.push(getter);
        }
    }
    return CALL_EXPRESSION.apply(null, args);
}

function NEXT_CHILD_STATEMENT(getter?: Node, is_reactive?: boolean) {
    return EXPRESSION_STATEMENT(NEXT_CHILD(getter, is_reactive));
}


function NEXT_BLOCK_SIBLING(
    nodes: Array<Node>,
    depth: number,
    tag: string | number,
    autorun: boolean,
    binding: boolean
) {

    child_count = 0;
    if (!nodes.length) {
        return EMPTY_STATEMENT();//BLOCK_STATEMENT([]);
    }
    let res: Node;
    let _child_count = 0;

    let reactive_nodes: Array<Node> = [];
    let _binding = binding && nodes.length === 1;
    let next_step = autorun ? depth + 1 : depth;
    for (let node of nodes) {
        switch (node.type) {
            case "BindingDeclaration":
                reactive_nodes.push(...BINDING_DECLARATION(node.declaration, next_step, tag));
                break;
            default:
                reactive_nodes.push(polyfill(node, next_step, tag, _binding));
                break;
        }
        child_count && (_child_count += 1);
    }
    if (autorun && _child_count) {
        if (_child_count > 1) {
            reactive_nodes.unshift(
                CALL_STATEMENT(
                    IDENTIFIER("_webx_remove_all_sibling"),
                    IDENTIFIER("_webx_t_sibling" + depth)
                )
            );
            reactive_nodes = [AUTORUN_STATEMENT(reactive_nodes)];
        }
        reactive_nodes.unshift(NEXT_SIBLING(depth));
        res = BLOCK_STATEMENT(reactive_nodes);
    } else {
        res = reactive_nodes.length === 1
            ? reactive_nodes[0]
            : BLOCK_STATEMENT(reactive_nodes);
        //autorun && !binding && (res = AUTORUN_STATEMENT(res));
    }
    child_count = _child_count;
    return res;
}
function polyfill(node: Node, depth: number, tag: string | number, binding: boolean): Node {
    child_count = 0;
    let _child_count = 0;
    switch (node.type) {
        case "ExpressionStatement":
            let expression = node.expression;
            let type = expression.type;
            if (
                type === "Literal"
                || type === "Element"
            ) {
                child_count += 1;
                return NEXT_NODES(expression, depth - 1, type === "Element");
            } else if (
                binding
                || type === "Identifier"
                || type === "TemplateLiteral"
            ) {
                child_count += 1;
                let res = AUTORUN_STATEMENT(SET_NODES(expression, binding ? depth - 1 : depth));

                return binding
                    ? res
                    : BLOCK_STATEMENT([NEXT_SIBLING(depth), res]);
            }
            return node;

        case "SwitchStatement":
            for (let _case of node.cases) {
                _case.consequent = _case.consequent.map(
                    (statement: Node) => {
                        let res = polyfill(statement, depth + 1, tag, false);
                        _child_count += child_count;
                        child_count = 0;
                        return res;
                    }
                );
            }
            break;
        case "BlockStatement":
            return NEXT_BLOCK_SIBLING(node.body, depth, tag, false, false);
        case "BindingStatement":
            if (node.value === "@autorun") {
                // 显式声明的 @autorun 是脱离渲染流的
                return node;
            }
            return NEXT_BLOCK_SIBLING([node.statement], depth, tag, true, true);
        case "EntryStatement":
            return NEXT_ENTRY_SIBLING_STATEMENT(node, depth, tag);
        case "PreventStatement":
            return node;
        case "IfStatement":
            return NEXT_IF_SIBLING_STATEMENT(node, depth, tag);
        case "ForInStatement":
        case "ForOfStatement":
            let res = NEXT_FOR_EACH_SIBLING_STATEMENT(node, depth, tag);
            if (res !== undefined) {
                return res;
            }
        /*case "RetrunStatement":
            return false;*/
        default:
            if (isStatement(node)) {
                for (let key in node) {
                    let value = node[key];
                    if (value && value.type) {
                        if (value.type === "BlockStatement") {
                            node[key] = NEXT_BLOCK_SIBLING(value.body, depth + 1, tag, false, false);
                            _child_count += child_count;
                        } else if (isStatement(value)) {
                            node[key] = NEXT_BLOCK_SIBLING([value], depth + 1, tag, false, false);
                            _child_count += child_count;
                        }
                    }
                }
            }
            break;
    }
    if (_child_count) {
        child_count = 1;
        node = BLOCK_STATEMENT([
            NEXT_SIBLING(depth),
            AUTORUN_STATEMENT(
                [
                    CALL_STATEMENT(
                        IDENTIFIER("_webx_remove_all_sibling"),
                        IDENTIFIER("_webx_t_sibling" + depth)
                    ),
                    node
                ]
            )
        ]);
    }
    return node;
}
function NEXT_IF_SIBLING_STATEMENT(node: Node, depth: number, tag: string | number) {
    let test = node.test;
    let consequent = node.consequent;
    let alternate = node.alternate;
    let is_binding = false;
    consequent = consequent.type === "BlockStatement" ? consequent.body : [consequent];

    consequent = NEXT_BLOCK_SIBLING(consequent, depth + 1, tag, true, false);
    child_count && (is_binding = true);
    if (alternate) {
        alternate = alternate.type === "BlockStatement" ? alternate.body : [alternate];
        alternate = NEXT_BLOCK_SIBLING(alternate, depth + 1, tag, true, false);
        child_count && (is_binding = true);
    }
    if (is_binding) {
        child_count = 1;
        let args = [
            IDENTIFIER("_webx_next_if_sibling"),
            IDENTIFIER("_webx_t_sibling" + (depth)),
            _AutoRun(FUNCTION_EXPRESSION(RETURN_STATEMENT(test))),
            _AutoRun(FUNCTION_EXPRESSION(consequent)),
        ];
        alternate && args.push(_AutoRun(FUNCTION_EXPRESSION(alternate)));
        node = BLOCK_STATEMENT([
            NEXT_SIBLING(depth),
            CALL_STATEMENT.apply(null, args)
        ]);
    }
    return node;
}

function BINDING_DECLARATION(node: Node, depth: number, tag: string | number) {
    let res = [];
    for (let declaration of SPLIT_VARIABLE_DECLARATION(node)) {
        res.push(declaration);
        res.push(
            NEXT_BLOCK_SIBLING(
                [{
                    type: "BindingStatement",
                    value: "@:",
                    statement: EXPRESSION_STATEMENT(
                        declaration.declarations[0].id
                    )
                }],
                depth,
                tag,
                false,
                false
            )

        )
    }
    return res;
}
function SET_ATTRIBUTE(name: string, value: Node, is_literal?: boolean) {
    let is_bind = value.type === "BindingExpression";
    is_bind && (value = value.expression);
    let res = CALL_EXPRESSION(
        IDENTIFIER("_webx_set_attribute"),
        IDENTIFIER("_webx_el"),
        LITERAL(name),
        value
    );
    is_literal && res.arguments.push(LITERAL(1));
    is_bind && (res = AUTORUN(EXPRESSION_STATEMENT(res)));
    return EXPRESSION_STATEMENT(res);
}

export {
    NEXT_CHILD_STATEMENT,
    NEXT_BLOCK_SIBLING,
    SET_ATTRIBUTE,
    BINDING_DECLARATION,
}