


import 'input-listener';
import './core/runtime/'
import converter from './core/converter';
import parser from './core/parser';

let escodegen = require('escodegen');
window.parser = parser;

export default window.webx = function (input) {
    let ast = converter(parser(input));

    let output = escodegen.generate(
        ast
        /*, { format: escodegen.FORMAT_MINIFY }*/
    );
    //console.log("webx", { ast, output });

    //require('./temp.js');return ''

    return output;

};