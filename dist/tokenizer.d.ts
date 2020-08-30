import Character from './character';
import { Position, Token, Validate } from "./interfaces";
export default class extends Character {
    constructor(options?: Record<string, any>);
    tokens: Array<Token>;
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
    private match;
    private nextIdentifier;
    get maybe_regex(): any;
    private nextPunctuator;
    private nextNumeric;
    private _nextToken;
}
