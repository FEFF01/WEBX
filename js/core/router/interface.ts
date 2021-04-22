interface ILinkOptions {
    to?: string,
    mode?: string,
    action?: "append" | "replace" | "back",
    tag?: string,
    class?: string,
    style?: string,
    [props: string]: any
}

interface IRouterOptions {
    path: string | Array<string>,
    mode?: string,
    component?: Function,
    [props: string]: any

}
export {
    ILinkOptions, IRouterOptions
}