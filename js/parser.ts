

console.time("init");
import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from './Dison/js/interfaces';

import { createSearchTree, _Scanner } from './Dison/js/lexical/head'

import {
    TYPE_ENUMS,
    PUNCTUATORS,
    TOKEN_TYPE_SET,
    REGEXP_DESCRIPTOR
} from "./Dison/js/lexical/index";

import Parser from './Dison/js/parser';
import Tokenizer from './Dison/js/tokenizer';

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
} from './Dison/js/syntax/head'

import Expressions, { PrimaryExpressions } from './Dison/js/syntax/expression'
import Declarations from './Dison/js/syntax/declaration'
import Statements from './Dison/js/syntax/statement'
import ModuleDeclarations from './Dison/js/syntax/module_declaration'



function parse_tag(lexcal_terminator: Validate, context: Context, token: Token, index: number) {
    let [collected, parser] = context;
    let range = parser.parseRange(
        ATTRIBUTES_TREE,
        context,
        index,
        lexcal_terminator
    );
    collected.value = range.value;
    collected.attributes = extract_success(parser, range.content);
    return token.name;
}


function collect_binding_expression(parser: Parser, self: Record<string, any>) {
    parser.index -= 2;
    self.collect_text_node(parser);
    let { scopes } = self;
    let { context, index, children } = scopes;
    let node = parser.parseCustom(
        EXPRESSION_TREE,
        context,
        index,
        function (node: Node) { return true }
    );
    if (node) {
        context.tokens.splice(index, 1);
        children.push(node);
        scopes.cursor = parser.index;
        save_volatility(parser, self);
    } else {
        parser.index += 2;
        debugger;
    }
}

let skip_html_comment = {
    scan_tree: {
        "-": {
            "-": {
                ">": {
                    [MARKS.NEXT]() {
                        return true;
                    }
                }
            }
        }
    },
    parse: _Scanner(false)
}

function save_volatility(parser: Parser, self: Record<string, any>) {
    self.scopes.start = parser.index;
    self.scopes.line_number = parser.line_number;
    self.scopes.line_start = parser.line_start;
}
let inner_html = {
    collect_text_node(parser: Parser) {
        if (this.scopes.start < parser.index) {
            let { start, line_number, line_start, children } = this.scopes;
            let text_node = {
                type: "Text",
                value: parser.input.slice(start, parser.index),
                range: [start, parser.index],
                loc: {
                    start: {
                        line: line_number, column: start - line_start
                    },
                    end: {
                        line: parser.line_number, column: parser.index - parser.line_start
                    }
                }
            };
            children.push(text_node);
            save_volatility(parser, this);
            return text_node;
        }
    },
    scan_tree: {
        [MARKS.ESCAPE + "{"]: {
            [MARKS.NEXT]: collect_binding_expression
        },
        [MARKS.ESCAPE + "("]: {
            [MARKS.NEXT]: collect_binding_expression
        },
        "<": {
            [MARKS.NEXT](parser: Parser, self: Record<string, any>) {
                let char = parser.input[parser.index];
                let { context, index, children } = self.scopes;
                if (char === "/") {
                    parser.index -= 1;
                    self.collect_text_node(parser);
                    parser.parseCustom(
                        parser.SYNTAX_TREE,
                        context,
                        index,
                        function (node: Node) { return node.type === "ClosingTag" }
                    );
                    return self.scopes.children;
                } else if (char !== "!") {
                    parser.index -= 1;
                    self.collect_text_node(parser);
                    let element = parser.parseCustom(
                        parser.SYNTAX_TREE,
                        context,
                        index,
                        parser.isExpression
                    );
                    if (element) {
                        context.tokens.splice(index, 1);
                        children.push(element);
                        save_volatility(parser, self);
                    } else {
                        debugger;
                    }
                }
            },
            "!": {
                "-": {
                    "-": {
                        [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                            parser.index -= 4;
                            self.collect_text_node(parser);
                            parser.index += 4;
                            skip_html_comment.parse(parser);
                            save_volatility(parser, self);
                            return "";
                        },
                    }
                }
            }
        }
    },
    scopes: null,
    scanner: _Scanner(true),
    parse(parser: Parser, context: Context, index: number) {
        let _scopes = this.scopes;
        this.scopes = {
            children: [],
            index,
            context,
            parser,
            cursor: parser.index,
            start: parser.index,
            line_number: parser.line_number,
            line_start: parser.line_start
        };
        let res = this.scanner(parser);
        this.scopes = _scopes;
        return res;

    }
}

