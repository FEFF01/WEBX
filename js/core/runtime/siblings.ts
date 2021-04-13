


import {
    Subscriber, observable, sandbox, action, runInAction, runInSandbox, SANDOBX_OPTION, SUBSCRIBE_OPTION,
    transacts, TRANSACTS_OPTION, computed, watch, Observer
} from 'obb';

const ELEMENT_TO_LAST_SIBLING = new WeakMap();


abstract class Sibling {
    next: Sibling;

    nodes: Array<Node> = [];
    siblings: Array<Sibling> = [];

    constructor(public target: any, public prev?: Sibling) {
        if (prev || (this.prev = prev = ELEMENT_TO_LAST_SIBLING.get(target))) {
            if (prev.next) {
                prev.next.prev = this;
                this.next = prev.next;
            }
            prev.next = this;
        }
        ELEMENT_TO_LAST_SIBLING.set(target, this);
    }
    abstract appendTo(): void;
    abstract insertBefore(node: Node): void;
    abstract removeAllNodes(): void;
    abstract addNodes(val: any, bak_nodes?: Array<Node>): void;

    setNodes(val: any) {
        if (!this.target) {
            //console.log("warn", this);
            return;
        }
        let nodes = this.nodes;
        let has_bak = nodes.length;
        let bak_nodes = has_bak && nodes.slice();

        has_bak && this.removeAllNodes();
        this.addNodes(val, bak_nodes);
    }

    moveTo(to: number) {
        let from = this.index;
        let parent = this.parent;

        //console.log("moveTo", from, to);
        if (from === to) {
            return;
        } else if (!parent) {
            debugger;
        }
        let siblings = parent.siblings;

        siblings.splice(from, 1);

        let first_sibling = this.firstSibling();
        let last_sibling = this.lastSibling();
        let prev_sibling = first_sibling.prev;
        let next_sibling = last_sibling.next;

        if (prev_sibling) {
            prev_sibling.next = next_sibling;
        }
        if (next_sibling) {
            next_sibling.prev = prev_sibling;
        }

        let to_first_sibling = siblings[to] || parent.lastSibling().next;
        let first_node = to_first_sibling && to_first_sibling.firstNode();
        let to_prev_sibling = to_first_sibling ? to_first_sibling.prev : parent.lastSibling();

        first_node ? this.insertBefore(first_node) : this.appendTo();

        if (to_prev_sibling) {
            to_prev_sibling.next = first_sibling;
        }

        if (to_first_sibling) {
            to_first_sibling.prev = last_sibling;
        }
        first_sibling.prev = to_prev_sibling;
        last_sibling.next = to_first_sibling;

        to = Math.min(to, siblings.length);
        siblings.splice(to, 0, this);

        for (let i = Math.min(from, to), limit = Math.max(from, to); i <= limit; i++) {
            siblings[i].index = i;
        }

    }
    firstNode() {
        let nodes = this.nodes;
        return nodes.length ? nodes[0] : this.next && this.next.firstNode();
    }
    firstSibling(): Sibling {
        return this;
    }
    lastSibling(): Sibling {
        let last_sibling = this.siblings[this.siblings.length - 1];
        return last_sibling ? last_sibling.lastSibling() : this;
    }
    parent: Sibling;
    index: number;
    nextSibling(): Sibling {
        if (!this.target) {
            //console.log("warn", this);
            return this;
        }
        let new_sibling = new (this as any).constructor(this.target, this.lastSibling());

        let siblings = this.siblings;
        new_sibling.parent = this;
        new_sibling.index = siblings.length;
        siblings.push(new_sibling);

        return new_sibling;
    }
    removeAllSibling() {

        let siblings = this.siblings;
        for (let i = siblings.length - 1; i >= 0; i--) {
            this.removeSibling(siblings[i])
        }
    }

    removeSibling(sibling: Sibling) {
        let siblings = this.siblings;
        let index = sibling.index;
        if (siblings[index] === sibling) {
            let prev_sibling = sibling.prev;
            let last_sibling = sibling.lastSibling()
            let next_sibling = last_sibling.next;

            sibling.prev = null;
            last_sibling.next = null;
            if (prev_sibling) {
                prev_sibling.next = next_sibling;
            }
            if (next_sibling) {
                next_sibling.prev = prev_sibling;
            }
            sibling.setNodes(null);
            siblings.splice(index, 1);
            while (index < siblings.length) {
                siblings[index++].index -= 1;
            }
            sibling.removeAllSibling();
            sibling.target = null;
        } else {
            debugger;
        }
    }

    destory() {
        this.parent.removeSibling(this);
    }

}
class Children extends Sibling {
    target: Element

