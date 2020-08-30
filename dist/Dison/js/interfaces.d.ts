import Parser from './parser';
interface Position {
    line: number;
    column: number;
}
interface SourceLocation {
    start: Position;
    end: Position;
}
interface Node {
    type?: string | number;
    range?: [number, number];
    loc?: SourceLocation;
    [propName: string]: any;
}
interface Token extends Node {
    value?: any;
    content?: any;
    regex?: {
        pattern: string;
        flags: string;
    };
    [propName: string]: any;
}
interface Expression extends Node {
    elements?: Array<Expression>;
    expressions?: Array<Expression>;
}
declare type Program = Expression;
declare type MatchTree = Record<string, any>;
declare type SearchTree = MatchTree | Record<string, number | string | Array<string>>;
declare const enum NUMERIC_TYPE {
    BINARY = 1,
    OCTAL = 2,
    DECIMAL = 4,
    HEX = 8,
    FLOAT = 32,
    E = 64,
    NAN = 128
}
declare const enum CONTEXT {
    collected = 0,
    parser = 1,
    left = 2,
    right = 3,
    start = 4,
    end = 5,
    begin = 6,
    tokens = 7,
    rightAssociativeNode = 8,
    matched = 9,
    bindingSet = 10,
    labelSet = 11,
    strict = 12,
    isModule = 13,
    isExpression = 14,
    inFunctionBody = 15,
    inIteration = 16,
    inSwitch = 17,
    bindingElement = 18,
    spreadElement = 19,
    allowAwait = 20,
    allowYield = 21,
    length = 22
}
interface Context extends Array<any> {
    [CONTEXT.collected]?: Record<string, Node | string | any | Array<Node | string | any>>;
    [CONTEXT.parser]: Parser;
    [CONTEXT.left]?: number;
    [CONTEXT.right]?: number;
    [CONTEXT.start]?: number;
    [CONTEXT.end]?: number;
    [CONTEXT.begin]?: number;
    [CONTEXT.tokens]?: Array<Node>;
    [CONTEXT.rightAssociativeNode]?: Node;
    [CONTEXT.matched]?: Matched;
    [CONTEXT.bindingSet]?: Array<string>;
    [CONTEXT.labelSet]?: Array<string>;
    [CONTEXT.strict]?: boolean;
    [CONTEXT.isModule]?: boolean;
    [CONTEXT.isExpression]?: boolean;
    [CONTEXT.inIteration]?: boolean;
    [CONTEXT.inFunctionBody]?: number;
    [CONTEXT.inSwitch]?: boolean;
    [CONTEXT.bindingElement]?: boolean;
    [CONTEXT.spreadElement]?: boolean;
    [CONTEXT.allowAwait]?: boolean;
    [CONTEXT.allowYield]?: boolean;
    tokens: Array<Token>;
    getToken(index: number): Token;
    wrap(key: number, value: any): Context;
    unwrap(): Context;
    store(...args: Array<CONTEXT | any>): number;
    restore(point: number): number;
}
interface Wrapper {
    (): void;
    [propName: string]: any;
}
declare const enum MATCHED {
    precedence = 0,
    props = 1,
    wrapper = 2,
    handler = 3,
    validator = 4,
    filter = 5
}
interface Mark {
    key: string;
    value: string;
    data: (context: Context, index: number) => any;
}
interface Cover {
    origin: any;
    value: any;
}
declare type Operation = null | 0 | undefined | false;
declare type NodeProp = [string | Cover | Mark, number, Array<Pipe> | undefined];
declare type Pipe = (context: Context, token: Token | null, index: number) => any | undefined;
declare type Connector = (context: Context, index: number) => void;
interface Matched extends Array<any> {
    [MATCHED.precedence]: Precedence;
    [MATCHED.props]: Array<NodeProp>;
    [MATCHED.wrapper]: Wrapper;
    [MATCHED.handler]?: (context: Context) => Operation | Node | Array<Node>;
    [MATCHED.validator]?: (context: Context) => Operation | true | Node | Array<Node>;
    [MATCHED.filter]?: (context: Context, left?: number, right?: number) => boolean;
}
declare const enum MATCHED_RECORDS {
    precedence = 0,
    left = 1,
    right = 2,
    matched = 3
}
interface MatchedRecords extends Array<any> {
    [MATCHED_RECORDS.precedence]: Precedence;
    [MATCHED_RECORDS.left]: number;
    [MATCHED_RECORDS.right]: number;
    [MATCHED_RECORDS.matched]: Matched;
}
declare const enum PRECEDENCE {
    VALUE = 0,
    RIGHT_ASSOCIATIVE = 1
}
interface Precedence extends Array<any> {
    [PRECEDENCE.VALUE]: number | true;
    [PRECEDENCE.RIGHT_ASSOCIATIVE]: number | Number;
}
declare type Validate = (token: Token) => boolean;
declare const enum MARKS {
    BOUNDARY = "",
    DEEPTH = " DEEP",
    IDENTIFIER = " ID",
    END = " END",
    TYPE_ONLY = " TYPE",
    WALKER = " WAL",
    TERMINAL = " TER",
    EOF = "",
    ESCAPE = "\\",
    ERROR = " ERR",
    NEXT = " NEXT",
    ATTACH = " ATT",
    STRING = " STR"
}
declare enum NUMERIC_KEYWORD_MAPPINGS {
    "." = 36,
    "x" = 8,
    "b" = 1,
    "o" = 2,
    "X" = 8,
    "B" = 1,
    "O" = 2
}
export { NUMERIC_KEYWORD_MAPPINGS, MARKS, Validate, PRECEDENCE, Precedence, NodeProp, Mark, Cover, Pipe, Connector, Position, SourceLocation, MATCHED_RECORDS, MatchedRecords, Matched, MATCHED, Token, Context, CONTEXT, Expression, Program, NUMERIC_TYPE, MatchTree, SearchTree, /* Tokenizer, Parser,*/ Node };
