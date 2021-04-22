import { Node } from '../../Dison/js/interfaces';
declare const enum SCOPE_STATUS {
    REACTIVE = 1,
    AUTORUN = 2
}
declare const enum OBSERVER_MARK {
    NEED_PROXY = 1,
    HAS_ASSIGN = 2,
    NEED_REDECLARE = 4
}
declare const enum PROXY_NODE {
    FUNCTION_DECLARES = "FUNCTION_DECLARES",
    FUNCTION_SCOPED_STACK = "FUNCTION_SCOPED_STACK",
    BLOCK_DECLARES = "BLOCK_DECLARES",
    BLOCK_SCOPED_STACK = "BLOCK_SCOPED_STACK",
    SUBSCOPES = "SUBSCOPES",
    OBSERVER_MARKS = "OBSERVER_STATE",
    OBSERVER_MAP = "OBSERVER_MAP",
    REFERENCE_RECORD = "REFERENCE_RECORD",
    ASSIGN_RECORD = "ASSIGN_RECORD",
    NEXT_EPOCH = "NEXT_EPOCH",
    NEPOCH = "NEPOCH",
    SCOPE_STATUS = "SCOPE_STATUS",
    DEPTH = "DEPTH"
}
declare function _ProxyNode(node: Node, parent?: ProxyNode, prop?: string | number): ProxyNode;
declare class ProxyNode {
    node: any;
    parent?: ProxyNode;
    static isExternalDeclaration: (id: string) => boolean;
    [PROXY_NODE.FUNCTION_DECLARES]: Record<string, any>;
    [PROXY_NODE.FUNCTION_SCOPED_STACK]: Array<ProxyNode>;
    [PROXY_NODE.BLOCK_DECLARES]: Record<string, any>;
    [PROXY_NODE.BLOCK_SCOPED_STACK]: Array<ProxyNode>;
    [PROXY_NODE.SCOPE_STATUS]: SCOPE_STATUS;
    [PROXY_NODE.DEPTH]: number;
    [PROXY_NODE.NEXT_EPOCH]: Array<[Node, ProxyNode, string | number]>;
    [PROXY_NODE.REFERENCE_RECORD]: Record<string, Array<[Node, string | number, ProxyNode]>>;
    [PROXY_NODE.OBSERVER_MAP]: Record<string, Node>;
    [PROXY_NODE.OBSERVER_MARKS]: Record<string, OBSERVER_MARK>;
    [props: string]: ProxyNode | any;
    constructor(node: any, parent?: ProxyNode, prop?: string | number);
}
export { ProxyNode, PROXY_NODE, _ProxyNode, SCOPE_STATUS, OBSERVER_MARK };
