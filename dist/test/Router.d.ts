interface ILinkOptions {
    tag?: string;
    class?: string;
    style?: string;
    mode?: string;
    to?: string;
    action?: "append" | "replace" | "back";
    children?: Array<Node>;
    [props: string]: any;
}
interface IRouterOptions {
    path: string | Array<string>;
    mode?: string;
    component?: Function;
    [props: string]: any;
}
declare function Router(options: IRouterOptions, children?: Array<Node>): any;
declare function Link(options: ILinkOptions): Element;
export { Router, Link };
export default Router;
