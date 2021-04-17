
import {
    Token, Node, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';

import {
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
    ACTION_EXPRESSION,
    PROPS_TO_EXPRESSION
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
    ProxyNode,
    PROXY_NODE,
    _ProxyNode,
    SCOPE_STATUS,
    OBSERVER_MARK
} from './proxy'




type DeclareProps = Array<Node | number | string | DeclareProps>;



function setReferenceRecords(
    proxy_node: ProxyNode,
    rules: Record<string, any>,
    node: Node,
    record: Record<string, Array<[Node, string | number, ProxyNode]>>
) {
    rules[node.type] && walk(node, rules[node.type]);


    function walk(node: Node, factor: any) {
        if (node instanceof Array) {
            for (let _node of node) {
                walk(_node, factor);
            }
        } else if (factor instanceof Array) {
            for (let item of factor) {
                if (item instanceof Array) {
                    if (node[item[0]] !== item[1]) {
                        break;
                    }
                } else {
                    add_record(node, item);
                }
            }
        } else {
            for (let key in factor) {
                node[key] && walk(node[key], factor[key]);
            }
        }
    }

    function add_record(parent: Node, key: string | number) {

        let node = parent[key];
        if (!node) {
            return;
        }
        if (node instanceof Array) {
            for (let i in node) {
                add_record(node, i);
            }
        } else {
            walk(parent, key);
        }

        function walk(parent: Node, prop: string | number) {
            let node = parent[prop];
            switch (node.type) {
                case "Identifier":
                    let name = "-" + node.name;
                    if (!/^-_webx_/.test(name)) {
                        (
                            record[name] || (record[name] = [])
                        ).push([parent, prop, proxy_node]);
                    }
                    break;
                case "AssignmentPattern":
                    walk(node, "left");
                    break;
                case "ObjectPattern":
                    for (let property of node.properties) {
                        walk(property, "value");
                    }
                    break;
                case "ArrayPattern":
                    for (
                        let i = 0, elements = node.elements, element: Node;
                        i < elements.length;
                        i++
                    ) {
                        elements[i] && walk(elements, i);
                    }
                    break;
                case "RestElement":
                    walk(node, "argument");
                    break;
                default:
                    //console.log(node);
                    break;
            }
        }
    }
}

function initScope(scope_node: ProxyNode, is_function_scope: boolean) {

    let declares: Record<string, any> = {
        __proto__: scope_node[PROXY_NODE.BLOCK_DECLARES]
    };
    let scoped_stack: Array<ProxyNode> = [scope_node]
        .concat(scope_node[PROXY_NODE.BLOCK_SCOPED_STACK]);;


    scope_node[PROXY_NODE.NEPOCH] = 0;
    scope_node[PROXY_NODE.NEXT_EPOCH] = [];
    scope_node[PROXY_NODE.SUBSCOPES].push(scope_node);
    scope_node[PROXY_NODE.SUBSCOPES] = [];

    scope_node[PROXY_NODE.OBSERVER_MARKS] = {};
    scope_node[PROXY_NODE.OBSERVER_MAP] = {};
    scope_node[PROXY_NODE.REFERENCE_RECORD] = {};
    scope_node[PROXY_NODE.ASSIGN_RECORD] = {};

    if (
        is_function_scope
    ) {
        scope_node[PROXY_NODE.FUNCTION_DECLARES] = declares;
        scope_node[PROXY_NODE.FUNCTION_SCOPED_STACK] = scoped_stack;

    }

    scope_node[PROXY_NODE.BLOCK_DECLARES] = declares;
    scope_node[PROXY_NODE.BLOCK_SCOPED_STACK] = scoped_stack;
}

let chars = Array.from({ length: 52 }).map(
    (v, i) => String.fromCharCode(65 + (i / 26 < 1 ? i : (i + 6)))
)
function num2id(num: number) {
    let mod = chars.length;
    let id = "";
    do {
        id = chars[num % mod] + id;
        num = (num / mod) | 0;
    } while (num > 0)

    return id;
}

function nextEpoch(root: ProxyNode) {
    while (root = walk(root)) {
    }

    function walk(scoped_node: ProxyNode) {
        scoped_node[PROXY_NODE.NEPOCH] += 1;
        let iterates = scoped_node[PROXY_NODE.NEXT_EPOCH];
        if (iterates.length) {
            for (let [node, parent, prop] of iterates.splice(0, iterates.length)) {
                _ProxyNode(node, parent, prop);
            }
        }
        let res: ProxyNode, count = 0;//= processes.length && scoped_node;

        for (let scope of scoped_node[PROXY_NODE.SUBSCOPES]) {
            let _res = walk(scope);
            if (_res) {
                res = _res;
                count += 1;
            }
        }
        return count > 1 || iterates.length ? scoped_node : res;
    }
}

function makeMarks(scoped_node: ProxyNode) {
    for (let key in scoped_node[PROXY_NODE.ASSIGN_RECORD]) {
        let block_declares = scoped_node[PROXY_NODE.BLOCK_DECLARES];
        let declarations = block_declares[key];
        let ref_scoped = declarations && declarations[0];
        if (ref_scoped) {
            ref_scoped[PROXY_NODE.OBSERVER_MARKS][key] |= OBSERVER_MARK.HAS_ASSIGN;
        }
    }
    for (let scope of scoped_node[PROXY_NODE.SUBSCOPES]) {
        makeMarks(scope);
    }
    //let is_autorun = scoped_node[PROXY_NODE.SCOPE_STATUS] & SCOPE_STATUS.AUTORUN;
    if (scoped_node[PROXY_NODE.SCOPE_STATUS] & SCOPE_STATUS.REACTIVE) {
        let block_declares = scoped_node[PROXY_NODE.BLOCK_DECLARES];
        let reference_records = scoped_node[PROXY_NODE.REFERENCE_RECORD];

        for (let key in reference_records) {
            let records = reference_records[key];
            let declarations = block_declares[key];
            let ref_scoped = declarations && declarations[0];
            if (
                ref_scoped
                /**
                 * 可能存在 variableDeclaration 作为 scoped 的情况（用于通用逻辑处理特殊情况）
                 */
                && ref_scoped.body
                /**
                 * 非 autorun 环境，不存在引用变更的变量不必要单独代理
                 */
                && (
                    ref_scoped[PROXY_NODE.SCOPE_STATUS] & SCOPE_STATUS.AUTORUN
                    || records.some(
                        function (record) {
                            return record[2][PROXY_NODE.SCOPE_STATUS] & SCOPE_STATUS.AUTORUN
                        }
                    )
                )
                /**
                 * 仅进行 new 或 call 操作的变量不必要代理
                 */
                && records.some(([, key]) => key !== "callee")
            ) {
                ref_scoped[PROXY_NODE.OBSERVER_MARKS][key] |= OBSERVER_MARK.NEED_PROXY;
            }
        }
    }


}


function makeObserver(scoped_node: ProxyNode, depth: number) {

    let reference_records = scoped_node[PROXY_NODE.REFERENCE_RECORD];
    let block_declares = scoped_node[PROXY_NODE.BLOCK_DECLARES];

    let declare_keys = Object.keys(block_declares);


    if (declare_keys.length && scoped_node.body) {
        let observer_state = scoped_node[PROXY_NODE.OBSERVER_MARKS];
        let observer_map = scoped_node[PROXY_NODE.OBSERVER_MAP];

        let toplevel_list: Array<Node> = scoped_node.node.body;
        let declaration_index = 0;

        toplevel_list.every(function (node, index) {
            if (node.directive || node.type === "ImportDeclaration") {
                declaration_index = index + 1;
                return true;
            }
        });
        let top_cursor = declaration_index;
        let ob_id = "_webx$" + depth;
        let base_id = 0;
        for (let index = 0; index < declare_keys.length; index++) {
            let key = declare_keys[index];
            let state = observer_state[key];
            let value = block_declares[key];

            if (state & OBSERVER_MARK.NEED_REDECLARE) {
                for (let i = 0; i < value.length; i += 3) {
                    let props = value[i + 2];
                    let node = props[0];
                    if (
                        props.length !== 1
                        || node.type !== "ActionDeclaration"
                    ) {
                        continue;
                    }
                    node = node.action;
                    toplevel_list.splice(
                        top_cursor++, 0,
                        VARIABLE_DECLARATION([
                            VARABLE_DECLARATOR(
                                node.id.name,
                                ACTION_EXPRESSION(
                                    node
                                )
                            )
                        ], "var")
                    );

                }
            }
            if (!(state & OBSERVER_MARK.NEED_PROXY)) {
                continue;
            }

            if (
                value.length === 3
                && /^-_webx\$_/.test(key)
            ) {
                // _webx$_ 开头的标识符用于内部传递可观测变量
                // 本身可观测不需要额外处理
                continue;
            }
            let ob_sub_id = num2id(base_id++);
            observer_map[key] = MEMBER_EXPRESSION(
                IDENTIFIER(ob_id),
                IDENTIFIER(ob_sub_id)
            );
            for (let i = 0; i < value.length; i += 3) {

                let declaration: ProxyNode = value[i + 1];

                let declaration_node = declaration.node;
                let init_expression: Node = ASSIGNMENT_EXPRESSION(
                    MEMBER_EXPRESSION(
                        IDENTIFIER(ob_id),
                        IDENTIFIER(ob_sub_id)
                    ),
                    IDENTIFIER(key.slice(1))
                )
                let init_statement: Node = EXPRESSION_STATEMENT(init_expression);

                switch (declaration_node.type) {
                    case "Program":
                    case "BlockStatement":
                        toplevel_list.splice(top_cursor++, 0, init_statement)
                        break;
                    default:
                        let scoped_list = toplevel_list;
                        let declarator = declaration_node.declarations[0];
                        let pos = scoped_list.indexOf(declaration_node);

                        let declarator_init = declarator.init;
                        if (pos < 0) {
                            scoped_list = declaration.parent.node;
                            console.log(declaration);
                            pos = scoped_list.indexOf(declaration_node);

                            if (pos < 0) {
                                debugger;
                                continue;
                            }
                        }

                        if (declarator_init) {
                            init_expression.right = declarator_init;
                            if (
                                state & OBSERVER_MARK.HAS_ASSIGN
                                /**
                                 * 有可能一个变量在一个作用域内重复定义
                                 * 方法声明只经过 BlockStatement 的 case
                                 */
                                || value.length > 3
                            ) {
                                scoped_list.splice(pos, 1, init_statement);
                            } else {

                                /**
                                 * _webx$_ 开头的标识符用于内部传递可观测变量
                                 * 当 init 为 确认的 MemberExpression 时
                                 * 间接的响应代理等同于直接的引用捕获
                                 */
                                if (
                                    value.length === 3
                                    && (
                                        declarator_init.type === "MemberExpression"
                                        && declarator_init.object.type === "Identifier"
                                        && /^_webx\$_/.test(declarator_init.object.name)
                                        && (
                                            declarator_init.property.type === "Identifier"
                                            || declarator_init.property.type === "Literal"
                                        )
                                    )
                                ) {
                                    observer_map[key] = declarator_init;
                                    base_id -= 1;
                                    scoped_list.splice(pos, 1);
                                    continue;
                                }
                                if (
                                    scoped_node[PROXY_NODE.SCOPE_STATUS] & SCOPE_STATUS.AUTORUN
                                    && !(
                                        declarator_init.type === "Literal"
                                        || declarator_init.type === "Identifier"
                                        && /^_webx\$_/.test(declarator_init.name)
                                    )
                                ) {
                                    init_statement = AUTORUN_STATEMENT(
                                        init_statement
                                    );
                                }
                                scoped_list.splice(pos, 1, init_statement)

                            }

                            Object.defineProperty(
                                declarator,
                                "init",
                                {
                                    set(val) {
                                        declarator_init = init_expression.right = val;
                                    },
                                    get() {
                                        return declarator_init;
                                    }
                                }
                            );
                        } else {
                            scoped_list.splice(pos, 1);
                        }
                        break;
                }
            }
        }

        base_id && toplevel_list.splice(
            declaration_index, 0,
            VARIABLE_DECLARATION([
                VARABLE_DECLARATOR(
                    ob_id,
                    OBSERVABLEABLE({
                        type: "ObjectExpression",
                        properties: []
                    })
                )
            ], "let")
        );
    }
    for (let scope of scoped_node[PROXY_NODE.SUBSCOPES]) {
        makeObserver(scope, depth + 1);
    }
    for (let key in reference_records) {
        let ref_scoped = block_declares[key]?.[0];
        if (!ref_scoped) {
            continue;
        }
        let ref_node = ref_scoped[PROXY_NODE.OBSERVER_MAP][key];
        if (!ref_node) {
            continue;
        }
        for (let [node, prop] of reference_records[key]) {
            node[prop] = ref_node;
            if (prop === "value" && node.type === "Property" && node.shorthand) {
                node.shorthand = false;
            }
        }
    }

}



function decodeDeclarator(
    declaration: Node,
    callback: Function,
    props: DeclareProps
) {
    walk(declaration, props);
    function walk(node: Node, props: DeclareProps) {
        switch (node.type) {
            case "Identifier":
                callback(node.name, props);
                break;
            case "VariableDeclarator":
                props.push([node, "init"]);
                walk(node.id, props);
                break;
            case "AssignmentPattern":
                walk(node.left, [[props, node.right]]); //
                break;
            case "ObjectPattern":
                for (let property of node.properties) {
                    let _props = props.slice();
                    _props.push(
                        property.computed
                            ? [property, "key"]
                            : property.key.name
                    );
                    walk(property.value, _props);
                }
                break;
            case "ArrayPattern":
                for (
                    let i = 0, elements = node.elements, element: Node;
                    i < elements.length;
                    i++
                ) {
                    element = elements[i];
                    if (element) {
                        walk(element, props.concat(i));
                    }
                }
                break;
            case "RestElement":
                props.push([props.pop()]);
                walk(node.argument, props);
                break;
            default:
                debugger;
                break;
        }
    }
}
function decodeDeclarations(
    declarations: Array<Node>,
    callback: Function,
    props?: DeclareProps
) {
    for (let i = 0; i < declarations.length; i++) {
        let declaration = declarations[i];
        declaration && decodeDeclarator(declaration, callback, props ? props.concat(i) : []);//walk(declaration, props ? props.concat(i) : []);
    }
}

let base_id = 0;
function volatileId() {
    return ++base_id;
}


export {
    volatileId,
    DeclareProps, decodeDeclarations, decodeDeclarator,
    nextEpoch, makeMarks, makeObserver, num2id, initScope, setReferenceRecords
}