function parse_next_punctuator(length: number, parser: Parser, self: Record<string, any>) {
    parser.index -= length;
    collect_rule_text(parser, self);
    if (!parser.nextPunctuator()) {
        parser.index += length;
    }
}
function collect_rule_text(parser: Parser, self: Record<string, any>, merge_spaces = true) {
    let { scopes } = self;
    if (scopes.cursor < parser.index) {
        let new_text = parser.input.slice(scopes.cursor, parser.index)
        scopes.text += merge_spaces ? new_text.replace(/(\s)\s+/g, "$1") : new_text;
        scopes.cursor = parser.index;
    }
}
let css_rules = {
    collect_text_node(parser: Parser, merge_spaces?: boolean) {
        collect_rule_text(parser, this, merge_spaces)
        let { scopes } = this;
        if (scopes.text) {
            let { start, line_number, line_start } = scopes;
            let text_node = {
                type: "Text",
                value: scopes.text,
                range: [start, parser.index],
                loc: {
                    start: {
                        line: line_number, column: start - line_start
                    },
                    end: {
                        line: parser.line_number, column: parser.index - parser.line_start
                    }
                }
            };
            scopes.children.push(text_node);
            save_volatility(parser, this);
            scopes.text = "";
            return text_node;
        }
    },
    scan_tree: {
        [MARKS.ESCAPE + "{"]: {
            [MARKS.NEXT]: collect_binding_expression
        },
        [MARKS.ESCAPE + "("]: {
            [MARKS.NEXT]: collect_binding_expression
        },
        "{": {
            [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                self.scopes.ndeep += 1;
            }
        },
        "/": {
            "*": {
                [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                    parse_next_punctuator(2, parser, self)
                    self.scopes.cursor = parser.index;
                }
            }
        },
        "\"": {
            [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                parse_next_punctuator(1, parser, self);
                collect_rule_text(parser, self, false);
            }
        },
        "'": {
            [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                parse_next_punctuator(1, parser, self);
                collect_rule_text(parser, self, false);
            }
        },
        ";": {
            [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                //append_css_rule(parser, self); //??????????????????????????????
                let scopes = self.scopes;
                if (scopes.ndeep === 0) {
                    scopes.children = [];
                    save_volatility(parser, self);
                }
            }
        },
        "}": {
            [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                let scopes = self.scopes;
                if (--scopes.ndeep === 0) {
                    let { children, css_rules } = scopes;
                    self.collect_text_node(parser);
                    let css_rule = {
                        type: "CSSRule",
                        children
                    };
                    css_rules.push(
                        css_rule
                    );
                    scopes.children = [];
                    save_volatility(parser, self);
                }
            }
        },
        "<": {
            [MARKS.NEXT](parser: Parser, self: Record<string, any>) {
                if (self.scopes.ndeep > 0) {
                    return;
                }
                let char = parser.input[parser.index];
                let { context, index, css_rules } = self.scopes;
                if (char === "/") {
                    parser.index -= 1;
                    //append_css_rule(parser, self);//??????????????????????????????
                    parser.parseCustom(
                        parser.SYNTAX_TREE,
                        context,
                        index,
                        function (node: Node) { return node.type === "ClosingTag" }
                    );
                    return css_rules;
                }
            }
        },
        [MARKS.EOF]: {
            [MARKS.END](parser: Parser, self: Record<string, any>) {
                //append_css_rule(parser, self);//??????????????????????????????
                return self.scopes.css_rules;
            }
        }
    },
    scanner: _Scanner(true),
    scopes: null,
    parse(parser: Parser, context: Context, index: number) {
        let _scopes = this.scopes;
        this.scopes = {
            parser,
            context,
            index,
            ndeep: 0,
            text: "",
            children: [],
            css_rules: [],
            cursor: parser.index,
            start: parser.index,
            line_number: parser.line_number,
            line_start: parser.line_start
        }
        let res = this.scanner(parser);
        this.scopes = _scopes;
        return res;
    }
}

