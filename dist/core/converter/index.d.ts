import { Node } from '../../Dison/js/interfaces';
declare function convert(ast: Node, external_declarations?: Array<string>): any;
declare const runtime: {
    type: string;
    kind: string;
    declarations: {
        type: string;
        id: {
            type: string;
            name: string;
        };
        init: {
            type: string;
            object: {
                type: string;
                name: string;
            };
            property: {
                type: string;
                name: string;
            };
            computed: boolean;
        };
    }[];
};
export default class Converter {
    convert: typeof convert;
}
export { convert, runtime };
