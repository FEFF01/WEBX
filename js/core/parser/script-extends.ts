
import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS
} from '../../Dison/js/interfaces';

import { createSearchTree, _Scanner } from '../../Dison/js/lexical/head'

import {
    EXPRESSION_OR_VALIDATE_STRICT_RESERVED_WORDS_PATTERN,
    EXPRESSION_OR_THROW_STRICT_RESERVED_WORDS_PATTERN,
    TOPLEVEL_ITEM_PATTERN, parse_next_statement, NODES
} from '../../Dison/js/syntax/head'

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

import Expressions, { ArrayElements, PARAMS_PATTERN, FUNCTION_BODY_PATTERN, PrimaryExpressions } from '../../Dison/js/syntax/expression'
import Declarations from '../../Dison/js/syntax/declaration'
import Statements from '../../Dison/js/syntax/statement'
import ModuleDeclarations from '../../Dison/js/syntax/module_declaration'


const _Declarations = {
    BindingDeclaration: {
        collector: {
            value: _Mark("@:"),
            declaration: _Series(
                _NonCollecting("Punctuator @:"),
                "VariableDeclaration"
            )
        }
    },
    ActionDeclaration: {
        validator: [
            function () {
                return false;
            },
            null
        ],
        collector: [
            {
                _prev: _NonCapturing(TOPLEVEL_ITEM_PATTERN),
                __: _NonCollecting(
                    _Series(
                        _Punctuator("@"),
                        _Identifier("action")
                    )
                )
            },
            [
                "action",
                _Pattern("FunctionExpression").pipe(
                    function (context: Context, token: Token, left: number) {
                        if (!token.id) {
                            context[CONTEXT.parser].err(token);
                        }
                    }
                )
            ]
        ]
    }
};
const _Statements = {
    EntryStatement: {
        validator: [
            parse_next_statement,
            null
        ],
        collector: [
            {
                object: EXPRESSION_OR_THROW_STRICT_RESERVED_WORDS_PATTERN,
                _: _NonCollecting("Punctuator ->"),
                params: PARAMS_PATTERN
            },
            ["body", _Or(FUNCTION_BODY_PATTERN, "[Statement]")]
        ]
    },
    RunInActionStatement: {
        collector: {
            value: _Mark("@action{}"),
            _prev: _NonCapturing(TOPLEVEL_ITEM_PATTERN),
            action: _Series(
                _NonCollecting(
                    _Series(
                        _Punctuator("@"),
                        _Identifier("action")
                    )
                ),
                _Punctuator("{").pipe(
                    function (context: Context, token: Token, left: number) {
                        return rangeBlockToStatement(
                            context[CONTEXT.parser].parseRangeAsBlock(context, left)
                        );
                    }
                )
            )
        }
    },
    PreventStatement: {
        collector: {
            _prev: _NonCapturing(TOPLEVEL_ITEM_PATTERN),
            value: _Mark("@prevent"),
            statement: _Series(
                _NonCollecting("Punctuator @"),
                _NonCollecting("Identifier prevent"),
                _Punctuator("{").pipe(
                    function (context: Context, token: Token, left: number) {
                        return rangeBlockToStatement(
                            context[CONTEXT.parser].parseRangeAsBlock(context, left),
                            1
                        );
                    }
                )
            )
        }
    },
    BindingStatement: [

        {
            collector: {
                _prev: _NonCapturing(TOPLEVEL_ITEM_PATTERN),
                value: _Mark("@{}"),
                statement: _Punctuator("@{").pipe(
                    function (context: Context, token: Token, left: number) {
                        return rangeBlockToStatement(
                            context[CONTEXT.parser].parseRangeAsBlock(context, left),
                            1
                        );
                    }
                )
            }
        }, {
            collector: {
                value: _Mark("@:"),
                statement: _Series(
                    _NonCollecting("Punctuator @:"),
                    "[Statement]"
                )
            }
        }, {
            collector: {
                value: _Mark("@autorun"),
                statement: _Series(
                    _NonCollecting("Punctuator @"),
                    _NonCollecting("Identifier autorun"),
                    _Punctuator("{").pipe(
                        function (context: Context, token: Token, left: number) {
                            return rangeBlockToStatement(
                                context[CONTEXT.parser].parseRangeAsBlock(context, left),
                                1
                            );
                        }
                    )
                )
            }
        }
    ]
};

const _Expressions = {
    BindingExpression: {
        collector: [
            {
                value: _Mark("@{}"),
                expression: _Punctuator("@{").pipe(
                    function (context: Context, token: Token, left: number) {
                        return context[CONTEXT.parser].parseRangeAsExpression(
                            context, left, is_right_braces
                        );
                    }
                )
            },
            {
                value: _Mark("@()"),
                expression: _Punctuator("@(").pipe(
                    function (context: Context, token: Token, left: number) {
                        return context[CONTEXT.parser].parseRangeAsExpression(
                            context, left, is_right_parentheses
                        );
                    }
                )
            }
        ]

    },
    ActionExpression: {
        validator: [
            function () {
                /**
                 * 占位作用，让 action 不会被用作其他用途收集
                 *  (在 html attribute 中的 action 可能会被当做单独的 attribute 收集)
                 */
                return false;
            },
            null
        ],
        collector: [
            {
                _prev: _NonCollecting(
                    _Series(
                        _Punctuator("@"),
                        _Identifier("action")
                    )
                ),
            },
            ["action", "FunctionExpression"]
        ]
    },
    PreventExpression: {
        collector: {
            value: _Mark("@prevent"),
            expression: _Series(
                _NonCollecting("Punctuator @"),
                _NonCollecting("Identifier prevent"),
                _Or(
                    _Punctuator("{").pipe(
                        function (context: Context, token: Token, left: number) {
                            return context[CONTEXT.parser].parseRangeAsExpression(
                                context, left, is_right_braces
                            );
                        }
                    ),
                    _Punctuator("(").pipe(
                        function (context: Context, token: Token, left: number) {
                            return context[CONTEXT.parser].parseRangeAsExpression(
                                context, left, is_right_parentheses
                            );
                        }
                    )
                )
            )
        }
    }


}

Object.assign(Declarations, _Declarations);

Object.assign(Statements, _Statements);

Object.assign(PrimaryExpressions, _Expressions);
Object.assign(Expressions, _Expressions);

Expressions["BinaryExpression"].filter = function (context: Context, left: number) {
    /**
     * 防止 Element 表达式发生二元结合，而且 Element 的二元运算没有意义
     * 例如 : @:if(show)<div></div><!-- ... -->
     *      "@:"为从html语境插入一条js语句的声明， 该语句在 "</div>" 这个位置已结束
     *      Element 的逻辑运算是被允许的 例如 : @:show&&<div></div>
     *      当然 "@:<div></div>&&333" 这样的逻辑运算也是被允许的，不过这样没有意义，只是不以太多直观的感觉冲突
     */
    let node = context.tokens[left];
    return node.type !== "Element";
}

/**
 * 使 ArrayExpression 的 Element 间支持不用逗号连接
 */
ArrayElements.Success.collector.push([
    ["content", "Element"],
    ["_", _Mark()]
])


function rangeBlockToStatement(block: Node, offset: number = 0) {
    let node = new NODES.BlockStatement();
    let { range, loc } = block;
    range[0] += offset;
    loc.start.column += offset;
    node.body = block.content;
    node.range = range;
    node.loc = loc;
    return node;
}