let OpeningTag = {
    collector: {
        type: _Mark("OpeningTag"),
        name: _Pattern("TagPunctuator", "<").pipe(
            parse_tag.bind(
                null,
                function (token: Token) {
                    return token.type === "TagPunctuator" && (token.value === ">" || token.value === "/>")
                }
            )
        ).pipe(
            function (context: Context, token: Token, left: number) {
                let [collected, parser] = context;
                if (collected.value == "<>") {
                    collected.children = (
                        token.value !== "style"
                            ? inner_html
                            : css_rules
                    ).parse(parser, context, left + 1);
                }
                return token.value;
            }
        ),
    }
};
let ClosingTag = {
    collector: {
        type: _Mark("ClosingTag"),
        name: _Pattern("TagPunctuator", "</").pipe(
            parse_tag.bind(
                null,
                _Validate("TagPunctuator", ">")
            )
        ),
    }
}


Expressions["Element"] = {
    collector: [
        {
            openingTag: _Pattern("OpeningTag", "</>"),
            children: _Mark(function (context: Context, index: number) {
                let openingTag = context.getToken(index - 1);
                let children = openingTag.children;
                delete openingTag.children;
                return children
            }),
            closingTag: _Mark(null),
        },
        [
            ["openingTag", _Pattern("OpeningTag", "<>")],
            ["closingTag", _Pattern("ClosingTag", "</>")]
        ]
    ]
};
Statements["ExpressionStatement"].push({
    precedence: 0,
    collector: {
        expression: "Element",
    }

});
Statements[""].collector.push(["error", _Or("OpeningTag", "ClosingTag", "TagPunctuator")]);


//let is_binding = false;

const BindingExpression = {
    /*handler(context: Context) {
        let collected = context[CONTEXT.collected];
        if (is_binding) {
            let expression = collected.expression;
            expression.range = collected.range;
            expression.loc = collected.loc;
            return expression;
        }
        return collected;
    },*/
    collector: {
        expression: _Punctuator("\\(").walk(
            function (context: Context, index: number) {
                //is_binding = true;
                context[CONTEXT.parser].parseRangeAsExpression(context, index, is_right_parentheses);
                //is_binding = false;
            }
        ).pipe(
            function (context: Context, token: Token) {
                return token.content;
            }
        )
    }

}
const BindingGenerator = {
    /*handler(context: Context) {
        let collected = context[CONTEXT.collected];
        console.log(234234,collected);
        if (is_binding) {
            let expression = collected.expression;
            expression.range = collected.range;
            expression.loc = collected.loc;
            return expression;
        }
        return collected;
    },*/
    collector: {
        body: _Punctuator("\\{").walk(
            function (context: Context, index: number) {
                let parser = context[CONTEXT.parser];
                let _context = _Context(parser);
                _context.store(
                    CONTEXT.strict, context[CONTEXT.strict],
                    CONTEXT.inFunctionBody, true,
                    CONTEXT.allowYield, true
                );
                //context.wrap(CONTEXT.inFunctionBody, true);
                //is_binding = true;
                parser.parseRange(parser.SYNTAX_TREE, _context, index, is_right_braces);
                //is_binding = false;
            }
        ).pipe(
            function (context: Context, token: Token) {
                return token.content;
            }
        )
    }
}


PrimaryExpressions[""].push(OpeningTag, ClosingTag);
Expressions[""].push(OpeningTag, ClosingTag);
PrimaryExpressions["BindingExpression"] = Expressions["BindingExpression"] = BindingExpression;
PrimaryExpressions["BindingGenerator"] = Expressions["BindingGenerator"] = BindingGenerator;

