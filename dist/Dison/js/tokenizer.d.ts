import Character from './character';
import { Position, Token, SearchTree, Validate } from "./interfaces";
export default class extends Character {
    constructor(options?: Record<string, any>);
    tokens: Array<Token>;
    curly_stack: Array<any>;
    TYPE_ENUMS: Record<string, string | number>;
    TOKEN_TYPE_MAPPERS: Record<string, string | number>;
    PUNCTUATORS_TREE: SearchTree;
    PRIMARY_EXPR_START_PUNCTUATORS_TREE: SearchTree;
    token_hooks: Record<string, (token: Token, tokenizer: this) => Token>;
    line_number: number;
    line_start: number;
    save_comments: boolean;
    error_logs: Array<any>;
    terminator_stack: Array<Validate>;
    err(...args: any): void;
    init(input: string): void;
    tokenize(input: string): Array<Token>;
    nextToken(): Token;
    createToken(type: string | number, range: [number, number], value?: any, start?: Position, end?: Position): Token;
    match(node: SearchTree): any;
    nextIdentifier(): Token | void;
    isPrimaryExprStart(): boolean;
    nextPunctuator(): Token | void;
    nextNumeric(): Token | void;
    skipNonsenses(): boolean;
    private _nextToken;
}
