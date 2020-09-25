import proxy from './proxy'
let escodegen = require('escodegen');
import Parser, { isExpression, isStatement, isStatementListItem, isDeclaration, isModuleItem } from './parser';

let parser = new Parser();
export default window.webx = function (input: string) {
    let output=escodegen.generate(proxy(parser.parse(input)));
    console.log("webx",{output});
    return output;
};