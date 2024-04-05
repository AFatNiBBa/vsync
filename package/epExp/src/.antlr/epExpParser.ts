// Generated from c:/Users/ZioPe/Downloads/vsync/package/epExp/src/epExp.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { epExpVisitor } from "./epExpVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class epExpParser extends antlr.Parser {
    public static readonly POSITIONAL = 1;
    public static readonly HASH = 2;
    public static readonly PLUS = 3;
    public static readonly MINUS = 4;
    public static readonly ESC = 5;
    public static readonly INT = 6;
    public static readonly CHAR = 7;
    public static readonly RULE_start = 0;
    public static readonly RULE_any = 1;
    public static readonly RULE_base = 2;
    public static readonly RULE_expr = 3;

    public static readonly literalNames = [
        null, null, "'#'", "'+'", "'-'", "'\\'"
    ];

    public static readonly symbolicNames = [
        null, "POSITIONAL", "HASH", "PLUS", "MINUS", "ESC", "INT", "CHAR"
    ];
    public static readonly ruleNames = [
        "start", "any", "base", "expr",
    ];

    public get grammarFileName(): string { return "epExp.g4"; }
    public get literalNames(): (string | null)[] { return epExpParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return epExpParser.symbolicNames; }
    public get ruleNames(): string[] { return epExpParser.ruleNames; }
    public get serializedATN(): number[] { return epExpParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, epExpParser._ATN, epExpParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public start(): StartContext {
        let localContext = new StartContext(this.context, this.state);
        this.enterRule(localContext, 0, epExpParser.RULE_start);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 8;
            localContext._value = this.expr(0);
            this.state = 9;
            this.match(epExpParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public any_(): AnyContext {
        let localContext = new AnyContext(this.context, this.state);
        this.enterRule(localContext, 2, epExpParser.RULE_any);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 11;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 254) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public base(): BaseContext {
        let localContext = new BaseContext(this.context, this.state);
        this.enterRule(localContext, 4, epExpParser.RULE_base);
        try {
            let alternative: number;
            this.state = 26;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 2, this.context) ) {
            case 1:
                localContext = new PositionalContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 13;
                this.match(epExpParser.HASH);
                this.state = 14;
                (localContext as PositionalContext)._i = this.match(epExpParser.INT);
                }
                break;
            case 2:
                localContext = new PositionalContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 15;
                (localContext as PositionalContext)._i = this.match(epExpParser.INT);
                this.state = 16;
                this.match(epExpParser.POSITIONAL);
                }
                break;
            case 3:
                localContext = new NamedContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 23;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 1, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                        this.state = 21;
                        this.errorHandler.sync(this);
                        switch (this.tokenStream.LA(1)) {
                        case epExpParser.CHAR:
                            {
                            this.state = 17;
                            this.match(epExpParser.CHAR);
                            }
                            break;
                        case epExpParser.INT:
                            {
                            this.state = 18;
                            this.match(epExpParser.INT);
                            }
                            break;
                        case epExpParser.ESC:
                            {
                            this.state = 19;
                            this.match(epExpParser.ESC);
                            this.state = 20;
                            this.any_();
                            }
                            break;
                        default:
                            throw new antlr.NoViableAltException(this);
                        }
                        }
                    }
                    this.state = 25;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 1, this.context);
                }
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expr(): ExprContext;
    public expr(_p: number): ExprContext;
    public expr(_p?: number): ExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 6;
        this.enterRecursionRule(localContext, 6, epExpParser.RULE_expr, _p);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            {
            localContext = new WrapContext(localContext);
            this.context = localContext;
            previousContext = localContext;

            this.state = 29;
            (localContext as WrapContext)._value = this.base();
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 43;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this._parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 41;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
                    case 1:
                        {
                        localContext = new PlusContext(new ExprContext(parentContext, parentState));
                        (localContext as PlusContext)._value = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, epExpParser.RULE_expr);
                        this.state = 31;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 32;
                        this.match(epExpParser.PLUS);
                        this.state = 34;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
                        case 1:
                            {
                            this.state = 33;
                            (localContext as PlusContext)._n = this.match(epExpParser.INT);
                            }
                            break;
                        }
                        }
                        break;
                    case 2:
                        {
                        localContext = new MinusContext(new ExprContext(parentContext, parentState));
                        (localContext as MinusContext)._value = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, epExpParser.RULE_expr);
                        this.state = 36;
                        if (!(this.precpred(this.context, 1))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 1)");
                        }
                        this.state = 37;
                        this.match(epExpParser.MINUS);
                        this.state = 39;
                        this.errorHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
                        case 1:
                            {
                            this.state = 38;
                            (localContext as MinusContext)._n = this.match(epExpParser.INT);
                            }
                            break;
                        }
                        }
                        break;
                    }
                    }
                }
                this.state = 45;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }

    public override sempred(localContext: antlr.RuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 3:
            return this.expr_sempred(localContext as ExprContext, predIndex);
        }
        return true;
    }
    private expr_sempred(localContext: ExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 2);
        case 1:
            return this.precpred(this.context, 1);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,7,47,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,1,0,1,0,1,0,1,1,1,1,1,2,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,5,2,22,8,2,10,2,12,2,25,9,2,3,2,27,8,
        2,1,3,1,3,1,3,1,3,1,3,1,3,3,3,35,8,3,1,3,1,3,1,3,3,3,40,8,3,5,3,
        42,8,3,10,3,12,3,45,9,3,1,3,0,1,6,4,0,2,4,6,0,1,1,0,1,7,51,0,8,1,
        0,0,0,2,11,1,0,0,0,4,26,1,0,0,0,6,28,1,0,0,0,8,9,3,6,3,0,9,10,5,
        0,0,1,10,1,1,0,0,0,11,12,7,0,0,0,12,3,1,0,0,0,13,14,5,2,0,0,14,27,
        5,6,0,0,15,16,5,6,0,0,16,27,5,1,0,0,17,22,5,7,0,0,18,22,5,6,0,0,
        19,20,5,5,0,0,20,22,3,2,1,0,21,17,1,0,0,0,21,18,1,0,0,0,21,19,1,
        0,0,0,22,25,1,0,0,0,23,21,1,0,0,0,23,24,1,0,0,0,24,27,1,0,0,0,25,
        23,1,0,0,0,26,13,1,0,0,0,26,15,1,0,0,0,26,23,1,0,0,0,27,5,1,0,0,
        0,28,29,6,3,-1,0,29,30,3,4,2,0,30,43,1,0,0,0,31,32,10,2,0,0,32,34,
        5,3,0,0,33,35,5,6,0,0,34,33,1,0,0,0,34,35,1,0,0,0,35,42,1,0,0,0,
        36,37,10,1,0,0,37,39,5,4,0,0,38,40,5,6,0,0,39,38,1,0,0,0,39,40,1,
        0,0,0,40,42,1,0,0,0,41,31,1,0,0,0,41,36,1,0,0,0,42,45,1,0,0,0,43,
        41,1,0,0,0,43,44,1,0,0,0,44,7,1,0,0,0,45,43,1,0,0,0,7,21,23,26,34,
        39,41,43
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!epExpParser.__ATN) {
            epExpParser.__ATN = new antlr.ATNDeserializer().deserialize(epExpParser._serializedATN);
        }

        return epExpParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(epExpParser.literalNames, epExpParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return epExpParser.vocabulary;
    }

    private static readonly decisionsToDFA = epExpParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class StartContext extends antlr.ParserRuleContext {
    public _value?: ExprContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(epExpParser.EOF, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override get ruleIndex(): number {
        return epExpParser.RULE_start;
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitStart) {
            return visitor.visitStart(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnyContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public POSITIONAL(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.POSITIONAL, 0);
    }
    public HASH(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.HASH, 0);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.MINUS, 0);
    }
    public ESC(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.ESC, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.INT, 0);
    }
    public CHAR(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.CHAR, 0);
    }
    public override get ruleIndex(): number {
        return epExpParser.RULE_any;
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitAny) {
            return visitor.visitAny(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BaseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return epExpParser.RULE_base;
    }
    public override copyFrom(ctx: BaseContext): void {
        super.copyFrom(ctx);
    }
}
export class NamedContext extends BaseContext {
    public constructor(ctx: BaseContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public CHAR(): antlr.TerminalNode[];
    public CHAR(i: number): antlr.TerminalNode | null;
    public CHAR(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(epExpParser.CHAR);
    	} else {
    		return this.getToken(epExpParser.CHAR, i);
    	}
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(epExpParser.INT);
    	} else {
    		return this.getToken(epExpParser.INT, i);
    	}
    }
    public ESC(): antlr.TerminalNode[];
    public ESC(i: number): antlr.TerminalNode | null;
    public ESC(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(epExpParser.ESC);
    	} else {
    		return this.getToken(epExpParser.ESC, i);
    	}
    }
    public any_(): AnyContext[];
    public any_(i: number): AnyContext | null;
    public any_(i?: number): AnyContext[] | AnyContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AnyContext);
        }

        return this.getRuleContext(i, AnyContext);
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitNamed) {
            return visitor.visitNamed(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class PositionalContext extends BaseContext {
    public _i?: Token | null;
    public constructor(ctx: BaseContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public HASH(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.HASH, 0);
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(epExpParser.INT, 0)!;
    }
    public POSITIONAL(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.POSITIONAL, 0);
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitPositional) {
            return visitor.visitPositional(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return epExpParser.RULE_expr;
    }
    public override copyFrom(ctx: ExprContext): void {
        super.copyFrom(ctx);
    }
}
export class WrapContext extends ExprContext {
    public _value?: BaseContext;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public base(): BaseContext {
        return this.getRuleContext(0, BaseContext)!;
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitWrap) {
            return visitor.visitWrap(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class PlusContext extends ExprContext {
    public _value?: ExprContext;
    public _n?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public PLUS(): antlr.TerminalNode {
        return this.getToken(epExpParser.PLUS, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.INT, 0);
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitPlus) {
            return visitor.visitPlus(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class MinusContext extends ExprContext {
    public _value?: ExprContext;
    public _n?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MINUS(): antlr.TerminalNode {
        return this.getToken(epExpParser.MINUS, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(epExpParser.INT, 0);
    }
    public override accept<Result>(visitor: epExpVisitor<Result>): Result | null {
        if (visitor.visitMinus) {
            return visitor.visitMinus(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
