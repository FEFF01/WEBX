
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
import Tokenizer from '../../Dison/js/tokenizer';

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
import Statements from '../../Dison/js/syntax/statement'


import {
    SYNTAX_TREE,
    EXPRESSION_TREE,
    isExpression
} from './index'

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


function collect_next_syntax(
    match_tree = EXPRESSION_TREE,
    test = function (node: Node) { return true },
    offset = -2
) {
    return function (parser: Parser, self: Record<string, any>) {
        parser.index += offset;
        self.collect_text_node(parser);
        let { scopes } = self;
        let { context, index, children } = scopes;
        let stack_length = parser.curly_stack.length;
        let node = parser.parseCustom(
            match_tree,
            context,
            index,
            test
        );
        if (node) {
            context.tokens.length = index;
            parser.index = node.range[1];
            parser.line_number = node.loc.end.line;
            parser.line_start = parser.index - node.loc.end.column;
            parser.curly_stack.length = stack_length;
            /*context.tokens.splice(index, 1);*/
            children.push(node);
            scopes.cursor = parser.index;
            save_volatility(parser, self);
            return MARKS.RESET;
        } else {
            parser.index -= offset;
            debugger;
        }
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
                //debugger;
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






/*
const RunInActionExpression = {
    collector: {
        ...RunInActionStatement.collector,
        _prev: _Mark()
    }
}*/







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

Statements[""].collector.push(["error", _Or("OpeningTag", "ClosingTag", "TagPunctuator")]);

Statements["ExpressionStatement"].push({
    precedence: 0,
    collector: {
        expression: "Element",
    }
});


PrimaryExpressions[""].push(OpeningTag, ClosingTag);
Expressions[""].push(OpeningTag, ClosingTag);

const Attributes = {
    ActionExpression: Expressions.ActionExpression,
    BindingExpression: Expressions.BindingExpression,
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
                    _Mark(null)
                )
            }
        ]
    }
}

const ATTRIBUTES_TREE = createMatchTree(Attributes);

const ELEMENT_DESCRIPTORS = [
    {
        key: "<", type: "TagPunctuator",
        scanner: scan_tag,
        filter: left_tag_filter
    },
]

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
    if ((/^<|<\/$/.test(tokenizer.curly_stack[0]))) {
        debugger;
    }
    return !(/^<|<\/$/.test(tokenizer.curly_stack[0]));
}

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
    "@(", "@{", "->", "@:", "@"
);

let css_rules: any;
let inner_html: any;


async_getter.get("webx_inited", function () {
    css_rules = {
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
            ["("]: {
                ["("]: {
                    [MARKS.NEXT]: collect_next_syntax(EXPRESSION_TREE, isExpression)
                }
            },
            "@": {
                "{": {
                    [MARKS.NEXT]: collect_next_syntax(SYNTAX_TREE)
                },
                "(": {
                    [MARKS.NEXT]: collect_next_syntax()
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
                    //append_css_rule(parser, self); //不支持此规则动态绑定
                    let scopes = self.scopes;
                    if (scopes.ndeep === 0) {
                        scopes.children = [];
                        save_volatility(parser, self);
                    }
                }
            },
            "{": {
                [MARKS.ATTACH](parser: Parser, self: Record<string, any>) {
                    /*let next_char = parser.input[parser.index];
                    if (next_char !== "{") {*/
                    self.scopes.ndeep += 1;
                    //}
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
                        //append_css_rule(parser, self);//不支持此规则动态绑定
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
                    //append_css_rule(parser, self);//不支持此规则动态绑定
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

    inner_html = {
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

            ["("]: {
                ["("]: {
                    [MARKS.NEXT]: collect_next_syntax(EXPRESSION_TREE, isExpression)
                }
            },
            "@": {
                ":": {
                    [MARKS.NEXT]: collect_next_syntax(SYNTAX_TREE)
                },
                "{": {
                    [MARKS.NEXT]: collect_next_syntax(SYNTAX_TREE)
                },
                "(": {
                    [MARKS.NEXT]: collect_next_syntax()
                }
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

});



export {
    ATTRIBUTES_TREE,
    WEBX_PUNCTUATORS,
    ELEMENT_DESCRIPTORS
}