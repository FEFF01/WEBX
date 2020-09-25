
import Parser from './parser';

import './interfaces';
let parser = new Parser();

export var scoped_runtime = parser.parse(//便于作用域标识符压缩
    `
        var _webx = window._webx,{
            throttle: _webx_throttle,
            reactive: _webx_reactive,
            call: _webx_call,
            nextTick: _webx_next_tick,
            assignAttribute: _webx_assign_attribute,
            setAttribute: _webx_set_attribute,
            appendChild: _webx_append_child,
            createElement: _webx_create_element,
            createTextNode: _webx_create_text_node,
            appendResult: _webx_append_result,
            appendTextNode: _webx_append_text_node
        } = _webx;
    `
).body[0]

export default parser.parse(
    "(" + (function () {
        window._webx = {
            throttle,
            reactive,
            call,
            nextTick,
            assignAttribute,
            setAttribute,
            appendChild,
            createElement,
            createTextNode,
            appendResult,
            appendTextNode
        };
        function throttle(callback) {
            var next_tick = 0;
            return function () {
                if (!next_tick) {
                    next_tick = nextTick(
                        function () {
                            next_tick = 0;
                            callback();
                        }
                    );
                }
            }
        }
        function reactive(target, callback) {
            target.push(callback);
            return callback();
        }
        function call() {
            for (var i = 0; i < arguments.length; i++) {
                for (var callback of arguments[i]) {
                    callback();
                }
            }
        }
        function nextTick(callback) {
            return window.setTimeout(callback);
        }
        function assignAttribute(el, name, value) {
            el[name] = value;
        }
        function setAttribute(el, name, value) {
            el.setAttribute(name, value);
        }
        function appendChild(el, child) {
            el.appendChild(child);
        }
        function createElement(tagName) {
            console.log("_webx_create_element:", { tagName });
            return document.createElement(tagName);
        }
        function createTextNode(data) {
            console.log("_webx_create_text_node:", { data });
            return document.createTextNode(data);
        }
        function appendResult(el, getter) {
            var node = get_node();
            var is_text_node = false;
            appendChild(el, node);
            return throttle(function () {
                var new_child = get_node();
                if (new_child) {
                    el.replaceChild(new_child, node);
                    node = new_child;
                }
            });
            function get_node() {
                var result = getter();
                if (!(result instanceof Element)) {
                    if (result !== undefined) {
                        if (is_text_node) {
                            node.data = result;
                            return;
                        } else {
                            is_text_node = true;
                            return createTextNode(result);
                        }
                    } else {
                        result = document.createComment("");
                    }
                }
                is_text_node = false;
                return result;
            }
        }
        function appendTextNode(el, getter) {
            var node = createTextNode(getter());
            appendChild(el, node);
            return throttle(function () {
                node.data = getter()
            });
        }
    }).toString() + ")()"
).body[0]