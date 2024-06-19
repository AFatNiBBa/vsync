
import style from "./roulette.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";
import util from "../../style/util.module.scss";

import { createSignal } from "solid-js";

/** Funzioni di approssimazione dei vari contatori */
const APPROX_PUNTATA = createApprox(2, Math.ceil), APPROX_PERC = createApprox(5, Math.floor);

/** Calcolatore di puntate alla roulette col metodo di Fibonacci */
export default function() {
	const [ multiplier, setMultiplier ] = createSignal(.5);
	const [ current, setCurrent ] = createSignal(0);
	const [ volta, setVolta ] = createSignal(0);

	const puntata = () => APPROX_PUNTATA(current() * multiplier());
	const perc = () => APPROX_PERC(100 * (1 - (2 / 3) ** volta()));
	
	var iter: Iterator<number>;
	const next = () => (setVolta(x => x + 1), setCurrent(iter.next().value!));
	const reset = () => (iter = fibonacci(), setVolta(0), next());
	reset();

	return <>
		<div class={`${style.page} ${util.layer} ${layout.center}`}>
			Importo unitario (€)
			<input type="number" min={0} step={.1} value={multiplier()} onInput={e => setMultiplier(e.currentTarget.valueAsNumber)} />
			Puntata corrente (€)
			<input type="number" readOnly value={puntata()} />
			Numero puntata
			<input type="number" readOnly value={volta()} />
			Probabilità di vittoria (%)
			<input type="number" readOnly value={perc()} />
			<div class={util.control}>
				<button title="Vittoria" class={`${layout.align} ${color.backSuccess}`} onClick={reset}>
					<i class="fa-duotone fa-sack-dollar" />
				</button>
				<button title="Sconfitta" class={`${layout.align} ${color.backDanger}`} onClick={next}>
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
 * Genera una funzione di approssimazione a {@link cifre} cifre decimali
 * @param cifre Numero di cifre decimali al quale approssimare
 * @param f Funzione di arrotondamento
 */
function createApprox(cifre: number, f = Math.round) {
	const mul = 10 ** cifre;
	return (x: number) => f(x * mul) / mul;
}