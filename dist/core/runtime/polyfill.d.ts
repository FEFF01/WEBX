import { Sibling } from './siblings';
declare function entryStatement(object: any, body: Function): void;
declare function nextIfSibling(parent: Sibling, test: Function, consequent: Function, alternate?: Function): void;
declare function nextEntrySibling(parent: Sibling, data: Function, callback: Function): void;
export { entryStatement, nextIfSibling, nextEntrySibling };
