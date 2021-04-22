import { ILinkOptions, IRouterOptions } from './interface';
declare function addRouteChangeListener(callback: () => void): void;
declare function removeRouteChangeListener(callback: () => void): void;
declare function getUrl(options: ILinkOptions, routing?: Routing): string;
declare function getParentRouting(subscriber: any): Routing;
declare class Routing {
    options: IRouterOptions;
    subscriber: any;
    parent: Routing;
    patterns: Array<[RegExp, Array<any>, number, number]>;
    mode: string;
    constructor(options: IRouterOptions, subscriber: any);
    update(): void;
    hash: string;
    path: string;
    last_hash: string;
    last_path: string;
    match(): {};
}
export { Routing, getUrl, getParentRouting, addRouteChangeListener, removeRouteChangeListener };
