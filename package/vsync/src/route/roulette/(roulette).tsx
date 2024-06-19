
import style from "./roulette.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";
import util from "../../style/util.module.scss";

import { createMemo, createSignal } from "solid-js";

/** Possibilità di vincere per ogni turno */
const CHANCE = 1 / 3;

/** Funzioni di approssimazione dei vari contatori */
const APPROX_IMPORTO = createApprox(2), APPROX_PERC = createApprox(5);

/** Calcolatore di puntate alla roulette col metodo di Fibonacci */
export default function() {
	const [ multiplier, setMultiplier ] = createSignal(.4);
	const [ spesa, setSpesa ] = createSignal(0);
	const [ saltati, setSaltati ] = createSignal(0);
	const [ volta, setVolta ] = createSignal(0);

	const current = createMemo(() => APPROX_IMPORTO(fibonacciAt(saltati() + volta()) * multiplier()));
	const ricavo = createMemo(() => APPROX_IMPORTO(current() / CHANCE));

	return <>
		<div class={`${style.page} ${util.layer} ${layout.center}`}>
			<h1>Metodo Fibonacci</h1>
			Importo unitario (€)
			<input type="number" min={0} step={.1} value={multiplier()} onInput={e => setMultiplier(e.currentTarget.valueAsNumber)} />
			Puntata corrente (€)
			<input type="number" readOnly class={`${style.important} ${util.input}`} value={current()} />
			Persi fino ad ora (€)
			<input type="number" readOnly class={util.input} value={spesa()} />
			Ricavo eventuale (€)
			<input type="number" readOnly class={util.input} value={ricavo()} />
			Guadagno eventuale (€)
			<input type="number" readOnly class={util.input} value={APPROX_IMPORTO(ricavo() - spesa())} />
			Turni iniziali saltati
			<input type="number" min={0} value={saltati()} onInput={e => setSaltati(e.currentTarget.valueAsNumber)} />
			Numero puntata
			<input type="number" readOnly class={`${style.important} ${util.input}`} value={volta() + 1} />
			Probabilità di vittoria (%)
			<input type="number" readOnly class={util.input} value={APPROX_PERC(100 * (1 - (1 - CHANCE) ** volta()))} />
			<div class={util.control}>
				<button title="Vittoria" class={`${layout.align} ${color.backSuccess}`} onClick={() => setSpesa(setVolta(0))}>
					<i class="fa-duotone fa-sack-dollar" />
				</button>
				<button title="Sconfitta" class={`${layout.align} ${color.backDanger}`} onClick={() => (setSpesa(x => APPROX_IMPORTO(x + current())), setVolta(x => x + 1))}>
					<i class="fa-duotone fa-hand-holding-dollar" />
				</button>
			</div>
		</div>
	</>
}

/** Funzione che genera un'iteratore che emette la sequenza di Fibonacci */
function *fibonacci() {
	var prev = 0, last = 1;
	yield last;
	for (var curr: number; true; prev = last, last = curr)
		yield curr = prev + last;
}

/**
 * Funzione che ottiene l'elemento {@link n} della sequenza generata da {@link fibonacci}
 * @param n Indice in base 0 dell'elemento della sequenza di Fibonacci desiderato
 */
function fibonacciAt(n: number) {
	for (const elm of fibonacci())
		if (n-- <= 0)
			return elm;
	throw new RangeError("La sequenza di Fibonacci si è interrotta (?)");
}

/**
 * Genera una funzione di approssimazione a {@link cifre} cifre decimali
 * @param cifre Numero di cifre decimali al quale approssimare
 * @param f Funzione di arrotondamento
 */
function createApprox(cifre: number, f = Math.round) {
	const mul = 10 ** cifre;
	return (x: number) => f(x * mul) / mul;
}