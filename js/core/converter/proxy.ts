
import {
    Token, Node, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';

import {
    BINDING_DECLARATION,
    NEXT_CHILD_STATEMENT,
    NEXT_BLOCK_SIBLING,
    SET_ATTRIBUTE,

} from './nodes'
import {
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
    PROPS_TO_EXPRESSION,
    _AutoRun
} from './operations';

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

import {
    decodeDeclarations, decodeDeclarator,
    DeclareProps, nextEpoch, makeMarks, makeObserver,
    initScope, setReferenceRecords
} from './utils'

import { runtime } from './index'
import { isExpression } from '../parser';


const enum SCOPE_STATUS {
    REACTIVE = 1,
    AUTORUN = 2
}
const enum OBSERVER_MARK {
    NEED_PROXY = 1,
    HAS_ASSIGN = 2,
    NEED_REDECLARE = 4
}

const enum PROXY_NODE {


    FUNCTION_DECLARES = "FUNCTION_DECLARES",
    FUNCTION_SCOPED_STACK = "FUNCTION_SCOPED_STACK",
    BLOCK_DECLARES = "BLOCK_DECLARES",
    BLOCK_SCOPED_STACK = "BLOCK_SCOPED_STACK",

    //LOCAL_DECLARES = "LOCAL_DECLARES",

    SUBSCOPES = "SUBSCOPES",

    OBSERVER_MARKS = "OBSERVER_STATE",
    OBSERVER_MAP = "OBSERVER_MAP",

    REFERENCE_RECORD = "REFERENCE_RECORD",
    ASSIGN_RECORD = "ASSIGN_RECORD",

    NEXT_EPOCH = "NEXT_EPOCH",
    NEPOCH = "NEPOCH",

    SCOPE_STATUS = "SCOPE_STATUS",
    DEPTH = "DEPTH"

}


const EXTEND_PROPS = [

    PROXY_NODE.FUNCTION_DECLARES,
    PROXY_NODE.FUNCTION_SCOPED_STACK,
    PROXY_NODE.BLOCK_DECLARES,
    PROXY_NODE.BLOCK_SCOPED_STACK,


    PROXY_NODE.REFERENCE_RECORD,
    PROXY_NODE.ASSIGN_RECORD,
    PROXY_NODE.SUBSCOPES,
    PROXY_NODE.SCOPE_STATUS,
    PROXY_NODE.DEPTH
];


const EXCLUDE_TYPES: Set<string | number> = new Set([
    "Identifier", "Literal", "ThisExpression", "Super"
]);
function _ProxyNode(node: Node, parent?: ProxyNode, prop?: string | number) {
    if (
        prop !== "range" && prop !== "loc" &&
        node && typeof node === "object" &&
        !EXCLUDE_TYPES.has(node.type)
    ) {
        return new ProxyNode(node, parent, prop);
    }
}
class ProxyNode {
    static isExternalDeclaration: (id: string) => boolean;
    [PROXY_NODE.FUNCTION_DECLARES]: Record<string, any>;
    [PROXY_NODE.FUNCTION_SCOPED_STACK]: Array<ProxyNode>;

    [PROXY_NODE.BLOCK_DECLARES]: Record<string, any>;
    [PROXY_NODE.BLOCK_SCOPED_STACK]: Array<ProxyNode>;


    [PROXY_NODE.SCOPE_STATUS]: SCOPE_STATUS;
    [PROXY_NODE.DEPTH]: number;

    [PROXY_NODE.NEXT_EPOCH]: Array<[Node, ProxyNode, string | number]>;

    [PROXY_NODE.REFERENCE_RECORD]: Record<string, Array<[Node, string | number, ProxyNode]>>;

    [PROXY_NODE.OBSERVER_MAP]: Record<string, Node>;
    [PROXY_NODE.OBSERVER_MARKS]: Record<string, OBSERVER_MARK>;


    [props: string]: ProxyNode | any;


    constructor(public node: any, public parent?: ProxyNode, prop?: string | number) {

        //let self: any = this;
        if (parent) {
            for (let key of EXTEND_PROPS) {
                this[key] = parent[key];
            }
        }

        if (node.type || prop) {
            let wrap_node = CAPTURE_HOOKS[node.type || prop]?.call(this, node);
            if (wrap_node) {
                if (
                    wrap_node instanceof Array
                    && parent.node instanceof Array
                    && !(node instanceof Array)
                ) {
                    let index = parent.node.indexOf(node);
                    parent.node.splice(index, 1, ...wrap_node);//epoch
                    wrap_node = parent.node[prop];
                    return wrap_node && new ProxyNode(wrap_node, parent, prop);
                }
                parent && (parent.node[prop] = wrap_node);
                node = this.node = wrap_node;
            } else if (wrap_node === 0) {
                this[PROXY_NODE.BLOCK_SCOPED_STACK][0][PROXY_NODE.NEXT_EPOCH].push([node, parent, prop]);
                return 0 as any;
            }
            node.type && setReferenceRecords(
                this,
                REFERENCE_RULES,
                node,
                this[PROXY_NODE.REFERENCE_RECORD]
            );
        }
        parent && prop && (parent[prop] = this);



        if (node instanceof Array) {
            for (let i = 0; i < node.length; i++) {
                _ProxyNode(node[i], this, i);
            }

        } else {
            for (let key in node) {
                _ProxyNode(node[key], this, key);
            }
        }



        if (node.type) {

            if (node._bubble) {
                node._bubble(this);
                delete node._bubble;
            }

            let proxy_node = BUBBLE_HOOKS[node.type]?.call(this, node);
            if (proxy_node) {
                return proxy_node;
            }
        }
    }

}


const REFERENCE_RULES = {
    ExportNamedDeclaration: {   //临时处理，ecpho 1 之后 会将 specifiers 处理为 declarations
        specifiers: ["local"]
    },
    ExportDefaultDeclaration: [
        "declaration"
    ],
    MethodDefinition: [
        ["computed", true],
        "key"
    ],
    ObjectPattern: {
        properties: {
            Property: [
                ["computed", true],
                "key"
            ]
        }
    },
    ArrayExpression: ["elements"],
    SequenceExpression: ["expressions"],
    ObjectExpression: {
        properties: [
            "value",
            ["computed", true],
            "key"
        ]
    },
    //EntryStatement:["object"],
    VariableDeclarator: ["init"],
    ExpressionStatement: ["expression"],
    NewExpression: ["callee", "arguments"],
    CallExpression: ["callee", "arguments"],
    TemplateLiteral: ["expressions"],
    MemberExpression: ["object", ["computed", true], "property"],
    AssignmentExpression: ["left", "right"],
    AssignmentPattern: ["right"],
    LogicalExpression: ["left", "right"],
    BinaryExpression: ["left", "right"],
    ForOfStatement: ["left", "right"],
    ForInStatement: ["left", "right"],
    ConditionalExpression: ["test", "consequent", "alternate"],
    ForStatement: ["init", "test", "update"],
    IfStatement: ["test"],
    SwitchCase: ["test"],
    SwitchStatement: ["discriminant"],//cases
    DoWhileStatement: ["test"],
    WhileStatement: ["test"],
    UpdateExpression: ["argument"],
    SpreadElement: ["argument"],
    UnaryExpression: ["argument"],
    ReturnStatement: ["argument"],
    YieldExpression: ["argument"],
    AwaitExpression: ["argument"],

}


function _paramsToDeclaration(node: Node) {
    let params = node.params;

    if (node.expression) {
        node.expression = false;
        node.body = BLOCK_STATEMENT(
            [RETURN_STATEMENT(node.body)]
        );
    }
    let body = node.body.body;
    let has_convert = false;
    for (let i = params.length - 1; i >= 0; i--) {
        let id = IDENTIFIER(`_webx$_D${this[PROXY_NODE.DEPTH]}_P${i}`);
        let pattern_set = [];
        decodeDeclarator(
            params[i],
            function (id: string, props: DeclareProps) {
                pattern_set.push([id, props]);
            }, [id]
        );
        if (
            has_convert
            || (
                pattern_set.length > 1
                || pattern_set[0][1].length > 1
                || pattern_set[0][1][0].type !== "Identifier"
            )
        ) {
            has_convert = true;
            for (let [id, props] of pattern_set) {
                body.unshift(
                    VARIABLE_DECLARATION(
                        [VARABLE_DECLARATOR(
                            id,
                            PROPS_TO_EXPRESSION(props)
                        )]
                    )
                );
            }
            params[i] = id;
        }
    }
}
function _setParamsDeclare(node: Node) {
    let body_declaration_node = this.body;

    let params_declaration_node = this.params;
    decodeDeclarations(
        node.params,
        function (id: string, props: DeclareProps) {
            if (!/^_webx\$_/.test(id)) {
                setDeclare(params_declaration_node, id, props);
                setDeclare(body_declaration_node, id, props);
            }
        }, [IDENTIFIER("arguments")]
    );
}


const BUBBLE_HOOKS = {
    FunctionDeclaration: _setParamsDeclare,
    FunctionExpression: _setParamsDeclare,
    Program(node: Node) {
        nextEpoch(this);
        makeMarks(this);
        makeObserver(this, 0);
        let top_index = 0;
        let top_list: Array<Node> = node.body;
        top_list.every(function (node: Node, index: number) {
            if (node.directive || node.type === "ImportDeclaration") {
                top_index = index + 1;
                return true;
            }
        });
        top_list.splice(top_index, 0, runtime);
    },

}
function addAssignRecord(proxy_node: Node, name: string, props: DeclareProps) {
    let key = "-" + name;
    let assign_record = proxy_node[PROXY_NODE.ASSIGN_RECORD];
    (assign_record[key] || (assign_record[key] = [])).push(props);
}

const CAPTURE_HOOKS = {
    ExportNamedDeclaration(node: Node) {
        if (node.specifiers.length) {
            if (this[PROXY_NODE.BLOCK_SCOPED_STACK][0][PROXY_NODE.NEPOCH] < 1) {
                return 0;
            }
            let specifiers = [];
            let declarations = [];
            for (let specifier of node.specifiers) {
                let id = specifier.exported.name, local = specifier.local;
                if (id !== local.name) {
                    declarations.push(
                        VARABLE_DECLARATOR(
                            id, local
                        )
                    )
                } else {
                    specifiers.push(specifier);
                }
            }

            if (!declarations.length) {
                return;
            }
            let res = {
                type: "ExportNamedDeclaration",
                declaration: VARIABLE_DECLARATION(
                    declarations
                    , "var"
                ),
                specifiers: [],
                source: null
            };

            if (specifiers.length) {
                return [
                    res,
                    {
                        type: "ExportNamedDeclaration",
                        declaration: null,
                        specifiers: specifiers,
                        source: null
                    }
                ]
            }
            return res;
        }
    },
    ImportDeclaration(node: Node) {
        for (let specifier of node.specifiers) {
            switch (specifier.type) {
                case "ImportDefaultSpecifier":
                case "ImportSpecifier":
                    setDeclare(
                        this[PROXY_NODE.FUNCTION_SCOPED_STACK][0],
                        specifier.local.name,
                        [specifier.local]
                    );
                    break;
            }
        }
    },
    Element: createElement,
    PreventExpression(node: Node) {
        return PREVENT([RETURN_STATEMENT(node.expression)]);
    },
    PreventStatement(node: Node) {
        console.log(node);
        return EXPRESSION_STATEMENT(PREVENT(node.statement.body));
    },
    ActionDeclaration(node: Node) {
        let id = node.action.id.name;
        let scoped_node = this[PROXY_NODE.BLOCK_SCOPED_STACK][0];

        scoped_node[PROXY_NODE.OBSERVER_MARKS]["-" + id] |= OBSERVER_MARK.NEED_REDECLARE;
        setDeclare(scoped_node, id, [node], true);
        /**
         * ActionDeclaration 是要被剔除重新定义的
         * 这里 使其内部节点能被正常处理
         */
        _ProxyNode(node.action, this.parent);
        return [];
    },
    ActionExpression(node: Node) {
        return ACTION_EXPRESSION(
            node.action
        );
    },
    RunInActionStatement(node: Node) {
        return RUN_IN_ACTION_STATEMENT(node);
    },

    //FunctionDeclaration: _paramsToDeclaration,
    FunctionExpression: _paramsToDeclaration,
    FunctionDeclaration(node: Node) {

        _paramsToDeclaration.call(this, node);
        /*[{ ...node, type: "FunctionExpression" }]*/
        setDeclare(this[PROXY_NODE.BLOCK_SCOPED_STACK][0], node.id.name, [node]);
    },
    ClassDeclaration(node: Node) {
        setDeclare(this[PROXY_NODE.BLOCK_SCOPED_STACK][0], node.id.name, [node]);
    },
    AssignmentExpression(node: Node) {
        if (node.left.type === "Identifier") {
            addAssignRecord(this, node.left.name, [node, "left"]);
        }
    },
    UpdateExpression(node: Node) {
        if (node.argument.type === "Identifier") {
            addAssignRecord(this, node.argument.name, [node, "argument"]);
        }
    },
    BindingExpression(node: Node) {
        return AUTORUN(
            RETURN_STATEMENT(node.expression)
        );
    },
    BindingStatement(node: Node) {
        return AUTORUN_STATEMENT(
            node.statement
        )
    },
    EntryStatement(node: Node) {
        return ENTRY_STATEMENT(node)
    },
    Program(node: Node) {
        this[PROXY_NODE.NEPOCH] = 0;
        this[PROXY_NODE.DEPTH] = 0;

        this[PROXY_NODE.NEXT_EPOCH] = [];
        this[PROXY_NODE.SUBSCOPES] = [];

        this[PROXY_NODE.BLOCK_DECLARES] = this[PROXY_NODE.FUNCTION_DECLARES] = {};
        this[PROXY_NODE.BLOCK_SCOPED_STACK] = this[PROXY_NODE.FUNCTION_SCOPED_STACK] = [this];

        this[PROXY_NODE.OBSERVER_MARKS] = {};
        this[PROXY_NODE.OBSERVER_MAP] = {};
        this[PROXY_NODE.REFERENCE_RECORD] = {};
        this[PROXY_NODE.ASSIGN_RECORD] = {};


    },
    BlockStatement(node: Node) {
        let parent_type = this.parent.node.type;
        let is_function = parent_type === "FunctionExpression" || parent_type === "FunctionDeclaration";

        this[PROXY_NODE.DEPTH] += 1;
        if (is_function) {
            if (node instanceof AutoRun && !node.passive) {
                this[PROXY_NODE.SCOPE_STATUS] |= SCOPE_STATUS.AUTORUN | SCOPE_STATUS.REACTIVE;
            } else {
                this[PROXY_NODE.SCOPE_STATUS] &= ~SCOPE_STATUS.AUTORUN;
            }
        }
        initScope(
            this,
            is_function
        );
    },
    ForStatement(node: Node) {
        let init = node.init;
        toBlockStatement(node, "body");
        if (init && init.type === "VariableDeclaration" && init.kind === "var") {
            node.init = null;
            return SPLIT_VARIABLE_DECLARATION(init).concat(node);
        }
    },
    ForInStatement(node: Node) {
        let init = node.left;
        toBlockStatement(node, "body");

        if (init && init.type === "VariableDeclaration" && init.kind === "var") {
            node.left = init.declarations[0].id;
            return SPLIT_VARIABLE_DECLARATION(init).map(function (node: Node) {
                node.declarations[0].init = null;
                return node;
            }).concat(node);
        }
    },
    ForOfStatement(node: Node) {
        let init = node.left;
        toBlockStatement(node, "body");
        if (init && init.type === "VariableDeclaration" && init.kind === "var") {
            node.left = init.declarations[0].id;
            return SPLIT_VARIABLE_DECLARATION(init).map(function (node: Node) {
                node.declarations[0].init = null;
                return node;
            }).concat(node);
        }
    },
    VariableDeclaration(node: Node) {
        let is_block_declares = node.kind === "let";
        let parent_node = this.parent.node;
        let parent_type = parent_node.type;
        let declaration_node = this;
        let declarations = node.declarations;
        if (parent_type === "ExportNamedDeclaration") {
            return;
        }
        if (
            parent_type === "ForStatement"
            || parent_type === "ForInStatement"
            || parent_type === "ForOfStatement"
        ) {
            parent_node._bubble = function (parent: ProxyNode) {
                let declaration_node = parent.body;
                decodeDeclarations(
                    declarations,
                    function (id: string) {
                        setDeclare(declaration_node, id, [], is_block_declares)
                    }
                );
            }
        } else {
            if (declarations.length !== 1 || declarations[0].id.type !== "Identifier") {
                let res = SPLIT_VARIABLE_DECLARATION(node);
                return res;
            }
            decodeDeclarations(
                declarations,
                function (id: string, props: DeclareProps) {
                    setDeclare(declaration_node, id, props, is_block_declares);
                }
            );
        }
        initScope(declaration_node, true);
        decodeDeclarations(
            declarations,
            function (id: string, props: DeclareProps) {
                setDeclare(declaration_node, id, props, is_block_declares);
            }
        );
    },
    IfStatement(node: Node) {
        toBlockStatement(node, "consequent");
        toBlockStatement(node, "alternate");
    },
    params(node: Node) {
        /**
         * 使得 params 被识别为独立的作用域
         * （实际上 AssignmentPattern 等 逻辑上也可以看作 BodyStatement 的上级作用域)
         * 由于 params 可能需要 observable 的关系
         * 这里是让 params 作为单独的作用域， BodyStatement 作为 params 的平级作用域
         * 
         */
        initScope(this, true);
    },

}

function toBlockStatement(node: Node, prop: string) {
    let block = node[prop];
    if (block && block.type !== "BlockStatement") {
        node[prop] = BLOCK_STATEMENT(block);
    }
}


function setDeclare(
    declaration_node: ProxyNode,
    id: string,
    props: DeclareProps,
    is_block_declares?: boolean
) {
    if (/^_webx_/.test(id)) {
        return;
    }
    let name = "-" + id;
    let declares: Record<string, any>, scoped_node: ProxyNode;
    if (is_block_declares) {
        declares = declaration_node[PROXY_NODE.BLOCK_DECLARES];
        scoped_node = declaration_node[PROXY_NODE.BLOCK_SCOPED_STACK][0]
    } else {
        declares = declaration_node[PROXY_NODE.FUNCTION_DECLARES];
        scoped_node = declaration_node[PROXY_NODE.FUNCTION_SCOPED_STACK][0];
    }
    let declaration = declares[name];
    (
        declaration && declaration[0] === scoped_node
            ? declaration
            : (declares[name] = [])
    ).unshift(scoped_node, declaration_node, props);

}


function createNode(proxy_node: ProxyNode, body: Node | Array<Node>, is_reactive: boolean | number) {
    let parent = proxy_node.parent.parent?.node;
    let node: Node;
    if (
        parent
        && parent.type === "CallExpression"
        && (
            parent.callee.name === "_webx_next_child"
            || parent.callee.name === "_webx_next_nodes"
        )
    ) {
        if (is_reactive) {
            parent.arguments[3] = LITERAL(1);
            node = isExpression(body) ? body : _AutoRun(FUNCTION_EXPRESSION(body), true);
        } else {
            parent.arguments.length = 2;
            node = body;
        }
    } else {
        node = is_reactive && !isExpression(body)
            ? AUTORUN(body, true)
            : is_reactive === true ? CALL_EXPRESSION(body) : body;
    }
    node.range = proxy_node.node.range;
    node.loc = proxy_node.node.loc;
    return node;
}

function createComponent(node: Node) {
    let props: Array<Node> = [];
    let children: Array<Node> = [];

    for (let attribute of node.openingTag.attributes) {
        let attribute_name = attribute.name;
        let attribute_value = attribute.value || LITERAL("");
        let is_binding = false;
        if (attribute_value.type === "BindingExpression") {
            is_binding = true;
            attribute_value = attribute_value.expression;
        }
        let set_attribute = ASSIGNMENT_STATEMENT(
            MEMBER_EXPRESSION(IDENTIFIER("_webx$_props"), attribute_name),
            attribute_value
        );
        props.push(
            is_binding ? AUTORUN_STATEMENT(set_attribute) : set_attribute
        );
    }

    node.children && buildChildren(node.children, children, this[PROXY_NODE.DEPTH]);

    return createNode(
        this,
        CREATE_COMPONENT(node.openingTag.name, props, children),
        true
    );
}

const ATTRIBUTE_TO_EVENT = {
    value: "input",
    checked: "change"
}


function createElement(node: Node) {

    let tag_name = node.openingTag.name;
    let maybe_component = /^[A-Z]$/.test(tag_name[0]);
    if (
        maybe_component &&
        this[PROXY_NODE.BLOCK_SCOPED_STACK][0][PROXY_NODE.NEPOCH] < 1
    ) {
        /**
         * epoch 为0 可能还无法获得全部可能的定义声明，这里需要判断是否是组件元素
         */
        return 0;
    }

    if (
        maybe_component
        && (
            this[PROXY_NODE.BLOCK_DECLARES]["-" + tag_name]
            ||
            ProxyNode.isExternalDeclaration
            && ProxyNode.isExternalDeclaration(tag_name)
        )
    ) {
        return createComponent.call(this, node);
    }

    let props: Array<Node> = [];
    let children: Array<Node> = [];

    node.children && buildChildren(node.children, children, this[PROXY_NODE.DEPTH]);

    for (let attribute of node.openingTag.attributes) {
        let attribute_name = attribute.name.name;
        let attribute_value = attribute.value || LITERAL("");

        props.push(
            SET_ATTRIBUTE(
                attribute_name,
                attribute_value,
                /^(on[^_-]*)|(value|id|checked)$/.test(attribute_name)
            )
        );
        switch (tag_name) {
            case "select":
            case "input":
                if (attribute_value.type === "BindingExpression") {
                    let event = ATTRIBUTE_TO_EVENT[attribute_name];
                    props.push(
                        SET_MODEL_REACTIVE(
                            event, attribute_value.expression, attribute_name
                        )
                    )
                }
                break;
        }
    }

    return createNode(
        this,
        CREATE_ELEMENT(node.openingTag.name, props, children),
        props.length || children.length
    );
}

function buildChildren(target_nodes: Array<Node>, bind_nodes: Array<Node>, tag: string | number) {
    for (let node of target_nodes) {
        let getter: Node, is_reactive = false;
        switch (node.type) {
            case "Text":
                getter = LITERAL(node.value);
                break;
            case "BindingDeclaration":
                bind_nodes.push(...BINDING_DECLARATION(node.declaration, 0, tag));
                continue;
            case "Element":
                getter = node;
                is_reactive = true;
                break;
            case "BindingStatement":
                node = node.statement;
                let body: Array<Node>;
                if (
                    node.type === "BlockStatement"
                ) {
                    body = node.body;
                    if (!body.length) {
                        continue;
                    }
                } else {
                    body = [node];
                }
                if (body.length > 1 || body[0].type !== "ExpressionStatement") {
                    bind_nodes.push(
                        NEXT_BLOCK_SIBLING(body, 0, tag, true, true)
                    );
                    continue;
                }
                node = body[0];
            case "BindingExpression":
                getter = node.expression;
                if (getter.type !== "Literal") {
                    is_reactive = true;
                    getter = FUNCTION_EXPRESSION(RETURN_STATEMENT(getter));
                }
                break;
            case "CSSRule":
                buildChildren(node.children, bind_nodes, tag);
                continue;
            default:
                getter = node;
                break;
        }
        bind_nodes.push(NEXT_CHILD_STATEMENT(getter, is_reactive));
    }
    return bind_nodes;
}


export {
    ProxyNode,
    PROXY_NODE,
    _ProxyNode,
    SCOPE_STATUS,
    OBSERVER_MARK
}
