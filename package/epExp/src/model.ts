
/** Costanti necessarie al funzionamento degli {@link EpExp} */
const STRINGIFY = (x: any) => `${x}`, REGEX_ESCAPE = /[°ºª#+\-\\]/g;

/** Espressione base di riferimento ad un episodio */
export abstract class EpExp {
	constructor(public shift = 0) { }

	/**
	 * Estrae da {@link list} il primo elemento che viene matchato dall'espressione corrente
	 * @param list La lista dalla quale estrarre l'elemento
	 * @param f Funzione che da un'elemento ottiene il suo indicativo
	 */
	abstract get<T>(list: T[], f?: (x: T) => string): T | undefined;

	/**
	 * Aggiunge {@link n} a {@link shift} in maniera fluent
	 * @param n Il numero col quale variare {@link shift}
	 * @returns L'oggetto corrente
	 */
	add(n: number) { return this.shift += n, this; }

	/** Stringifizza l'espressione corrente */
	toString() {
		const { shift } = this;
		switch (shift) {
			case 0: return "";
			case 1: return "+";
			case -1: return "-";
			default: return shift < 0 ? shift.toString() : `+${shift}`;
		}
	}
}

/**
 * Versione posizionale di {@link EpExp}.
 * L'indice {@link position} è in base 1
 */
export class PositionalEpExp extends EpExp {
	constructor(public position: number, shift?: number) { super(shift); }

	get<T>(list: T[]): T | undefined {
		const { position } = this;
		const index = position < 0 ? list.length + position : position - 1;
		return list[index + this.shift];
	}

	toString() {
		const { position } = this;
		return position < 0
			? `${position}°${super.toString()}`
			: `${position + this.shift}°`;
	}
}

/** Versione nominale di {@link EpExp} */
export class NominalEpExp extends EpExp {
	constructor(public name: string, shift?: number) { super(shift); }

	get<T>(list: T[], f: (x: T) => string = STRINGIFY) {
		const temp = list.findIndex(x => this.name === f(x));
		return ~temp ? list[temp + this.shift] : undefined;
	}

	toString() { return `${this.name.replace(REGEX_ESCAPE, "\\$&")}${super.toString()}`; }
}

/** Fix errori nei file generati da Antlr4 */
declare module "antlr4ng" {
	type RuleContext = ParserRuleContext;

	interface ParserRuleContext {
		exception?: import("antlr4ng").RecognitionException;
	}

	interface Parser {
		_parseListeners?: unknown;
	}
}