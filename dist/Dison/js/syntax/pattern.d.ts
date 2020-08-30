import { Node, Token, Context } from '../interfaces';
declare const Patterns: Record<string, any>;
export { Patterns, parseArrayPattern, parseObjectPattern };
declare function parseArrayPattern(context: Context, token: Token): Node;
declare function parseObjectPattern(context: Context, token: Token): Node;
