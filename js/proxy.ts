import { isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem } from './parser';

import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from './Dison/js/interfaces';

import OPERATIONS from './operations';

import {
    insert_toplevel_node,
    get_binding_targets,
    spread_member_expression,
    add_source_if_shallow_node,
} from './helpers';

import runtime, { scoped_runtime } from './runtime';
import ast_preprocessor from './preprocessor'


let BASE_ID: number, declaring_variables: Array<Node>;
let tasks: Array<() => any>, tasks_after: Array<() => any>;
export default function (ast: Node) {
    BASE_ID = 1;
    declaring_variables = [];
    tasks = [];
    tasks_after = [];
    console.time("_ProxyNode");

    let root_proxy_node: any = _ProxyNode(
        ast_preprocessor(ast),
        false,
        ""
    );
    tasks.forEach(task => task());
    tasks_after.forEach(task => task());

    for (let scope of declaring_variables) {
        let scope_node = scope._node;
        let context = scope._context;
        let body = scope_node.body instanceof Array ? scope_node.body : scope_node.body.body;
        let declarations = [];
        let new_variables = context.new_variables;
        for (let [key, init] of new_variables) {
            declarations.push(
                OPERATIONS.VARABLE_DECLARATOR(key, init)
            );
        }
        /*for (let key in new_variables) {
            declarations.push(
                OPERATIONS.VARABLE_DECLARATOR(key, new_variables[key])
            );
        }*/
        insert_toplevel_node(body,
            OPERATIONS.VARIABLE_DECLARATION(declarations, "let")
        );
    }

    let proxy_ast = root_proxy_node._node;

    insert_toplevel_node(
        proxy_ast.body, scoped_runtime
    );
    proxy_ast.body = [
        OPERATIONS.EXPRESSION_STATEMENT(
            OPERATIONS.CALL_EXPRESSION(
                OPERATIONS.FUNCTION_EXPRESSION(proxy_ast.body)
            )
        )
    ]
    insert_toplevel_node(
        proxy_ast.body, runtime
    );

    console.timeEnd("_ProxyNode");
    return proxy_ast;
}

function _ProxyNode(target: any, parent: any, key: string) {
    let proxy_node = new class ProxyNode {
        _context: any = {};
        _prevent_bubbing = false;
        constructor(node: Node, private _parent: ProxyNode, private _key: string) {
            this.__proto__.__proto__ = node;
            let context = this._context;
            context.__proto__ = _parent._context;
            let observer = node.observer;
            if (observer !== undefined) {
                if (observer) {
                    context.binding_node = this;
                    context.observer = observer;
                    add_source_if_shallow_node(this, node, context.bindings = {});
                    tasks_after.push(set_reactive.bind(this, true));
                } else {
                    context.binding_node = null;
                    context.observer = null;
                    context.bindings = null;
                }
                delete node.observer;
            }
            let type = node.type;
            if (type) {
                let capture = CAPTURES[type];
                let wrap_node = capture && capture.call(this, node);
                if (!wrap_node) {
                    this._capture(node);
                } else {
                    _parent && (_parent._node[_key] = wrap_node);
                    return _ProxyNode(wrap_node, _parent, _key);
                }

            }
        }
        _queryParent(pattern: (node: Node) => boolean) {
            let parent: ProxyNode = this;
            while (!pattern(parent)) {
                parent = parent._parent
            }
            return parent;
        }
        get _parent_node() {
            return this._parent._node;
        }
        get _node() {
            return this.__proto__.__proto__;
        }
        _capture(node: Node) {
            let type = node.type;
            let context = this._context;
            let bindings = context.bindings;
            if (bindings) {
                let capture = CAPTURES_IF_BINDING[type];
                capture && capture.call(this, node, bindings);
                let keys = BINDING_KEYS[type];
                keys && keys.forEach(
                    (key: string) => add_source_if_shallow_node(this, node[key], bindings)
                );
            }
            let keys = MODIFIED_KEYS[type];
            keys && keys.forEach(
                (key: string) => add_source_if_shallow_node(this, node[key], context.updates)
            );
        }
    }(target, parent, key);
    if (proxy_node._node === target) {
        for (let key in target) {
            let value = target[key];
            if (
                key === "range" || key === "loc" ||
                !value || typeof value !== "object" ||
                ~["Identifier", "Literal", "ThisExpression", "Super"].indexOf(value.type)
            ) {
                continue;
            }
            let _node = _ProxyNode(target[key], proxy_node, key);
            if (_node) {
                proxy_node[key] = _node;
            }
        }
    }
    return proxy_node;
}


