import { Token, MARKS } from '../interfaces';
import Tokenizer from '../tokenizer';
declare let TOKEN_TYPE_SET: (string | string[])[][];
declare const PUNCTUATORS: Array<any>;
declare const REGEXP_DESCRIPTOR: {
    key: string;
    type: string;
    scan_tree: {
        '/': {
            " END"(tokenizer: Tokenizer, self: Record<string, any>): boolean;
        };
        '[': {
            " ATT"(tokenizer: Tokenizer, self: Record<string, any>): void;
        };
        ']': {
            " ATT"(tokenizer: Tokenizer, self: Record<string, any>): void;
        };
        '\n': {
            " ERR": string;
        };
        '\\\n': {
            " ERR": string;
        };
        "": {
            " END": boolean;
            " ERR": string;
        };
    };
    overload: boolean;
    escape_scan: (tokenizer: Tokenizer, start?: number) => Token;
    class_marker: boolean;
    scanner(tokenizer: Tokenizer, start: number): any;
};
declare const TYPE_ENUMS: {
    Identifier: string;
    Keyword: string;
    String: string;
    Boolean: string;
    Numeric: string;
    Punctuator: string;
    RegularExpression: string;
    Template: string;
    TemplateElement: string;
    Comments: string;
    Null: string;
};
export { TYPE_ENUMS, PUNCTUATORS, TOKEN_TYPE_SET, REGEXP_DESCRIPTOR };
