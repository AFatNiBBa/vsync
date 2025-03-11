// Generated from f:/JavaScript/vsync/package/epExp/src/epExp.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { StartContext } from "./epExpParser.js";
import { AnyContext } from "./epExpParser.js";
import { PositionalContext } from "./epExpParser.js";
import { NamedContext } from "./epExpParser.js";
import { WrapContext } from "./epExpParser.js";
import { PlusContext } from "./epExpParser.js";
import { MinusContext } from "./epExpParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `epExpParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class epExpVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `epExpParser.start`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStart?: (ctx: StartContext) => Result;
    /**
     * Visit a parse tree produced by `epExpParser.any`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAny?: (ctx: AnyContext) => Result;
    /**
     * Visit a parse tree produced by the `Positional`
     * labeled alternative in `epExpParser.base`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPositional?: (ctx: PositionalContext) => Result;
    /**
     * Visit a parse tree produced by the `Named`
     * labeled alternative in `epExpParser.base`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNamed?: (ctx: NamedContext) => Result;
    /**
     * Visit a parse tree produced by the `Wrap`
     * labeled alternative in `epExpParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWrap?: (ctx: WrapContext) => Result;
    /**
     * Visit a parse tree produced by the `Plus`
     * labeled alternative in `epExpParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPlus?: (ctx: PlusContext) => Result;
    /**
     * Visit a parse tree produced by the `Minus`
     * labeled alternative in `epExpParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMinus?: (ctx: MinusContext) => Result;
}