function init_logger(proxy_node: Node) {
    let context = proxy_node._context;
    context.updates = {};
    context.namespace = {};
    if (proxy_node._parent) {
        context.namespace.__proto__ = proxy_node._parent._context.namespace;
    }
    context.base_id = 0;
    context.wrapped_level = (context.wrapped_level || 0) + 1;

    let parent = proxy_node._parent;
    while (parent) {
        parent._context.scopes.push(proxy_node);
        parent = parent._context.scope_node._parent;
    }
}


function init_scope() {
    let context = this._context;
    context.wrap_node = null;
    context.scope_node = this;
    context.scopes = [this];
    context.scoped_level = (context.scoped_level || 0) + 1;
    init_logger(this);
}

function init_wrapped(node: Node) {
    let context = this._context;
    context.wrap_node = this;
    init_logger(this);
}
function unique_id() {
    return "_webx_" + (BASE_ID++).toString(36);
}

function new_variable_declare(scpoe_node: Node, id: string, init: Node = null) {
    let context = scpoe_node._context;
    if (declaring_variables.indexOf(scpoe_node) < 0) {
        declaring_variables.push(scpoe_node);
        context.new_variables = [];
        //context.new_variables = {};
    }
    /*if (context.new_variables[id] !== undefined) {
        debugger;
    }*/
    //context.new_variables[id] = init;
    context.new_variables.push([id, init]);
}


function reactive(top_scope: Node, observer: string, id: string, members: Node | any[]) {
    for (let scope of top_scope._context.scopes) {
        if (
            scope._context.namespace[id] !== top_scope ||
            scope._prevent_bubbing
        ) {
            continue;
        }
        let targets = scope._context.updates[id];
        if (targets) {
            for (let i = 0; i < targets.length; i += 2) {
                let statement = targets[i]._queryParent(isStatementListItem);
                if (statement.reactives) {
                    if (statement.reactives.indexOf(observer) < 0) {
                        statement.reactives.push(observer);
                        statement.reactive_node.arguments.push(
                            OPERATIONS.IDENTIFIER(observer)
                        );
                    }
                    continue;
                } else {
                    statement.reactives = [observer];
                }
                let statement_node = statement._node;
                let statement_list = statement._wrap_parent_node || statement._parent_node;

                if (!(statement_list instanceof Array)) {
                    debugger;
                }
                let index = statement_list.indexOf(statement_node);
                if (index === -1) {
                    debugger;
                }
                statement_list.splice(
                    index + 1, 0,
                    OPERATIONS.EXPRESSION_STATEMENT(
                        statement.reactive_node = OPERATIONS.CALL_IF_EXISTED(observer)
                    )
                )
            }
        }
    }
}

function set_reactive(need_new_variiable: boolean) {
    let context = this._context;
    let bindings = context.bindings;
    let observer = context.observer;
    let namespace = context.namespace;
    let root_scope: Node, root_level = NaN;
    this._prevent_bubbing = true;
    for (let id in bindings) {
        let refered_list = bindings[id];
        let top_scope: Node = namespace[id];
        if (top_scope) {
            if (!(root_level <= top_scope._context.wrapped_level)) {
                root_scope = top_scope;
            }
            for (let i = 0; i < refered_list.length; i += 2) {
                reactive(top_scope, observer, id, refered_list[i + 1]);
            }
        }
    }
    this._prevent_bubbing = false;
    if (need_new_variiable) {
        if (!root_scope) {
            let parent_context = this._parent._context;
            root_scope = parent_context.wrap_node || parent_context.scope_node;
        }
        new_variable_declare(
            root_scope,
            observer,
            OPERATIONS.ARRAY_EXPRESSION()
        );
    }
}

