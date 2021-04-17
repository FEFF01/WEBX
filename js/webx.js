

import { convert } from './core/converter';
import Parser,{ parse } from './core/parser';

let parser=new Parser();
function webx(source) {
    return convert(parser.parseModule(source));
}

export default webx;
