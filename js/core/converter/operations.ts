
import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';

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
    CALL_EXPRESSION,
    ARRAY_EXPRESSION,
    EXPRESSION_STATEMENT,
    ASSIGNMENT_STATEMENT,

    EMPTY_STATEMENT,
} from './astgen'

import { volatileId, decodeDeclarator, decodeDeclarations, DeclareProps, num2id } from './utils'
import { SANDOBX_OPTION } from '../../obb/js/obb';


function CREATE_COMPONENT(id: string, props: Array<Node>, children: Array<Node>) {

    let args: Array<Node> = [IDENTIFIER(id)];
    if (props.length || children.length) {
        args.push(
            props.length
                ? _AutoRun(FUNCTION_EXPRESSION(props, [IDENTIFIER("_webx$_props")]), true)
                : LITERAL(0)
        );
        children.length && args.push(
            _AutoRun(FUNCTION_EXPRESSION(children, [IDENTIFIER("_webx_el")]), true)
        );
    }
    return CALL_EXPRESSION(
        IDENTIFIER("_webx_create_component"),
        ...args
    );

    /*
    let data = OBSERVABLEABLE({
        type: "ObjectExpression",
        properties: []
    });
    if (!props.length && !children.length) {
        //如果返回的是 Expression 该结果将不能动态变更 例如  CREATE_ELEMENT 内的 <br/>
        return RETURN_STATEMENT(CALL_EXPRESSION(IDENTIFIER(id), data));
    }

    let component = CALL_EXPRESSION(IDENTIFIER(id), IDENTIFIER("_webx$_props"));
    let body: Array<Node> = [
        VARIABLE_DECLARATION([
            VARABLE_DECLARATOR(
                "_webx$_props",
                data
            )
        ])
    ];


    body.push(...props);

    if (children && children.length) {
        body.push(VARIABLE_DECLARATION([
            VARABLE_DECLARATOR(
                "_webx_el",
                OBSERVABLEABLE(ARRAY_EXPRESSION())
            )
        ]));
        component.arguments.push(IDENTIFIER("_webx_el"));
        body.push(
            VARIABLE_DECLARATION([
                VARABLE_DECLARATOR("_webx_cmp", component)
            ]),
            {
                type: "IfStatement",
                test: {
                    type: "LogicalExpression",
                    operator: "||",
                    left: {
                        type: "BinaryExpression",
                        operator: "===",
                        left: {
                            type: "Identifier",
                            name: "_webx_cmp"
                        },
                        right: {
                            type: "Literal",
                            value: null,
                            raw: "null"
                        }
                    },
                    right: {
                        type: "BinaryExpression",
                        operator: "===",
                        left: {
                            type: "Identifier",
                            name: "_webx_cmp"
                        },
                        right: {
                            type: "Identifier",
                            name: "undefined"
                        }
                    }
                },
                consequent: {
                    type: "ReturnStatement",
                    argument: null
                }
            }
        );

        body.push(...children);
        body.push(ASSIGNMENT_STATEMENT(
            MEMBER_EXPRESSION(IDENTIFIER("_webx$_props"), IDENTIFIER("children")),
            IDENTIFIER("_webx_el")
        ))
        body.push(RETURN_STATEMENT(IDENTIFIER("_webx_cmp")));
    } else {
        body.push(RETURN_STATEMENT(component));
    }
    return body;*/
    //return AUTORUN(body, true);
}


function CREATE_ELEMENT(tag: string, props: Array<Node>, children: Array<Node>) {
    let element = CALL_EXPRESSION(
        IDENTIFIER("_webx_create_element"),
        LITERAL(tag)
    );
    if (!props.length && !children.length) {
        return element;
    }
    let body: Array<Node> = [
        VARIABLE_DECLARATION(
            [
                VARABLE_DECLARATOR(
                    "_webx_el",
                    element
                )
            ]
        ),
        ...children,
        ...props,
        RETURN_STATEMENT(
            IDENTIFIER("_webx_el")
        )
    ];
    return body;//AUTORUN(body, true);
}


function ADD_EVENT_LISTENER(...args: Array<Node>) {
    return EXPRESSION_STATEMENT(
        CALL_EXPRESSION(
            IDENTIFIER("_webx_add_event_listener"),
            IDENTIFIER("_webx_el"),
            ...args
        )
    )
}

function ACTION_EXPRESSION(fn: Node) {
    return CALL_EXPRESSION(
        IDENTIFIER("_webx_action"),
        fn
    )
}

function RUN_IN_ACTION_STATEMENT(node: Node) {
    return EXPRESSION_STATEMENT(
        CALL_EXPRESSION(
            IDENTIFIER("_webx_run_in_action"),
            FUNCTION_EXPRESSION(
                node.action
            )
        )
    )
}

function SET_MODEL_REACTIVE(event: string, target: Node, attribute: string) {
    return ADD_EVENT_LISTENER(
        LITERAL(event),
        FUNCTION_EXPRESSION(
            ASSIGNMENT_STATEMENT(
                target,
                MEMBER_EXPRESSION(
                    IDENTIFIER("_webx_el"),
                    IDENTIFIER(attribute)
                )
            )
        )
    )
}
function OBSERVABLEABLE(target: Node) {
    return CALL_EXPRESSION(
        IDENTIFIER("_webx_observable"),
        target
    )
}

