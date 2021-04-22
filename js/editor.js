


import 'input-listener';
import './core/runtime/';
import './clipboard';
import { convert } from './core/converter';
import { parse } from './core/parser';
import { Router, RouterLink } from './router';

let escodegen = require('escodegen');

window.parse = parse;
window.convert = convert;
window.Router = Router;
window.RouterLink = RouterLink;

export default window.webx = function (input) {
    let [ast, used_declarators] = convert(parse(input), ["Router", "RouterLink"]);

    let output = escodegen.generate(
        ast
        /*, { format: escodegen.FORMAT_MINIFY }*/
    );
    //console.log("webx", { ast, output });

    //require('./temp.js');return ''

    return output;

};