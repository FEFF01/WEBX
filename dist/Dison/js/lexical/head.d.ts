import { Token, SearchTree } from '../interfaces';
import Tokenizer from '../tokenizer';
declare function createSearchTree(data: Array<string | string[] | Record<string, any>>, root?: Record<string, any>, block_list?: Array<string>): SearchTree;
declare function _Scanner(use_escape_mode?: boolean): (tokenizer: Tokenizer, start?: number) => Token;
export { createSearchTree, _Scanner };
/**
function createScanTree(data: Array<any>[]) {
    let root: Record<string, any> = {};
    for (let branch of data) {
        let node = root;
        for (let i = 0, limit = branch.length - 1, part: string; i < limit; i++) {
            part = branch[i];
            node = node[part] || (node[part] = {});
        }
        let actions = branch[branch.length - 1];
        for (let i = 0; i < actions.length; i += 2) {
            node[actions[i]] = actions[i + 1];
        }
    }
    return root;
}



 */ 
