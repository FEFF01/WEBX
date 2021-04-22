import { ILinkOptions, IRouterOptions } from './interface';
declare function Router(options: IRouterOptions): any;
declare function Link(options: ILinkOptions): Element;
declare function RouterLink(options: ILinkOptions): Element;
export { Router, RouterLink, Link };
export default Router;
