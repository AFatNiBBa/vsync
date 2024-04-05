
import { MinusContext, NamedContext, PlusContext, PositionalContext, StartContext, WrapContext, epExpParser } from "./.antlr/epExpParser";
import { AbstractParseTreeVisitor, CharStream, CommonTokenStream, Token } from "antlr4ng";
import { EpExp, NominalEpExp, PositionalEpExp } from "./model";
import { epExpVisitor } from "./.antlr/epExpVisitor";
import { epExpLexer } from "./.antlr/epExpLexer";

export * from "./model";

/** Espressione regolare che per ogni coppia di back-slash e carattere a caso rimuove il back-slash */
const REGEX_UNESCAPE = /\\(.)/g;

/**
 * Genera un {@link EpExp} a partire da una espressione di riferimento ad un episodio
 * @param code L'espressione
 */
export function createEpExp(code: string): EpExp {
	const lexer = new epExpLexer(CharStream.fromString(code));
	const parser = new epExpParser(new CommonTokenStream(lexer));
	const tree = parser.start();
	return Visitor.instance.visit(tree)!;
}

/** Genera un {@link EpExp} partendo da un {@link StartContext} */
class Visitor extends AbstractParseTreeVisitor<EpExp> implements epExpVisitor<EpExp> {
	static instance = new this();

	visitStart(ctx: StartContext) { return this.visit(ctx._value!)!; };

	visitPositional(ctx: PositionalContext) { return new PositionalEpExp(+ctx._i!.text!); }

	visitNamed(ctx: NamedContext) { return new NominalEpExp(ctx.getText().replace(REGEX_UNESCAPE, "$1")); }

	visitWrap(ctx: WrapContext) { return this.visit(ctx._value!)!; }

	visitPlus(ctx: PlusContext) { return visitShift(this.visit(ctx._value!)!, true, ctx._n); }

	visitMinus(ctx: MinusContext) { return visitShift(this.visit(ctx._value!)!, false, ctx._n); }
}

/**
 * Implementazione comune di {@link Visitor.visitPlus} e {@link Visitor.visitMinus}
 * @param exp Espressione di riferimento ad un episodio da modificare
 * @param plus Valore che indica se il numero rappresentato da {@link n} è o meno positivo
 * @param n Nodo del AST che rappresenta un numero 
 */
function visitShift(exp: EpExp, plus: boolean, n?: Token | null) {
	return exp.add((plus ? 1 : -1) * (n ? +n.text! : 1));
}