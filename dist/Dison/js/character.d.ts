export default class {
    input: string;
    index: number;
    end: number;
    _volatility: any;
    _scopes: any;
    private testCodePoint;
    testUnicodeEscape(regexp: RegExp): number;
    scanHex(length?: number): [number, number];
    hexValue(ch: number): number;
    decimalValue(ch: number): number;
    octalValue(ch: number): number;
    binaryValue(ch: number): number;
    isWhiteSpace(ch: number): boolean;
    isLineTerminator(ch: number): boolean;
    fromCodePoint(cp: number): string;
    inIdentifierStart(): number;
    inIdentifierPart(): number;
}
