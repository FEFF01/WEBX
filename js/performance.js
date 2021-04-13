
import './core/runtime/'
import converter from './core/converter/';
import parser from './core/parser/';
import './vue.js'

let escodegen = require('escodegen');


export default window.webx = function (input) {
    let ast = converter(parser(input));
    let output = escodegen.generate(
        ast
        /*, { format: escodegen.FORMAT_MINIFY }*/
    );

    return output;

};