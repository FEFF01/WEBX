import { Node, Token, Context } from '../interfaces';
import { parseArrayPattern, parseObjectPattern } from './pattern';
declare const Expressions: Record<string, any>;
declare let UNIT_EXPRESSION_TREE: Record<string, any>;
declare let EXPRESSION_TREE: Record<string, any>;
export { Expressions, EXPRESSION_TREE, UNIT_EXPRESSION_TREE, parseArrayPattern, parseObjectPattern, parse_params };
declare function parse_params(context: Context, tokens: Array<Token>): Node[];
