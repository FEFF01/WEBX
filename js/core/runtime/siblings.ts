


import {
    Subscriber, observable, sandbox, action, runInAction, runInSandbox, SANDOBX_OPTION, SUBSCRIBE_OPTION,
    transacts, TRANSACTS_OPTION, computed, watch, Observer
} from '../../obb/js/obb';

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
    abstract setNodes(val: any): void;

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
function unfold(val: any) {
    let vessel = [];
    _walk(val);

    return vessel;

    function _walk(list: any) {
        if (list instanceof Array) {
            list.forEach(_walk);
        } else if (list !== null && list !== undefined) {
            vessel.push(list);
        }
    }
}


class Children extends Sibling {
    target: Element

    setNodes(val: any) {
        if (!this.target) {
            //console.log("warn", this);
            return;
        }
        let parent = this.target;
        let raw_nodes = unfold(val);
        let old_nodes = this.nodes;
        let new_nodes: Array<Node> = [];


        let reference_node = this.next && this.next.firstNode();

        raw_nodes.length ? _walk() : _final();

        this.nodes = new_nodes;

        function _final() {
            for (let i = new_nodes.length; i < old_nodes.length; i++) {
                let old_node = old_nodes[i];
                new_nodes.includes(old_node) || _webx.removeNode(old_node);
            }
        }
        function _walk() {
            let index = new_nodes.length;
            let new_node = raw_nodes.shift();
            let old_node = old_nodes[index];
            if (!(new_node instanceof Node)) {
                if (
                    index < old_nodes.length
                    && old_node.nodeType === Node.TEXT_NODE
                ) {
                    _webx.setText(old_node, new_node);
                    new_node = old_node;
                } else {
                    new_node = _webx.createTextNode(new_node);
                }
            }

            if (index < old_nodes.length) {
                if (
                    old_node !== new_node
                    && !raw_nodes.includes(old_node)
                    && !new_nodes.includes(old_node)
                ) {
                    _webx.removeNode(old_node);
                }
            }
            new_nodes.push(new_node);


            raw_nodes.length ? _walk() : _final();
            /**
             * 使用递归的处理和 previousSibling 对比等操作主要是维持原有 DOM 的稳定性
             * （减少由于列表变更导致 insert append 等操作造成的 DOM 刷新）
             */
            if (reference_node) {
                if (
                    reference_node.previousSibling !== new_node
                ) {
                    _webx.insertBefore(parent, new_node, reference_node);
                }
            } else {
                _webx.appendChild(parent, new_node);
            }
            reference_node = new_node;
        }
    }
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
}
class NodeList extends Sibling {
    target: Array<Node>;
    raw: Array<Node>;
    constructor(target: any, prev?: Sibling) {
        super(target, prev);
        this.raw = Observer.TO_RAW(target);
    }

    setNodes(val: any) {

        if (!this.target) {
            //console.log("warn", this);
            return;
        }
        let raw_nodes = unfold(val);
        let old_nodes = this.nodes;
        let new_nodes: Array<Node> = [];
        let old_node: Node;
        let new_node: Node;
        let cursor = 0;


        while (raw_nodes.length) {
            new_node = raw_nodes.shift();
            if (!(new_node instanceof Node)) {
                if (
                    cursor < old_nodes.length
                    && (old_node = old_nodes[cursor]).nodeType === Node.TEXT_NODE
                ) {
                    if (_webx.getText(old_node) != new_node) {
                        _webx.setText(old_node, new_node);
                    }
                    new_node = old_node;
                } else {
                    new_node = _webx.createTextNode(new_node);
                }
            }
            new_nodes.push(new_node);
            cursor += 1;
        }
        let list = this.target;
        let raw_list = this.raw;
        if (old_nodes.length) {
            list.splice(raw_list.indexOf(old_nodes[0]), old_nodes.length, ...new_nodes);
        } else {
            let reference_node = this.next && this.next.firstNode();
            if (reference_node) {
                list.splice(raw_list.indexOf(reference_node), 0, ...new_nodes);
            } else {
                list.push(...new_nodes);
            }
        }
        this.nodes = new_nodes;
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
            list.splice(raw_list.indexOf(nodes[0]), nodes.length);
            let index = raw_list.indexOf(referenceNode);
            list.splice(index, 0, ...nodes);
        }
        for (let sibling of this.siblings) {
            sibling.insertBefore(referenceNode);
        }
    }

    removeAllNodes() {
        let list = this.target;
        let raw_list = this.raw;
        let nodes = this.nodes;
        if (nodes.length) {
            list.splice(raw_list.indexOf(nodes[0]), nodes.length);
            nodes.length = 0;
        }
    }
}
export {
    Sibling,
    Children,
    NodeList
}