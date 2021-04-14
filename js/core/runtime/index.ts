
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
function nextNodes(sibling: Sibling, els: Node | any) {
    return sibling.nextSibling().setNodes(els);
}

function nextChild(el: Element, getter?: Function | any, is_reactive?: boolean | number, passive?: boolean) {
    let sibling = el instanceof Array ? new NodeList(el) : new Children(el);
    if (getter !== undefined) {
        is_reactive
            ? autorun(function () {
                sibling.setNodes(getter());
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
    node.data = text;
}
function addEventListener(el: Element, ...args: [string, (e: Event) => void, any?]) {
    el.addEventListener(...args);
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


window._webx = {
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
    appendChild,
    insertBefore,
    createElement,
    createTextNode
};

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
    appendChild,
    insertBefore,
    createElement,
    createTextNode
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