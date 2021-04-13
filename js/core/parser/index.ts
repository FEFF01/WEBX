

console.time("dison");


import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';

import { createSearchTree, _Scanner } from '../../Dison/js/lexical/head'

import {
    TYPE_ENUMS,
    PUNCTUATORS,
    TOKEN_TYPE_SET,
    REGEXP_DESCRIPTOR
} from "../../Dison/js/lexical/index";

import Parser from '../../Dison/js/parser';

import {
    async_getter,
    token_hooks, createMatchTree, TYPE_ALIAS, _Mark, _Or, _Pattern, _Validate, _Identifier, _Keyword,

    reinterpretIdentifierAsKeyword,
    reinterpretKeywordAsIdentifier,
    _Series,
    _Punctuator,
    _NonCollecting,
    _NonCapturing,
    is_right_parentheses,
    is_right_brackets,
    is_right_braces,
    _Option,
    _SuccessCollector,
    join_content,
    extract_success,
    parse_and_extract,
    _Context
} from '../../Dison/js/syntax/head'

import Expressions, { PARAMS_PATTERN, FUNCTION_BODY_PATTERN, PrimaryExpressions } from '../../Dison/js/syntax/expression'
import Declarations from '../../Dison/js/syntax/declaration'
import Statements from '../../Dison/js/syntax/statement'
import ModuleDeclarations from '../../Dison/js/syntax/module_declaration'


import './script-extends'


import { WEBX_PUNCTUATORS, ELEMENT_DESCRIPTORS, ATTRIBUTES_TREE } from './html-extends'



async_getter.open();
let EXPRESSION_TREE: MatchTree = async_getter.EXPRESSION_TREE;
const SYNTAX_TREE = createMatchTree([
    Declarations,
    ModuleDeclarations,
    Statements
], EXPRESSION_TREE);





const PUNCTUATORS_TREE = createSearchTree(WEBX_PUNCTUATORS);
const PRIMARY_EXPR_START_PUNCTUATORS_TREE = createSearchTree(
    [REGEXP_DESCRIPTOR, ...ELEMENT_DESCRIPTORS],
    createSearchTree(WEBX_PUNCTUATORS, undefined, ["/="]),
);



let EXPRESSION_ITEM_PATTERN = {};
let DECLARATION_ITEM_PATTERN = {};
let STATEMENT_ITEM_PATTERN = {};
let STATEMENT_LIST_ITEM_PATTERN = {};
let MODULE_ITEM_PATTERN = {};
for (
    const [descriptor, patterns]
    of
    [
        [
            Expressions,
            [EXPRESSION_ITEM_PATTERN]
        ],
        [
            Declarations,
            [DECLARATION_ITEM_PATTERN, STATEMENT_LIST_ITEM_PATTERN]
        ],
        [
            Statements,
            [STATEMENT_ITEM_PATTERN, STATEMENT_LIST_ITEM_PATTERN]
        ],
        [
            ModuleDeclarations,
            [MODULE_ITEM_PATTERN, STATEMENT_LIST_ITEM_PATTERN]
        ],
    ] as Array<[Record<string, any>, Array<Record<string, boolean>>]>
) {
    for (const key in descriptor) {
        if (key) {
            for (const pattern of patterns) {
                pattern[key] = true;
            }
        }
    }
}

function isExpression(node: Node) {
    return EXPRESSION_ITEM_PATTERN[node.type];
}
function isDeclaration(node: Node) {
    return DECLARATION_ITEM_PATTERN[node.type];
}
function isStatement(node: Node) {
    return STATEMENT_ITEM_PATTERN[node.type];
}
function isStatementListItem(node: Node) {
    return STATEMENT_LIST_ITEM_PATTERN[node.type];
}
function isModuleItem(node: Node) {
    return MODULE_ITEM_PATTERN[node.type];
}


const TOKEN_TYPE_MAPPERS: Record<string, string | number> = TOKEN_TYPE_SET.reduce(
    (map, [type, id_set]) => {
        for (let id of id_set) {
            map[" " + id] = type;
        }
        return map;
    }, {}
);

async_getter.webx_inited = true;

console.timeEnd("dison");

class WEBXParser extends Parser {
    token_hooks = token_hooks;

    TYPE_ENUMS = TYPE_ENUMS;
    PRIMARY_EXPR_START_PUNCTUATORS_TREE = PRIMARY_EXPR_START_PUNCTUATORS_TREE;
    PUNCTUATORS_TREE = PUNCTUATORS_TREE;
    TOKEN_TYPE_MAPPERS = TOKEN_TYPE_MAPPERS;
    SYNTAX_TREE = SYNTAX_TREE;
    EXPRESSION_TREE = EXPRESSION_TREE;

    isExpression = isExpression;
    isStatement = isStatement;
    isStatementListItem = isStatementListItem;
    isDeclaration = isDeclaration;
    isModuleItem = isModuleItem;

    isPrimaryExprStart() {
        if (this.tokens.length) {
            let last_token = this.tokens[this.tokens.length - 1];
            return last_token.type === "OpeningTag"
                || last_token.type === "ClosingTag"
                || last_token.type === "Element"
                || last_token.type === "Params"
                //|| last_token.value === "\\" && last_token.type === "Punctuator"
                || super.isPrimaryExprStart();
        } else {
            return true;
        }
    }
    inIdentifierStart() {
        return this.match_tree_stack[0] === ATTRIBUTES_TREE && this.input[this.index] === "-"
            ? 1 : super.inIdentifierStart();
    }
    inIdentifierPart() {
        return this.match_tree_stack[0] === ATTRIBUTES_TREE && this.input[this.index] === "-"
            ? 1 : super.inIdentifierPart();
    }
}
export {
    isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem,

    SYNTAX_TREE,
    EXPRESSION_TREE,
}

let parser = new WEBXParser();
export default function (input: string) {
    return parser.parse(input);
};