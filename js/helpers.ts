
import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from './Dison/js/interfaces';
import Parser, { isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem } from './parser';

function insert_toplevel_node(body: Array<Node>, item: Node) {
    for (let i = 0; true; i++) {
        if (i >= body.length || !body[i].directive) {
            body.splice(
                i, 0, item
            )
            return i;
        }
    }
}

function get_binding_targets(node: Node): Array<Node> {
    switch (node.type) {
        case "Identifier":
            return [node];
        case "ObjectPattern":
            return node.properties.reduce(
                function (res: Array<Node>, property: Node) {
                    return res.concat(get_binding_targets(property.value));
                }, []
            )
        case "AssignmentPattern":
            return get_binding_targets(node.left);
    }
    return []
}
function spread_member_expression(expr: Node) {
    let res = [];
    let node = expr;
    do {
        res.unshift(node.computed, node.property);
        node = node.object;
    } while (node.type === "MemberExpression");
    res.unshift(node);
    return res;
}
function add_source_if_shallow_node(wrap_node: Node, raw_node: Node, sources: Record<string, any>) {
    let name: string;
    switch (raw_node.type) {
        case "MemberExpression":
            raw_node = spread_member_expression(raw_node);
            if (raw_node[0].type === "Identifier") {
                name = raw_node[0].name;
                break;
            } else {
                return;
            }
        case "Identifier":
            name = raw_node.name;
            break;
        default:
            return;
    }
    if (!/^_webx/.test(name)) {
        (sources[name] || (sources[name] = [])).push(wrap_node, raw_node);
    }
}


export {
    insert_toplevel_node,
    get_binding_targets,
    spread_member_expression,
    add_source_if_shallow_node,
};