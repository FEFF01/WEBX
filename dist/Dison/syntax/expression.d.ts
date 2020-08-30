import { Node, Token, Context } from '../interfaces';
import { parseArrayPattern, parseObjectPattern } from './pattern';
declare const PrimaryExpressions: Record<string, any>;
declare const Expressions: Record<string, any>;
export default Expressions;
export { PrimaryExpressions, Expressions, parseArrayPattern, parseObjectPattern, parse_params };
declare function parse_params(context: Context, tokens: Array<Token>): Node[];
