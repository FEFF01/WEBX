import { Node } from './Dison/js/interfaces';
declare function insert_toplevel_node(body: Array<Node>, item: Node): number;
declare function get_binding_targets(node: Node): Array<Node>;
declare function spread_member_expression(expr: Node): any[];
declare function add_source_if_shallow_node(wrap_node: Node, raw_node: Node, sources: Record<string, any>): void;
export { insert_toplevel_node, get_binding_targets, spread_member_expression, add_source_if_shallow_node, };
