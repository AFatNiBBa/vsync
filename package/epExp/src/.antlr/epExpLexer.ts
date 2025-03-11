// Generated from f:/JavaScript/vsync/package/epExp/src/epExp.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class epExpLexer extends antlr.Lexer {
    public static readonly POSITIONAL = 1;
    public static readonly HASH = 2;
    public static readonly PLUS = 3;
    public static readonly MINUS = 4;
    public static readonly ESC = 5;
    public static readonly INT = 6;
    public static readonly CHAR = 7;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
        null, null, "'#'", "'+'", "'-'", "'\\'"
    ];

    public static readonly symbolicNames = [
        null, "POSITIONAL", "HASH", "PLUS", "MINUS", "ESC", "INT", "CHAR"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "POSITIONAL", "HASH", "PLUS", "MINUS", "ESC", "INT", "CHAR",
    ];


    public constructor(input: antlr.CharStream) {
        super(input);
        this.interpreter = new antlr.LexerATNSimulator(this, epExpLexer._ATN, epExpLexer.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public get grammarFileName(): string { return "epExp.g4"; }

    public get literalNames(): (string | null)[] { return epExpLexer.literalNames; }
    public get symbolicNames(): (string | null)[] { return epExpLexer.symbolicNames; }
    public get ruleNames(): string[] { return epExpLexer.ruleNames; }

    public get serializedATN(): number[] { return epExpLexer._serializedATN; }

    public get channelNames(): string[] { return epExpLexer.channelNames; }

    public get modeNames(): string[] { return epExpLexer.modeNames; }

    public static readonly _serializedATN: number[] = [
        4,0,7,32,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,
        6,7,6,1,0,1,0,1,1,1,1,1,2,1,2,1,3,1,3,1,4,1,4,1,5,4,5,27,8,5,11,
        5,12,5,28,1,6,1,6,0,0,7,1,1,3,2,5,3,7,4,9,5,11,6,13,7,1,0,2,3,0,
        170,170,176,176,186,186,1,0,48,57,32,0,1,1,0,0,0,0,3,1,0,0,0,0,5,
        1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,1,15,1,
        0,0,0,3,17,1,0,0,0,5,19,1,0,0,0,7,21,1,0,0,0,9,23,1,0,0,0,11,26,
        1,0,0,0,13,30,1,0,0,0,15,16,7,0,0,0,16,2,1,0,0,0,17,18,5,35,0,0,
        18,4,1,0,0,0,19,20,5,43,0,0,20,6,1,0,0,0,21,22,5,45,0,0,22,8,1,0,
        0,0,23,24,5,92,0,0,24,10,1,0,0,0,25,27,7,1,0,0,26,25,1,0,0,0,27,
        28,1,0,0,0,28,26,1,0,0,0,28,29,1,0,0,0,29,12,1,0,0,0,30,31,9,0,0,
        0,31,14,1,0,0,0,2,0,28,0
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!epExpLexer.__ATN) {
            epExpLexer.__ATN = new antlr.ATNDeserializer().deserialize(epExpLexer._serializedATN);
        }

        return epExpLexer.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(epExpLexer.literalNames, epExpLexer.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return epExpLexer.vocabulary;
    }

    private static readonly decisionsToDFA = epExpLexer._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}