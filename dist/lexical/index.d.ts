import { NUMERIC_TYPE } from '../interfaces';
declare let TOKEN_TYPE_ENUMS: Record<string, string | number>;
declare const NUMERIC_KEYWORD_MAP: {
    ".": number;
    x: NUMERIC_TYPE;
    b: NUMERIC_TYPE;
    o: NUMERIC_TYPE;
    X: NUMERIC_TYPE;
    B: NUMERIC_TYPE;
    O: NUMERIC_TYPE;
};
declare const TOKEN_TYPE_MAPPERS: {};
declare const PUNCTUATORS_TREE: import("../interfaces").SearchTree;
declare const PRIOR_REGEXP_PUNCTUATORS_TREE: import("../interfaces").SearchTree;
export { PRIOR_REGEXP_PUNCTUATORS_TREE, PUNCTUATORS_TREE, NUMERIC_KEYWORD_MAP, TOKEN_TYPE_MAPPERS, TOKEN_TYPE_ENUMS };
