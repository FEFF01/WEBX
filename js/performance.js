
import './core/runtime/'
import { convert } from './core/converter/';
import { parse } from './core/parser/';
import './vue.js'

let escodegen = require('escodegen');


export default window.webx = function (input) {
    let ast = convert(parse(input));
    let output = escodegen.generate(
        ast
        /*, { format: escodegen.FORMAT_MINIFY }*/
    );

    return output;

};