    appendTo() {
        for (let node of this.nodes) {
            this.target.appendChild(node);
        }
        for (let sibling of this.siblings) {
            sibling.appendTo();
        }
    }
    insertBefore = (referenceNode: Node) => {
        let parentNode = referenceNode.parentElement;

        for (let node of this.nodes) {
            parentNode.insertBefore(node, referenceNode);
        }
        for (let sibling of this.siblings) {
            sibling.insertBefore(referenceNode);
        }
    }
    removeAllNodes() {
        for (let node of this.nodes) {
            let parent = node.parentElement;
            parent && parent.removeChild(node);
        }
        this.nodes.length = 0;
    }
    addNodes(val: any, reuses?: Array<Node>) {
        if (val === undefined || val === null) {
            return;
        }

        let nodes = this.nodes;
        let node: Node;

        switch (true) {
            case val instanceof Node:
                nodes.push(node = val);
                break;
            case val instanceof Array:
                for (let item of val) {
                    this.addNodes(item, reuses)
                }
                return;
            default:
                /**
                 * 复用大部分在数据特征鉴定部分完成（nextEntrySibling autorun），
                 * 这里仅做对 TextNode 的简单处理
                 */
                if (reuses && reuses.length && reuses[0].nodeType === Node.TEXT_NODE) {
                    _webx.setText(node = reuses.shift(), val);
                } else {
                    node = _webx.createTextNode(val)
                }
                nodes.push(node);
                break;
        }

        let reference_node = this.next && this.next.firstNode();
        reference_node
            ? _webx.insertBefore(this.target, node, reference_node)
            : _webx.appendChild(this.target, node);
    }
}
class NodeList extends Sibling {
    target: Array<Node>;
    raw: Array<Node>;
    constructor(target: any, prev?: Sibling) {
        super(target, prev);
        this.raw = Observer.TO_RAW(target);
    }
    /*setNodes = sandbox(
        // target 可能是可观测对象，这里用 sanbox 防止当前操作所需数据被订阅
        super.setNodes.bind(this),
        SANDOBX_OPTION.PREVENT_COLLECT
    )*/
    setNodes(val: any) {
        /**
         * 基础功能使用 subscriber.option 比 sandbox 效率 更高一些
         * 现有的使用 sibling 管理节点执行环境中不存 Subscriber.PARENT 为空的情况
         */
        let subscriber = Subscriber.PARENT;
        let option = subscriber.option;
        subscriber.option = option | SUBSCRIBE_OPTION.PREVENT_COLLECT;
        super.setNodes(val);
        subscriber.option = option;
    }
    moveTo(to: number) {
        let subscriber = Subscriber.PARENT;
        let option = subscriber.option;
        subscriber.option = option | SUBSCRIBE_OPTION.PREVENT_COLLECT;
        super.moveTo(to);
        subscriber.option = option;
    }
    removeSibling(sibling: Sibling) {
        let subscriber = Subscriber.PARENT;
        let option = subscriber.option;
        subscriber.option = option | SUBSCRIBE_OPTION.PREVENT_COLLECT;
        super.removeSibling(sibling);
        subscriber.option = option;
    }
    appendTo() {
        let list = this.target;
        let raw_list = this.raw;    //使用 raw_list 是为了在一定不产生变更的操作中节省开销
        let nodes = this.nodes;
        if (nodes.length) {
            list.splice(raw_list.indexOf(nodes[0]), nodes.length);
            for (let node of nodes) {
                list.push(node);
            }
        }
        for (let sibling of this.siblings) {
            sibling.appendTo();
        }
    }
    insertBefore = (referenceNode: Node) => {
        let list = this.target;
        let raw_list = this.raw;
        let nodes = this.nodes;

        if (nodes.length) {
            let index = raw_list.indexOf(referenceNode);
            list.splice(raw_list.indexOf(nodes[0]), nodes.length);
            for (let node of nodes) {
                list.splice(index, 0, node);
            }
        }
        for (let sibling of this.siblings) {
            sibling.insertBefore(referenceNode);
        }
    }

    removeAllNodes() {
        let list = this.target;
        let raw_list = this.raw;
        for (let node of this.nodes) {
            list.splice(raw_list.indexOf(node), 1);
        }
        this.nodes.length = 0;
    }
    addNodes(val: any, reuses?: Array<Node>) {
        if (val === undefined || val === null) {
            return;
        }

        let nodes = this.nodes;
        let node: Node;

        switch (true) {
            case val instanceof Node:
                nodes.push(node = val);
                break;
            case val instanceof Array:
                for (let item of val) {
                    this.addNodes(item, reuses)
                }
                return;
            default:
                /**
                 * 复用大部分在数据特征鉴定部分完成（nextEntrySibling autorun），
                 * 这里仅做对 TextNode 的简单处理
                 */
                if (reuses && reuses.length && reuses[0].nodeType === Node.TEXT_NODE) {
                    _webx.setText(node = reuses.shift(), val);
                } else {
                    node = _webx.createTextNode(val)
                }
                nodes.push(node);
                break;
        }
        let reference_node = this.next && this.next.firstNode();
        let list = this.target;
        let raw_list = this.raw;
        if (reference_node) {
            list.splice(raw_list.indexOf(reference_node), 0, node);
        } else {
            list.push(node);
        }
    }
}
export {
    Sibling,
    Children,
    NodeList
}