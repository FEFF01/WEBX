

import converter from './core/converter';
import parser from './core/parser';

function webx(source) {
    return converter(parser(source));
}

export default webx;