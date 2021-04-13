import { NodeProp, Cover as CoverInterface, Mark as MarkInterface, Node, Pipe, Connector, Matched, Context, Token, Validate } from '../interfaces';
import Tokenizer from "../tokenizer";
declare function _Punctuator(...values: Array<string | number>): Or;
declare function _Keyword(...values: Array<string | number>): Or;
declare function _Identifier(...values: Array<string | number>): Or;
declare function _Pattern(...args: Array<string | number>): Or;
import Parser from '../parser';
declare abstract class Operator {
    operands: Operands;
    private _factors;
    private _pipes;
    private _walker;
    private _bind_env;
    sub_operators: any[];
    test: (token: Token, index?: number) => boolean;
    constructor(operands: Operands);
    pipe(pipe: Pipe): this;
    walk(walker: Connector, bind_env?: boolean): this;
    get factors(): (Mark | Operator | [string | number, (string | number)[]])[];
    abstract attach(parents: IterationRecord, key: string | Cover, pipes?: Array<Pipe>): IterationRecord;
    protected map(parents: IterationRecord, factor: [string | number, Array<string | number>] | Operator | Mark, key: string | Cover, pipes?: Array<Pipe>): IterationRecord;
    private getNode;
    protected setWrap(records: IterationRecord): IterationRecord;
    protected getDeepNodes(parents: IterationRecord, key: string | Cover, pipes?: Array<Pipe>): IterationRecord;
    protected getNextNodes(parents: IterationRecord, key: string | Cover, pipes?: Array<Pipe>): any[];
}
declare type Operand = string | /*number |*/ Operator | Mark | Array<string | number>;
declare type Operands = Array<Operand>;
declare type IterationRecordItem = [Record<string, any>, Array<NodeProp>, [Record<string, any>, string, string, IterationRecordItem] | null];
declare type IterationRecord = Array<IterationRecordItem>;
declare class Option extends Operator {
    attach(parents: IterationRecord, key: string, pipes?: Array<Pipe>): any[];
}
declare class Or extends Operator {
    attach(parents: IterationRecord, key: string, pipes?: Array<Pipe>): any[];
}
declare class Series extends Operator {
    attach(parents: IterationRecord, key: string, pipes?: Array<Pipe>): IterationRecord;
}
declare class Cover implements CoverInterface {
    origin: any;
    value: any;
    constructor(origin: any, value: any);
}
declare class NonCapturing extends Operator {
    attach(parents: IterationRecord, key: string | Cover, pipes?: Array<Pipe>): any[];
}
declare class NonCollecting extends Operator {
    attach(parents: IterationRecord, key: string | Cover, pipes?: Array<Pipe>): any[];
}
declare class Loop extends Operator {
    attach(parents: IterationRecord, key: string): IterationRecord;
}
declare class Mark implements MarkInterface {
    static MATCHED_RECORD: Matched;
    key: string;
    value: any;
    constructor(value?: any);
    data(context: Context, index: number): any;
    attach(parents: IterationRecord, key: string | Cover, pipes?: Array<Pipe>): IterationRecord;
}
declare function _Option(...some: Operands): Option;
declare function _Or(...some: Operands): Or;
declare function _Series(...some: Operands): Series;
declare function _NonCapturing(...some: Operands): NonCapturing;
declare function _NonCollecting(...some: Operands): NonCollecting;
declare function _Loop(...some: Operands): Loop;
declare function _Mark(some?: any): Mark;
declare let NODES: Record<string, (...args: any) => void>;
declare function createMatchTree(data: Record<string, any> | Array<Record<string, any>>, root?: Record<string, any>, block_list?: Array<string>, prevent_update?: boolean): Record<string, any>;
declare function _Context(parser: Parser): Context;
declare function isFutureReservedWord(id: string): boolean;
declare function isStrictModeReservedWord(id: string): boolean;
declare function isRestrictedWord(id: string): boolean;
declare const IDENTIFIER_OR_THROW_STRICT_RESERVED_WORDS_PATTERN: Or;
declare const EXPRESSION_OR_THROW_STRICT_RESERVED_WORDS_PATTERN: Or;
declare const IDENTIFIER_OR_VALIDATE_STRICT_RESERVED_WORDS_PATTERN: Or;
declare const EXPRESSION_OR_VALIDATE_STRICT_RESERVED_WORDS_PATTERN: Or;
declare function validateIdentifier(context: Context, node: Node): boolean;
declare function validateAssignment(context: Context, node: Node): boolean;
declare function validateBinding(context: Context, node: Node): boolean;
declare function validateLineTerminator(context: Context): Record<string, any>;
declare function _SuccessCollector(pattern: string | Operator): {
    Success: {
        handler: ([collected]: Context) => any;
        precedence: number;
        collector: {
            success: Or;
            content: string | Operator;
        }[];
    };
};
declare let join_content: ([collected]: Context) => any;
declare let TYPE_ALIAS: {};
declare const ASSIGNMENT_PUNCTUATORS_PATTERN: Or;
declare const STATEMANT_LIST_ITEM_PATTERN: Or;
declare const RIGHT_SIDE_TOPLEVEL_ITEM_PATTERN: Or;
declare const TOPLEVEL_ITEM_PATTERN: Or;
declare function isAligned(context: Context, left: number, right: number): boolean;
declare function attachLocation(source: Node, start: Node, end?: Node): void;
declare function reinterpretKeywordAsIdentifier({ value, range, loc }: Token, tokenizer?: Tokenizer): Node;
declare function reinterpretIdentifierAsKeyword({ value, range, loc }: Token): Node;
declare function _Validate(type: string | number, value: string): Validate;
declare let is_right_parentheses: Validate;
declare let is_right_brackets: Validate;
declare let is_right_braces: Validate;
declare function extract_success(parser: Parser, nodes: Array<Node>): Node[];
declare function parse_and_extract(match_tree: Record<string, any>, context: Context, node: Node): any;
declare function get_inner_group(token: Token): Token;
declare function parse_next_statement(context: Context, start?: number): number;
declare let token_hooks: Record<string, (token: Token, tokenizer?: Tokenizer | Parser) => Token>;
declare let async_getter: Record<string, any>;
export { Operator, async_getter, token_hooks, parse_next_statement, get_inner_group, extract_success, parse_and_extract, _Punctuator, _Keyword, _Identifier, _Pattern, is_right_parentheses, is_right_brackets, is_right_braces, _Validate, reinterpretIdentifierAsKeyword, reinterpretKeywordAsIdentifier, attachLocation, Cover, Mark, isAligned, STATEMANT_LIST_ITEM_PATTERN, RIGHT_SIDE_TOPLEVEL_ITEM_PATTERN, TOPLEVEL_ITEM_PATTERN, _SuccessCollector, join_content, IDENTIFIER_OR_VALIDATE_STRICT_RESERVED_WORDS_PATTERN, EXPRESSION_OR_VALIDATE_STRICT_RESERVED_WORDS_PATTERN, IDENTIFIER_OR_THROW_STRICT_RESERVED_WORDS_PATTERN, EXPRESSION_OR_THROW_STRICT_RESERVED_WORDS_PATTERN, ASSIGNMENT_PUNCTUATORS_PATTERN, validateBinding, validateLineTerminator, NODES, TYPE_ALIAS, createMatchTree, isRestrictedWord, isFutureReservedWord, isStrictModeReservedWord, validateIdentifier, validateAssignment, _Context, _Option, _Or, _Series, _NonCapturing, _NonCollecting, _Mark, _Loop, };
