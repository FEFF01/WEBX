export default function (ast: Node): any;
export declare const runtime: {
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