const Attributes = {
    BindingGenerator,
    BindingExpression,
    "": Expressions[""],
    TemplateLiteral: Expressions.TemplateLiteral,
    FunctionExpression: Expressions.FunctionExpression,
    ArrowFunctionExpression: Expressions.ArrowFunctionExpression,
    ArrayExpression: Expressions.ArrayExpression,
    ObjectExpression: Expressions.ObjectExpression,
    MemberExpression: Expressions.MemberExpression,
    CallExpression: Expressions.CallExpression,
    ConditionalExpression: Expressions.ConditionalExpression,
    ..._SuccessCollector("Attribute"),
    Attribute: {
        validator(context: Context) {
            return (context[CONTEXT.right] - context[CONTEXT.left]) % 2 === 0;
        },
        precedence: 0,
        collector: [
            {
                name: _Or(
                    _Identifier(), _Keyword().pipe(
                        function (context: Context, token: Token) {
                            return reinterpretKeywordAsIdentifier(token)
                        }
                    )
                ),
                value: _Or(
                    _Series(
                        _NonCollecting(_Punctuator("=")),
                        _Option("[Expression]")
                    ),
                    _Mark(
                        null
                        /*function (context: Context, index: number) {
                            let collected = context[CONTEXT.collected];
                            let name = collected.name.name;
                            return {
                                "type": "Literal",
                                "value": name,
                                "raw": `\"${name}\"`
                            }
                        }*/
                    )
                )
            }
        ]
    }
}

const ATTRIBUTES_TREE = createMatchTree(Attributes);

async_getter.open();
let EXPRESSION_TREE: MatchTree = async_getter.EXPRESSION_TREE;
const SYNTAX_TREE = createMatchTree([
    Declarations,
    ModuleDeclarations,
    Statements
], EXPRESSION_TREE);





function scan_tag(tokenizer: Tokenizer, start: number) {
    let tag = tokenizer.nextIdentifier();
    if (tag) {
        //tag = reinterpretKeywordAsIdentifier(tag);
        let key = this.key;
        tag = {
            type: this.type,
            value: key,
            name: tag,
            raw: key + tokenizer._volatility,
            range: [start, tag.range[1]],
            loc: {
                start: {
                    line: tokenizer.line_number,
                    column: start - tokenizer.line_start
                },
                end: tag.loc.end
            }
        }
        tokenizer.curly_stack.unshift(key);
    } else {
        tokenizer.index -= 1;
        tag = tokenizer.match(tokenizer.PUNCTUATORS_TREE);
    }
    return tag;
}
function left_tag_filter(tokenizer: Tokenizer) {
    return !(/^<|<\/$/.test(tokenizer.curly_stack[0]));
}
const ELEMENT_DESCRIPTORS = [
    {
        key: "<", type: "TagPunctuator",
        scanner: scan_tag,
        filter: left_tag_filter
    },

]
let WEBX_PUNCTUATORS = PUNCTUATORS.concat(
    {
        key: ">", type: "TagPunctuator",
        filter(tokenizer: Tokenizer) {
            if (/^<|<\/$/.test(tokenizer.curly_stack[0])) {
                tokenizer.curly_stack.shift();
                return true;
            }
        }
    },
    {
        key: "/>", type: "TagPunctuator",
        filter(tokenizer: Tokenizer) {
            if (tokenizer.curly_stack[0] === "<") {
                tokenizer.curly_stack.shift();
                return true;
            }
        }
    },
    {
        key: "</", type: "TagPunctuator",
        scanner: scan_tag,
        filter: left_tag_filter
    },
    "\\(", "\\{"

);




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


console.timeEnd("init");

class WEBX extends Parser {
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
    private _inIdentifierStart = Parser.prototype.inIdentifierStart;
    private _inIdentifierPart = Parser.prototype.inIdentifierPart;
    private _is_primary_expr_start = Parser.prototype.is_primary_expr_start;
    is_primary_expr_start() {
        if (this.tokens.length) {
            return this.tokens[this.tokens.length - 1].type === "Element" || this._is_primary_expr_start();
        } else {
            return true;
        }
    }
    inIdentifierStart() {
        return this.match_tree_stack[0] === ATTRIBUTES_TREE && this.input[this.index] === "-"
            ? 1 : this._inIdentifierStart();
    }
    inIdentifierPart() {
        return this.match_tree_stack[0] === ATTRIBUTES_TREE && this.input[this.index] === "-"
            ? 1 : this._inIdentifierPart();
    }
}
export {
    isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem
}
export default WEBX;