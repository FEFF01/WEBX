import { Context, SourceLocation, Node } from '../interfaces';
declare function get_variable_declarator(context: Context, id: Node, init: Node, range: [number, number], loc: SourceLocation): Node;
declare const Declarations: Record<string, any>;
export { get_variable_declarator };
export default Declarations;
