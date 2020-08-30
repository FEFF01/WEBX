import { SearchTree } from '../interfaces';
import Tokenizer from '../tokenizer';
declare function createSearchTree(data: Array<string | string[] | Record<string, any>>, root?: Record<string, any>, block_list?: Array<string>): SearchTree;
declare const enum MARKS {
    EOF = "",
    ESCAPE = "\\"
}
declare function escape_scan(tokenizer: Tokenizer, start: number, scope?: Record<string, any>): any;
export { createSearchTree, escape_scan, MARKS };
