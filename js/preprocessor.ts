
import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from './Dison/js/interfaces';
import Parser, { isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem } from './parser';

let ignore_keys = ["range", "loc", "type"]
import OPERATIONS from './operations';


let BASE_ID: number;
let binding_types = ["BindingExpression", "BindingGenerator"];

export default function (node: Node) {
    BASE_ID = 1;
    return preprocessor(node)
};


function is_useful(node: Node, key: string) {
    if (ignore_keys.indexOf(key) < 0) {
        let value = node[key];
        return value && typeof node[key] === "object";
    }
    return false
}


function is_binding(parent_node: Node, key: string | number, node: Node) {
    if (binding_types[0] === node.type) {
        preprocessor(node.expression);
        return arguments;
    } else if (binding_types[1] === node.type) {
        preprocessor(node.body);
        return arguments;
    } if (isStatementListItem(node)) {
        preprocessor(node);
        return false;
    } else {
        let bindings = [];
        for (let key in node) {
            if (is_useful(node, key)) {
                let binding_item = is_binding(node, key, node[key]);
                binding_item && bindings.push(binding_item)
            }
        }
        return bindings.length && bindings;
    }
}


function clone(obj: any) {
    let s_set = [], t_set = [];
    return _clone(obj);
    function _clone(obj: any) {
        if (typeof obj === "object" && obj !== null) {
            var i = s_set.indexOf(obj);
            if (i !== -1) {
                return t_set[i];
            } else {
                var res = obj instanceof Array ? [] : {};
                s_set.push(obj);
                t_set.push(res);
                for (var k in obj) {
                    res[k] = _clone(obj[k]);
                }
                return res;
            }
        } else {
            return obj;
        }
    }
}


function VariableDeclaration(node: Node) {
    let result = [node];
    for (let i = 0; i < result.length; i++) {
        let variable_declatation = result[i];
        let declarations = variable_declatation.declarations;
        for (let j = 0, last_index = declarations.length - 1; j <= last_index; j++) {
            let declarator = declarations[j];
            let init = declarator.init;
            if (init && is_binding(declarator, "init", init)) {
                //debugger;
                result.push(OPERATIONS.ASSIGNMENT_STATEMENT(
                    declarator.id,
                    init
                ));
                declarator.init = null;
                if (j < last_index) {
                    let next_declarations = declarations.splice(j + 1, last_index - j);
                    result.push(
                        OPERATIONS.VARIABLE_DECLARATION(
                            next_declarations,
                            variable_declatation.kind
                        )
                    )
                }
                i += 1;
                break;
            }
        }
    }
    return result;
}
function ForStatement(node: Node) {
    let result = [node];
    let variable_declatation = node.init;
    if (variable_declatation) {
        if (variable_declatation.kind === "var") {
            node.init = null;
            result = VariableDeclaration(variable_declatation).concat(result);
        } else {
            let binding_list = is_binding(variable_declatation, "declarations", variable_declatation.declarations);
            if (binding_list) {
                debugger;
                /*let bak = clone(variable_declatation);
                if (node.body.type !== "BlockStatement") {
                    node.body = OPERATIONS.BLOCK_STATEMENT(node.body);
                }

                let loop = OPERATIONS.VARIABLE_DECLARATION(
                    [
                        OPERATIONS.VARABLE_DECLARATOR(
                            get_unique_id(),
                            OPERATIONS.FUNCTION_EXPRESSION(node.body)
                        )
                    ],
                    "let"
                );
                console.log(444444, variable_declatation, bak);*/
            }else{
                preprocessor(node);
            }
        }
    }
    return result;
}
let PREPROCESSORS = {
    ForStatement,
    VariableDeclaration
}

function preprocessor(node: Node) {
    for (let key in node) {
        let item: Node = node[key];
        if (key === "body" && item instanceof Array) {
            let body: Array<Node> = item;
            for (let i = 0; i < body.length; i++) {
                let _preprocessor = PREPROCESSORS[body[i].type];
                if (_preprocessor) {
                    let nodes = _preprocessor(body[i]);
                    body.splice(i, 1, ...nodes);
                    i += nodes.length - 1;
                } else {
                    preprocessor(item);
                }
            }
        } else if (is_useful(node, key)) {
            preprocessor(item);
        }
    }
    return node;
}
function get_unique_id() {
    return "_webx_p_" + (BASE_ID++).toString(36);
}