function PREVENT(body: Node | Array<Node>) {
    return CALL_EXPRESSION(
        IDENTIFIER("_webx_prevent_collect"),
        _AutoRun(FUNCTION_EXPRESSION(body), true),
        LITERAL(SANDOBX_OPTION.PREVENT_COLLECT)
    );
}

function AUTORUN(body: Node | Array<Node>, passive: boolean = false) {
    let args = [
        IDENTIFIER("_webx_autorun"),
        _AutoRun(FUNCTION_EXPRESSION(body), passive)
    ]
    passive && args.push(LITERAL(1))
    return CALL_EXPRESSION.apply(null, args);
}
function AUTORUN_STATEMENT(body: Node | Node[], ...args: Node[]) {
    return EXPRESSION_STATEMENT(AUTORUN.apply(null, arguments));
}

function _AutoRun(fn: Node, passive: boolean = false) {
    fn.body = new AutoRun(fn.body, passive);
    return fn;
}


class AutoRun {
    type: string;
    body: Array<Node>;
    readonly passive: boolean;
    constructor(body: Node, passive: boolean) {
        Object.assign(this, body);
        Object.defineProperty(this, "passive", {
            value: passive,
            enumerable: false,
            configurable: false
        });
    }
}


function ENTRY_STATEMENT(node: Node) {
    return EXPRESSION_STATEMENT(
        CALL_EXPRESSION(
            IDENTIFIER("_webx_entry_statement"),
            node.object,
            FUNCTION_EXPRESSION(node.body, node.params)
        )
    )
}


function PROPS_TO_EXPRESSION(props: DeclareProps) {
    let expr: Node;
    for (let i = 0; i < props.length; i++) {
        let prop: any = props[i];
        if (!(prop instanceof Array)) {
            let computed = false;
            switch (typeof prop) {
                case "number":
                    prop = LITERAL(prop)
                case "object":
                    computed = true;
                    break;
                default:
                    prop = IDENTIFIER(prop);
                    break;
            }

            expr = expr
                ? MEMBER_EXPRESSION(expr, prop, computed)
                : prop;
        } else {
            switch (prop.length) {
                case 2:
                    if (prop[0] instanceof Array) {
                        expr = SEQUENCE_EXPRESSION(
                            ASSIGNMENT_EXPRESSION(
                                IDENTIFIER("_webx_t"),
                                PROPS_TO_EXPRESSION(prop[0])
                            ),
                            {
                                type: "ConditionalExpression",
                                test: {
                                    type: "BinaryExpression",
                                    operator: "!==",
                                    left: IDENTIFIER("_webx_t"),
                                    right: IDENTIFIER("undefined")
                                },
                                consequent: IDENTIFIER("_webx_t"),
                                alternate: PROPS_TO_EXPRESSION([prop[1]])
                            }
                        )
                    } else {
                        let node = prop[0][prop[1]];
                        expr = expr
                            ? MEMBER_EXPRESSION(expr, node, true)
                            : node;
                    }
                    break;
                case 1:
                    expr = CALL_EXPRESSION(
                        MEMBER_EXPRESSION(expr, IDENTIFIER("slice")),
                        LITERAL(prop[0])
                    );
                    break;
                default:
                    debugger;
                    break;
            }
        }
    }
    return expr;
}


function SPLIT_VARIABLE_DECLARATION(node: Node) {
    let declarations = node.declarations;
    let variable_declaration_chunks = [];
    for (let declarator of declarations) {
        if (
            declarator.id.type !== "Identifier"
            && (
                declarator.init
                && (
                    declarator.init.type !== "Identifier"
                    && declarator.init.type !== "Literal"
                )
            )) {
            let id = `_webx$_T` + num2id(volatileId());
            variable_declaration_chunks.push(
                VARIABLE_DECLARATION(
                    [VARABLE_DECLARATOR(id, declarator.init)],
                    "let"
                )
            )
            declarator.init = IDENTIFIER(id);
        }
        decodeDeclarator(
            declarator,
            function (id: string, props: DeclareProps) {
                variable_declaration_chunks.push(
                    VARIABLE_DECLARATION(
                        [
                            VARABLE_DECLARATOR(
                                id,
                                PROPS_TO_EXPRESSION(props)
                            )
                        ],
                        node.kind
                    )
                )
            }, []
        )
    }
    return variable_declaration_chunks;


}




export {
    _AutoRun,
    AutoRun,
    ENTRY_STATEMENT,
    ADD_EVENT_LISTENER,
    SET_MODEL_REACTIVE,
    SPLIT_VARIABLE_DECLARATION,
    CREATE_COMPONENT,
    CREATE_ELEMENT,
    AUTORUN,
    PREVENT,
    AUTORUN_STATEMENT,
    OBSERVABLEABLE,
    RUN_IN_ACTION_STATEMENT,
    ACTION_EXPRESSION,
    PROPS_TO_EXPRESSION
}