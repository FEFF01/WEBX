


import {
    Routing,
    getUrl,
    getParentRouting,
    addRouteChangeListener,
    removeRouteChangeListener
} from './utils'
import {
    ILinkOptions, IRouterOptions
} from './interface'


declare var _obb: any, _webx: any;

const { Subscriber, action, autorun, observable, computed, runInAction } = _obb;


function Router(options: IRouterOptions) {
    let parent = Subscriber.PARENT;
    let routing: Routing;
    let match: any = null;

    let subscriber = new Subscriber(function () {
        if (!routing) {
            routing = new Routing(options, parent);
        }
        routing.update();
        update();
    });
    subscriber.mount();

    if (!match) {
        function rerender() {
            parent.parent !== undefined && parent.update();
        }
        subscriber.once("unmount", function () {
            removeRouteChangeListener(rerender);
        });
        addRouteChangeListener(rerender);
        return;
    }
    // 使 component 的变更能引起路由重新渲染
    let component = computed(function () { return options.component }, parent)();
    function update() {
        let _match = routing.match();
        if (match !== null && !match !== !_match) {
            parent.parent !== undefined && parent.update();
        } else {
            options.match = _match;
            match = _match;
        }
    }

    addRouteChangeListener(update);
    subscriber.once("unmount", function () {
        removeRouteChangeListener(update);
    });
    return component ? component(options) : options.children;

}



const EXCLUDE_KEYS = ["mode", "tag", "children", "to", "action"];


function _Link(options: ILinkOptions, is_relative: boolean) {
    let tag_name: string;
    let parent = Subscriber.PARENT;
    let routing = is_relative && getParentRouting(parent);
    let el: Element = computed(function () {
        tag_name = options.tag || "a";
        return _webx.createElement(tag_name);
    }, parent)();

    _webx.addEventListener(el, "click", function (e: Event) {
        e.preventDefault();
        let href = location.href;
        let url = getUrl(options, routing);
        switch (options.action) {
            case "back":
                history.back();
                if (options.to) {
                    setTimeout(function () {
                        if (href !== url) {
                            history.replaceState(null, null, url);
                        }
                    }, 6);
                }
                break;
            case "replace":
                if (!is_relative || href !== url) {
                    history.replaceState(null, null, url);
                }
                break;
            case "append":
            default:
                if (!is_relative || href !== url) {
                    history.pushState(null, null, url);
                }
                break;
        }
    });

    if (
        /^a$/i.test(tag_name)
        && options.hasOwnProperty("to")
        && !options.hasOwnProperty("href")
    ) {
        function pathChange() {
            (el as HTMLLinkElement).href = getUrl(options, routing);
        }
        let subscriber = new Subscriber(pathChange);
        subscriber.mount();

        addRouteChangeListener(pathChange);
        subscriber.once("unmount", function () {
            removeRouteChangeListener(pathChange)
        })
    }

    for (let key in options) {
        if (EXCLUDE_KEYS.includes(key)) {
            continue;
        }
        let is_literal = /^(on[^_-]*)|(value|id|checked)$/.test(key);

        autorun(function () {
            _webx.setAttribute(el, key, options[key], is_literal);
        });
    }
    autorun(function () {
        let children = el.childNodes;
        let new_children = options.children;
        let index = 0;
        if (new_children) {
            for (; index < new_children.length; index++) {

                let new_child = new_children[index];
                let current = children[index]

                if (children.length <= index) {
                    _webx.appendChild(el, new_child);
                } else if (current !== new_child) {
                    _webx.insertBefore(el, new_child, current);
                    if (!new_children.includes(current)) {
                        _webx.removeNode(current);
                    }
                }
            }
        }
        while (children.length > index) {
            el.removeChild(children[index]);
        }
    });
    return el;

}
function Link(options: ILinkOptions) {
    return _Link(options, false);
}
function RouterLink(options: ILinkOptions) {
    return _Link(options, true);
}

export { Router, RouterLink, Link }
export default Router;
