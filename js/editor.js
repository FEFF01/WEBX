


import 'input-listener';
import './core/runtime/'
import { convert } from './core/converter';
import { parse } from './core/parser';

let escodegen = require('escodegen');

window.parse = parse;
window.convert = convert;



export default window.webx = function (input) {
    let ast = convert(parse(input));

    let output = escodegen.generate(
        ast
        /*, { format: escodegen.FORMAT_MINIFY }*/
    );
    //console.log("webx", { ast, output });

    //require('./temp.js');return ''

    return output;

};