function set_wrapper() {
    let statement = this._queryParent(isStatementListItem);
    let context = statement._context;
    let has_observer = context.hasOwnProperty("observer");
    if (!has_observer) {
        let observer = context.observer = unique_id();
        let statement_list = statement._parent_node;
        if (!(statement_list instanceof Array)) {
            debugger;
        }
        let statement_node = statement._node;
        statement_list[statement_list.indexOf(statement_node)] = (
            statement.type !== "ReturnStatement" ?
                OPERATIONS.EXPRESSION_STATEMENT
                : OPERATIONS.RETURN_STATEMENT
        )(
            OPERATIONS.REACTABLE(
                observer,
                OPERATIONS.FUNCTION_EXPRESSION(
                    statement._wrap_parent_node = [statement_node]
                )
            )
        );
    }
    this._parent_node[this._key] = this._node.expression;
    tasks_after.push(set_reactive.bind(this, !has_observer))
}


function next_scoped_unique_id(proxy_node: any) {
    let context = proxy_node._context;
    let scope = context.wrap_node || context.scope_node;
    context = scope._context;
    let id = "_webx_t" + context.wrapped_level + "_" + (context.base_id++).toString(36);
    new_variable_declare(scope, id);
    return id;
}

function create_element(node: Node) {
    let tag_name = node.openingTag.name;
    let scope_node = this;
    if (this._context.binding_node) {
        scope_node = this._context.binding_node._parent;
    }
    let id = next_scoped_unique_id(scope_node);
    let element = OPERATIONS.CREATE_ELEMENT(id, tag_name);
    let content: Array<Node> = element.callee.body.body;
    let return_statement = content.pop();
    for (let attribute of node.openingTag.attributes) {
        let attribute_name = attribute.name.name;
        let attribute_value = attribute.value || OPERATIONS.LITERAL("");
        content.push(
            (/^(on[^_-]*)|(value|id|checked)$/.test(attribute_name) ? OPERATIONS.ASSIGN_ATTRIBUTE : OPERATIONS.SET_ATTRIBUTE)(
                id,
                attribute_name,
                attribute_value
            )
        );
        if (tag_name === "input" && attribute_value.type === "BindingExpression") {
            let event = {
                value: "input",
                checked: "change"
            }[attribute_name];

            event && content.push(
                OPERATIONS.ADD_EVENT_LISTENER(
                    id,
                    OPERATIONS.LITERAL(event),
                    OPERATIONS.FUNCTION_EXPRESSION(
                        OPERATIONS.ASSIGNMENT_STATEMENT(
                            attribute_value.expression,
                            OPERATIONS.MEMBER_EXPRESSION(
                                OPERATIONS.IDENTIFIER(id),
                                OPERATIONS.IDENTIFIER(attribute_name)
                            )
                        )
                    )

                )
            )
        }
    }

    if (node.children) {
        for (let child of node.children) {
            switch (child.type) {
                case "CSSRule":
                    for (let node of child.children) {
                        if (node.type === "Text") {
                            content.push(OPERATIONS.APPEND_TEXT(
                                id,
                                OPERATIONS.LITERAL(node.value)
                            ));
                        } else {
                            content.push(
                                OPERATIONS.REACTABLE_APPEND_RESULT(
                                    id,
                                    unique_id(),
                                    OPERATIONS.FUNCTION_EXPRESSION(
                                        OPERATIONS.RETURN_STATEMENT(node.expression)
                                    )
                                )
                            );
                        }
                    }
                    break;
                case "Text":
                    content.push(
                        OPERATIONS.APPEND_TEXT(
                            id,
                            OPERATIONS.LITERAL(child.value)
                        )
                    );
                    break;
                case "Element":
                    content.push(
                        OPERATIONS.APPEND_CHILD(
                            id,
                            child
                        )
                    );
                    break;
                case "BindingExpression":
                    content.push(
                        OPERATIONS.REACTABLE_APPEND_RESULT(
                            id,
                            unique_id(),
                            OPERATIONS.FUNCTION_EXPRESSION(
                                OPERATIONS.RETURN_STATEMENT(child.expression)
                            )
                        )
                    );
                    break;
                case "BindingGenerator":
                    debugger;
                    break;
                default:
                    debugger;
                    break;
            }
        }
    }
    content.push(return_statement);
    return element;
}
const CAPTURES = {
    Element: create_element,
    VariableDeclarator(node: Node) {
        let variable_declaration = this._parent._parent;
        let context = this._context;
        let scope_node: Node = variable_declaration.kind === "var"
            ? context.scope_node
            : (context.wrap_node || context.scope_node)
        let namespace: any = scope_node._context.namespace;


        for (let target of get_binding_targets(node.id)) {
            let name = target.name;
            if (!namespace[name]) {
                namespace[name] = scope_node;
            }
            if (node.init) {
                add_source_if_shallow_node(this, target, context.updates)
            }
        }
    },
    BindingExpression(node: Node) {
        let context = this._context;
        context.binding_node = this;
        add_source_if_shallow_node(this, node.expression, context.bindings = {});
        tasks.push(set_wrapper.bind(this));
    },
    BindingGenerator(node: Node) {
        init_scope.call(this);
        let context = this._context;
        context.binding_node = this;
        context.bindings = {};
        tasks.push(set_wrapper.bind(this));
    },
    Program: init_scope,
    FunctionExpression(node: Node) {
        let context = this._context;
        init_scope.call(this);
        node.params.reduce(
            (namespace: any, param: Node) => {
                for (let target of get_binding_targets(param)) {
                    namespace[target.name] = this;//
                }
                return namespace;
            }, context.namespace
        )
    },
    FunctionDeclaration(node: Node) {
        CAPTURES.FunctionExpression.call(this, node);
        let context = this._context;
        let scope_node = context.scope_node;
        let namespace: any = scope_node._context.namespace;
        let id = node.id, name = id.name;
        if (!namespace[name]) {
            namespace[name] = scope_node;
        }
        add_source_if_shallow_node(this, node, context.updates);
    },
    ClassDeclaration(node: Node) {
        let context = this._context;
        let scope_node = context.wrap_node || context.scope_node;
        let namespace: any = scope_node._context.namespace;
        let id = node.id, name = id.name;
        if (!namespace[name]) {
            namespace[name] = scope_node;
        }
        add_source_if_shallow_node(this, node, context.updates);
    },
    BlockStatement(node: Node) {
        if (this._parent instanceof Array) {
            init_wrapped.call(this, node);
        }
    },

    ForStatement: init_wrapped,
    SwitchStatement: init_wrapped,
    ForInStatement: init_wrapped,
    ForOfStatement: init_wrapped,
}
const CAPTURES_IF_BINDING = {
    CallExpression(node: Node, bindings: Array<Node>) {
        add_source_if_shallow_node(this, node.callee, bindings);
        for (let arg of node.arguments) {
            add_source_if_shallow_node(this, arg, bindings);
        }
    },
    ArrayExpression(node: Node, bindings: Array<Node>) {
        for (let element of node.elements) {
            add_source_if_shallow_node(this, element, bindings);
        }
    },
    ObjectExpression(node: Node, bindings: Array<Node>) {
        for (let propertie of node.properties) {
            if (propertie.computed) {
                add_source_if_shallow_node(this, propertie.key, bindings);
            }
            add_source_if_shallow_node(this, propertie.value, bindings);
        }
    },
    TemplateLiteral(node: Node, bindings: Array<Node>) {
        for (let propertie of node.expressions) {
            add_source_if_shallow_node(this, propertie, bindings);
        }
    }
};
const BINDING_KEYS = {
    AssignmentExpression: ["right"],
    UpdateExpression: ["argument"],
    LogicalExpression: ["left", "right"],
    BinaryExpression: ["left", "right"],
    ConditionalExpression: ["test", "consequent", "alternate"],
    ForOfStatement: ["right"],
    ForInStatement: ["right"],
    ForStatement: ["init", "test", "update"],
    IfStatement: ["test"],
    SwitchStatement: ["discriminant"],//cases
    DoWhileStatement: ["test"],
    WhileStatement: ["test"],
    SpreadElement: ["argument"],
    UnaryExpression: ["argument"],
    ReturnStatement: ["argument"]
}

const MODIFIED_KEYS = {
    AssignmentExpression: ["left"],
    UpdateExpression: ["argument"],
}