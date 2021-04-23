
import {
    Subscriber, observable, sandbox, action, runInAction, runInSandbox, SANDOBX_OPTION, SUBSCRIBE_OPTION,
    transacts, TRANSACTS_OPTION, computed, watch, Observer
} from '../../obb/js/obb';

import {
    Sibling,
    Children,
    NodeList
} from './siblings'
import {
    entryStatement,
    nextIfSibling,
    nextEntrySibling
} from './polyfill'
import { ELEMENT_DESCRIPTORS } from '../parser/html-extends';

declare global {
    const _webx: any;
}


function prevent(fn: Function) {
    return sandbox(fn, SANDOBX_OPTION.PREVENT_COLLECT)();
}

function autorun(fn: Function, passive?: boolean) {
    let subscriber = new Subscriber(
        fn,
        passive ? SUBSCRIBE_OPTION.PREVENT_COLLECT : SUBSCRIBE_OPTION.DEFAULT
    );
    return subscriber.mount().res;
}
function removeAllSibling(sibling: Sibling) {
    return sibling.removeAllSibling();
}
function nextSibling(sibling: Sibling) {
    return sibling.nextSibling();
}
function nextNodes(sibling: Sibling, els: Node | any, is_reactive: boolean) {
    let next_sibling = sibling.nextSibling();
    if (!is_reactive) {
        next_sibling.setNodes(els);
        return;
    }
    autorun(function () {
        let res = els();
        if (res instanceof Array) {
            autorun(function () {
                next_sibling.setNodes(res);
            });
        } else {
            next_sibling.setNodes(res);
        }
    }, true);
}

function nextChild(el: Element, getter?: Function | any, is_reactive?: boolean | number, passive?: boolean) {
    let sibling = el instanceof Array ? new NodeList(el) : new Children(el);
    if (getter !== undefined) {
        is_reactive
            ? autorun(function () {
                let res = getter();
                if (res instanceof Array) {
                    autorun(function () {
                        sibling.setNodes(res);
                    })
                } else {
                    sibling.setNodes(res);
                }
            }, passive)
            : sibling.setNodes(getter);
    }
    return sibling;

}


function setAttribute(el: Element, name: string, value: any, literal?: boolean) {
    //console.log("_webx_set_attribute:", { el, name, value, literal });
    !literal ? el.setAttribute(name, value) : (el[name] = value);
}
function setText(node: Text, text: string) {
    //console.log("setText:", { node, text });
    // CharacterData
    node.data !== text && (node.data = text);
}
function addEventListener(el: Element, ...args: [string, (e: Event) => void, any?]) {
    el.addEventListener(...args);
}
function removeNode(child: Node) {
    let el = child.parentElement;
    el && el.removeChild(child);
}
function appendChild(el: Element, child: Node) {
    el.appendChild(child);
}
function insertBefore(parent: Element, target: Node, ref: Element) {
    parent.insertBefore(target, ref);
}
function createElement(tagName: string) {
    //console.log("_webx_create_element:", { tagName });
    return document.createElement(tagName);
}
function createTextNode(data: any) {
    //console.log("_webx_create_text_node:", { data });
    return document.createTextNode(data);
}
function setNodes(sibling: Sibling, els: Node | any) {
    sibling.setNodes(els);
}

function createComponent(component: Function, gen_props: Function, gen_children: Function) {
    /**
     * 避免构造 children 的过程中订阅了 props.children 的过程发生
     * props.children.length 至 n 的 n 次回调
     * 使用 action 后 component 首次收到空的 props.children 
     * 后续 children 构造完毕 action 方法结束 component 
     * 内的 props.children 订阅得到一次更新
     */
    gen_children && (gen_children = action(gen_children));

    switch (true) {
        case gen_props && gen_children && true:
            return function () {
                let props = observable({
                    children: []
                });
                gen_props(props);
                let res = component(props);
                if (res === null || res === undefined) {
                    return;
                }
                gen_children(props.children);
                return res;
            }
        case gen_children && true:
            return function () {
                let props = observable({
                    children: []
                });
                let res = component(props);
                if (res === null || res === undefined) {
                    return;
                }
                gen_children(props.children);
                return res;
            }
        case gen_props && true:
            return function () {
                let props = observable({});
                gen_props(props);
                let res = component(props);
                return res;
            }
        default:
            return function () {
                return component(observable({}));
            }
    }

}

let webx = {
    prevent,
    autorun,
    action,
    runInAction,
    observable,
    nextChild,
    nextSibling,
    nextNodes,
    setNodes,
    nextIfSibling,
    nextEntrySibling,
    entryStatement,
    removeAllSibling,
    setAttribute,
    setText,
    addEventListener,
    removeNode,
    appendChild,
    insertBefore,
    createElement,
    createTextNode,
    createComponent
};

(typeof window === "object" ? window : global as any)._webx = webx;
export default webx;
export {
    prevent,
    autorun,
    action,
    runInAction,
    observable,
    nextChild,
    nextSibling,
    nextNodes,
    setNodes,
    nextIfSibling,
    nextEntrySibling,
    entryStatement,
    removeAllSibling,
    setAttribute,
    setText,
    addEventListener,
    removeNode,
    appendChild,
    insertBefore,
    createElement,
    createTextNode,
    createComponent
};

/*
function validate(sib: Sibling) {
    let siblings = sib.siblings;
    for (let s of siblings) {
        if (sib.next !== s) {
            debugger;
        }
        if (s.prev !== sib) {
            debugger;
        }
        sib = validate(s);
    }
    return sib
}*/