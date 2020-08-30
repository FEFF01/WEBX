

import Dison from './index';

let esprima = require("./Dison/js/test/esprima.js");
window.esprima = esprima;
console.log(22, esprima.parseScript(
    '<input type="checkbox" checked/>;<a a="s">sdf&#36;<b></b></ a>;var el= <title>${product}</title>'
    , { jsx: true }).body
);

let dison = new Dison();
let data0 = window.test.innerHTML;

window.onload = function () {
    /*let source_editor = new JSONEditor(source, {
        onChange() {
            ast_editor.set(dison.parseModule(source_editor.getText()));
        },
        mode: "text",
        "indentation": 2
    });
    source_editor.setText(data0);*/

    let ast_editor = new JSONEditor(ast, {
        mode: "code",
        "indentation": 2,
    })
    source.value = data0;
    source.oninput = function () {
        ast_editor.set(dison.parseModule(source.value));
    }
    ast_editor.set(dison.parseModule(data0))
}
console.log(dison.parseModule(data0).body);

