

import {
    ILinkOptions, IRouterOptions
} from './interface'


declare var _obb: any, _webx: any;

const { runInAction, action } = _obb;

const { pathToRegexp } = require('path-to-regexp');
const SUBSCRIBER_TO_ROUTING = new WeakMap();


let is_listening = false;

const dispatch = action(function () {
    // 保证响应期间的 STATE_CHANGE_LISTENERS 变更不会影响当前进程
    for (let callback of Array.from(ROUTE_CHANGE_LISTENERS)) {
        callback();
    }
});

for (let prop of ["pushState", "replaceState"]) {
    let original = history[prop];
    history[prop] = function () {
        original.apply(history, arguments);
        is_listening && dispatch();
    }
}

const ROUTE_CHANGE_LISTENERS: Set<Function> = new Set();;

function addRouteChangeListener(callback: () => void) {

    ROUTE_CHANGE_LISTENERS.add(callback);
    
    if (!is_listening) {
        addEventListener("hashchange", dispatch);
        addEventListener("popstate", dispatch);
        is_listening = true;
    }
}
function removeRouteChangeListener(callback: () => void) {

    ROUTE_CHANGE_LISTENERS.delete(callback);

    if (!ROUTE_CHANGE_LISTENERS.size) {
        is_listening = false;
        removeEventListener("hashchange", dispatch);
        removeEventListener("popstate", dispatch);
    }
}


function join(original: string, target: string) {
    if (/^[^#]*\:/.test(target)) {
        return target;
    }
    let res = /^\s*\/+/.exec(target);
    if (res) {
        target = target.slice(res[0].length);
        return (target && "/") + target;
    }
    res = /^(\s*\.\/+)+/.exec(target);
    original = original.replace(/\/*$/, "");
    if (res) {
        target = target.slice(res[0].length);
    }
    while ((res = /^\s*\.\.\/+(\s*\.\/+)*/.exec(target))) {
        target = target.slice(res[0].length);
        original = original.replace(/\/+[^\/]*$/, "");
    }
    return original + (target && "/") + target;

}

function getNormalizelocation() {
    let { origin, pathname, hash, protocol } = location;
    if (protocol === "blob:") {
        pathname = pathname.slice(origin.length);
        origin = protocol + origin;
    }
    return { origin, pathname, hash }
}

function getUrl(options: ILinkOptions, routing?: Routing) {
    let mode = options.mode || (routing ? routing.mode : "hash");
    let href = options.to;
    let { origin, pathname, hash } = getNormalizelocation();

    if (routing) {
        hash = routing.hash;
        pathname = routing.path;
    }

    if (href) {
        if (mode === "hash") {
            hash = join(hash.replace(/^#+/, ""), href);
            hash && (hash = "#" + hash);
        } else {
            pathname = join(pathname, href);
            let match = /#+\/*([\s\S]*)$/.exec(pathname);
            if (match) {
                pathname = pathname.slice(0, -match[0].length);
                hash = (match[1] && "#/") + match[1];
            }
        }
    }
    return origin + pathname + hash;
}

function getParentRouting(subscriber: any): Routing {
    while ((subscriber = subscriber.parent)) {
        let routing = SUBSCRIBER_TO_ROUTING.get(subscriber);
        if (routing) {
            return routing;
        }
    }
}

class Routing {
    parent: Routing;
    patterns: Array<[RegExp, Array<any>, number, number]> = [];

    mode: string;
    constructor(
        public options: IRouterOptions,
        public subscriber: any
    ) {
        SUBSCRIBER_TO_ROUTING.set(subscriber, this);
        this.parent = getParentRouting(subscriber);
    }
    update() {
        let options = this.options;
        this.mode = options.mode || (this.parent && this.parent.mode) || "hash";
        let paths = options.path;

        if (!paths) {
            paths = [""];
        } else if (!(paths instanceof Array)) {
            paths = [paths];
        }
        let patterns = this.patterns;
        patterns.length = 0;

        for (let path of paths) {
            let flag = 0;
            let keys = [];
            let res = /^\s*\/+/.exec(path);
            if (res) {
                path = path.slice(res[0].length);
                flag = -1;
            } else {
                if ((res = /^(\s*\.\/+)+/.exec(path))) {
                    path = path.slice(res[0].length);
                }
                while ((res = /^\s*\.\.\/+(\s*\.\/+)*/.exec(path))) {
                    path = path.slice(res[0].length);
                    flag += 1;
                }
            }
            patterns.push([
                pathToRegexp("/" + path, keys, { end: false }),
                keys,
                flag,
                path.split(/\/+/).length
            ]);
        }
        patterns.sort(function (v1, v2) {
            return v2[3] - v1[3];
        });
    }
    hash: string;
    path: string;
    last_hash: string;
    last_path: string;
    match() {
        let location = getNormalizelocation();
        let mode = this.mode;
        let is_hash = mode !== "history";


        function _get_parent(routing: Routing, is_hash: boolean) {
            if (is_hash === (routing.mode !== "history")) {
                return routing;
            } else if (routing.parent) {
                return _get_parent(routing.parent, is_hash);
            }
        }
        let parent = this.parent;
        if (parent) {
            let hash_routing = _get_parent(parent, true);
            let path_routing = _get_parent(parent, false);

            this.hash = is_hash ? (hash_routing ? hash_routing.hash : "") : parent.hash;
            this.path = is_hash ? parent.path : (path_routing ? path_routing.path : "");
            this.last_hash = parent.last_hash;
            this.last_path = parent.last_path;
        } else {
            this.hash = is_hash ? "" : location.hash;
            this.path = is_hash ? location.pathname : "";
            this.last_hash = location.hash.slice(1);
            this.last_path = location.pathname;
        }

        let ref = is_hash ? "last_hash" : "last_path";
        let pathname = this[ref];


        let full_path = is_hash ? location.hash.slice(1) : location.pathname;

        for (let [regexp, keys, flag] of this.patterns) {
            let path = pathname;
            if (flag === -1) {
                path = full_path;

            } else if (flag > 0) {
                let clip_path = full_path.slice(0, full_path.length - path.length);
                for (let i = 0; i < flag; i++) {
                    clip_path = clip_path.replace(/\/+[^\/]*$/, "");
                }
                path = full_path.slice(clip_path.length);
            }
            let res = regexp.exec(path);
            if (res) {
                let match = {};
                this[is_hash ? "hash" : "path"] = full_path.slice(
                    0,
                    full_path.length - path.length
                ) + res[0];

                for (let i = 1, limit = keys.length + 1; i < res.length && i < limit; i++) {
                    if (res[i] !== undefined) {
                        let key = keys[i - 1].name;
                        if (match[key] === undefined) {
                            match[key] = res[i]
                        } else {
                            match[key] instanceof Array || (match[key] = [match[key]]);
                            match[key].push(res[i]);
                        }
                    }
                }
                this[ref] = path.slice(res[0].length);
                return match;
            }
        }

    }

}


export {
    Routing,
    getUrl,
    getParentRouting,
    addRouteChangeListener,
    removeRouteChangeListener
}