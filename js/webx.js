

import { convert } from './core/converter';
import Parser, { parse } from './core/parser';

let parser = new Parser();
function webx(source, external_declarations) {
    return convert(parser.parseModule(source), external_declarations);
}

export default webx;
