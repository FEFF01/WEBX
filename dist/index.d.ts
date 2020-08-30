import { Token, Node } from './Dison/js/interfaces';
import Parser from './Dison/js/parser';
import Tokenizer from './Dison/js/tokenizer';
declare function isExpression(node: Node): any;
declare function isDeclaration(node: Node): any;
declare function isStatement(node: Node): any;
declare function isStatementListItem(node: Node): any;
declare function isModuleItem(node: Node): any;
declare class Dison extends Parser {
    token_hooks: Record<string, (token: Token, tokenizer?: Parser | Tokenizer) => Token>;
    TYPE_ENUMS: {
        Identifier: string;
        Keyword: string;
        String: string;
        Boolean: string;
        Numeric: string;
        Punctuator: string;
        RegularExpression: string;
        Template: string;
        TemplateElement: string;
        Comments: string;
        Null: string;
    };
    PRIMARY_EXPR_START_PUNCTUATORS_TREE: import("./Dison/js/interfaces").SearchTree;
    PUNCTUATORS_TREE: import("./Dison/js/interfaces").SearchTree;
    TOKEN_TYPE_MAPPERS: Record<string, string | number>;
    SYNTAX_TREE: Record<string, any>;
    EXPRESSION_TREE: Record<string, any>;
    isExpression: typeof isExpression;
    isStatement: typeof isStatement;
    isStatementListItem: typeof isStatementListItem;
    isDeclaration: typeof isDeclaration;
    isModuleItem: typeof isModuleItem;
    private _inIdentifierStart;
    private _inIdentifierPart;
    inIdentifierStart(): number;
    inIdentifierPart(): number;
}
export default Dison;
