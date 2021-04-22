import {
    Token, Node, Context, CONTEXT, MatchTree, Validate, MARKS, SourceLocation, Position
} from '../../Dison/js/interfaces'

import { ProxyNode } from './proxy'
import { IDENTIFIER } from './astgen'

function convert(ast: Node, external_declarations?: Array<string>) {
    let used_declarators: Set<string>;
    if (external_declarations) {
        used_declarators = new Set();
        ProxyNode.isExternalDeclaration = function (id: string) {
            if (external_declarations.includes(id)) {
                used_declarators.add(id);
                return true;
            }
        }
    }
    let res = new ProxyNode(ast).node;
    ProxyNode.isExternalDeclaration = null;
    return external_declarations ? [res, Array.from(used_declarators)] : res;
}
let id = IDENTIFIER("_webx");

const runtime = {
    type: "VariableDeclaration",
    kind: "var",
    declarations: [
        {
            type: "VariableDeclarator",
            id,
            init: {
                type: "MemberExpression",
                object: {
                    type: "Identifier",
                    name: "window"
                },
                property: id,
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_t"
            },
            init: null
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_set_attribute"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "setAttribute"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_add_event_listener"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "addEventListener"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_set_nodes"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "setNodes"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_next_nodes"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "nextNodes"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_create_element"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "createElement"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_create_text_node"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "createTextNode"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_run_in_action"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "runInAction"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_autorun"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "autorun"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_action"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "action"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_prevent_collect"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "prevent"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_observable"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "observable"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_next_child"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "nextChild"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_next_sibling"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "nextSibling"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_next_if_sibling"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "nextIfSibling"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_next_entry_sibling"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "nextEntrySibling"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_remove_all_sibling"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "removeAllSibling"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_entry_statement"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "entryStatement"
                },
                computed: false
            }
        },
        {
            type: "VariableDeclarator",
            id: {
                type: "Identifier",
                name: "_webx_create_component"
            },
            init: {
                type: "MemberExpression",
                object: id,
                property: {
                    type: "Identifier",
                    name: "createComponent"
                },
                computed: false
            }
        }
    ]
};


export default class Converter {
    convert = convert
};
export {
    convert, runtime
}







/*
export const runtime = `
var _webx = window._webx,
_webx_t,
_webx_set_attribute = _webx.setAttribute,
_webx_add_event_listener = _webx.addEventListener,
_webx_set_nodes = _webx.setNodes,
_webx_next_nodes = _webx.nextNodes,
_webx_create_element = _webx.createElement,
_webx_create_text_node = _webx.createTextNode,

_webx_run_in_action = _webx.runInAction,
_webx_autorun = _webx.autorun,
_webx_action = _webx.action,
_webx_prevent_collect = _webx.prevent,
_webx_observable = _webx.observable,
_webx_next_child = _webx.nextChild,
_webx_next_sibling = _webx.nextSibling,
_webx_next_if_sibling = _webx.nextIfSibling,
_webx_next_entry_sibling = _webx.nextEntrySibling,
_webx_remove_all_sibling = _webx.removeAllSibling,

_webx_entry_statement = _webx.entryStatement;
`;*/
