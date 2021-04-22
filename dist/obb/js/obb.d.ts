declare type IOBInternalObject = Iterable<any> | ArrayLike<any>;
declare type IOBTarget = object | IOBInternalObject;
declare const enum RECORD {
    OBSERVER = 0,
    KEY = 1,
    VALUE = 2,
    TYPE = 3
}
interface IRecord {
    [RECORD.OBSERVER]: Observer;
    [RECORD.KEY]: any;
    [RECORD.VALUE]: any;
    [RECORD.TYPE]: RECORD_TYPE;
}
declare const enum TRANSACTS_OPTION {
    ACTION = 1,
    DEFAULT = 1,
    ATOM = 2,
    SANDBOX = 4,
    ATOM_AND_SANDBOX = 6,
    WRAPUP = 8,
    PLAIN = 18
}
declare const enum RECORD_TYPE {
    OWN = 1,
    REF = 2,
    READONLY = 4,
    VOLATILE = 8,
    REF_AND_READONLY = 6,
    REF_AND_VOLATILE = 10
}
declare const enum SANDOBX_OPTION {
    PREVENT_COLLECT = 1,
    CLEAN_SUBSCRIBE = 2,
    CLEAN_CHANGE = 4,
    DEFAULT = 7,
    NORMAL = 0
}
declare enum SUBSCRIBE_OPTION {
    DEFAULT = 0,
    PREVENT_COLLECT = 1,
    COMPUTED = 2
}
declare type ISubscriberSet = Set<Subscriber>;
declare const MASK_ITERATE: string[];
declare const MASK_UNDEFINED: string[];
declare class Observer<T extends object = any> {
    readonly target: T;
    static TO_RAW(obj: any): any;
    static TO_OB(obj: any): Observer<any>;
    readonly proxy: any;
    readonly refmap: Map<any, ISubscriberSet>;
    readonly ownmap: Map<any, ISubscriberSet>;
    constructor(target: T);
    collect(prop: any, type?: RECORD_TYPE): void;
    release(): void;
    notify(prop: any, value: any, type?: RECORD_TYPE): void;
    _has: (key: any) => boolean;
    _val: (key: any) => any;
    _del: (key: any) => boolean;
    _set: (key: any, value: any) => any;
    _map(type: RECORD_TYPE): Map<any, ISubscriberSet>;
    _proxy_handler: {
        get: (target: IOBTarget, prop: string | symbol) => any;
        set: (target: IOBTarget, prop: string, value: any) => boolean;
        ownKeys: (target: IOBTarget) => any;
        has: (target: IOBTarget, key: string) => boolean;
        deleteProperty: (target: IOBTarget, key: string) => any;
    };
}
declare class Subscriber {
    fn: Function;
    option: SUBSCRIBE_OPTION;
    static get PARENT(): Subscriber;
    depth: number;
    parent: Subscriber;
    children: Array<Subscriber>;
    constructor(fn: Function, option?: SUBSCRIBE_OPTION);
    private _deps;
    undepend(set: ISubscriberSet): void;
    depend(set: ISubscriberSet): void;
    clear(shallow?: boolean): void;
    private _once;
    once(event: string, callback: Function): void;
    emit(event: string): void;
    unmount(shallow?: boolean): void;
    private _sandbox;
    mount(parent?: Subscriber): Subscriber;
    update(): any;
    addRecord(record: IRecord): void;
    is_run: boolean;
    res: any;
    brokens: Array<Subscriber>;
    accu: number;
    private _run;
}
declare function transacts(option: TRANSACTS_OPTION, fn: Function, ...args: Array<any>): any;
declare type ReflectCall = (fn: Function, ...args: Array<any>) => any;
declare function atom<T = Function>(fn: T): T;
declare const runInAtom: ReflectCall;
declare function action<T = Function>(fn: T): T;
declare const runInAction: ReflectCall;
declare function sandbox<T = Function>(fn: T, option?: SANDOBX_OPTION): T;
declare const runInSandbox: ReflectCall;
declare function autorun(fn: Function): () => void;
declare function observable<T = IOBTarget>(obj: T): T;
declare function computed(calc: Function, parent?: Subscriber): () => any;
declare function watch(handle: Function, watcher: (new_value: any, old_value?: any) => void, immediately?: boolean): () => void;
declare function reaction(handle: Function, watcher: (val: any) => void): () => void;
export { Observer, Subscriber, observable, autorun, atom, runInAtom, action, runInAction, sandbox, runInSandbox, transacts, TRANSACTS_OPTION, SANDOBX_OPTION, SUBSCRIBE_OPTION, computed, watch, reaction, MASK_ITERATE, MASK_UNDEFINED, RECORD_TYPE };
