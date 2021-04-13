import { Token } from '../../Dison/js/interfaces';
import Tokenizer from '../../Dison/js/tokenizer';
declare const ATTRIBUTES_TREE: Record<string, any>;
declare const ELEMENT_DESCRIPTORS: {
    key: string;
    type: string;
    scanner: typeof scan_tag;
    filter: typeof left_tag_filter;
}[];
declare function scan_tag(tokenizer: Tokenizer, start: number): void | Token;
declare function left_tag_filter(tokenizer: Tokenizer): boolean;
declare let WEBX_PUNCTUATORS: any[];
export { ATTRIBUTES_TREE, WEBX_PUNCTUATORS, ELEMENT_DESCRIPTORS };
