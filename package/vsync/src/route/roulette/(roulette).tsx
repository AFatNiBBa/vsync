
import style from "./roulette.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";
import util from "../../style/util.module.scss";

import { Accessor, Setter, createMemo, createSignal, on } from "solid-js";

/** Possibilità di vincere per ogni turno */
const CHANCE = 1 / 3;

/** Valore iniziale del campo volta */
const DEFAULT_VOLTA = 1;

/** Funzioni di approssimazione dei vari contatori */
const APPROX_IMPORTO = createApprox(2), APPROX_PERC = createApprox(5);

/** Calcolatore di puntate alla roulette col metodo di Fibonacci */
export default function() {
	const [ multiplier, setMultiplier ] = createSignal(.4);
	const [ saltati, setSaltati ] = createSignal(0);
	const [ volta, setVolta ] = createSignal(DEFAULT_VOLTA);
	const result = solve(multiplier, () => saltati() + volta());
	return <>
		<div class={`${style.page} ${util.layer} ${layout.center}`}>
			<h1>Metodo Fibonacci</h1>
			Importo unitario (€)
			<Field step={.1} value={multiplier()} setter={setMultiplier} />
			Puntata corrente (€)
			<Field class={style.important} value={APPROX_IMPORTO(result().puntata)} />
			Persi fino ad ora (€)
			<Field value={APPROX_IMPORTO(result().spesa)} />
			Perdita eventuale (€)
			<Field class={color.textDanger} value={APPROX_IMPORTO(result().perdita)} />
			Ricavo eventuale (€)
			<Field class={color.textWarning} value={APPROX_IMPORTO(result().ricavo)} />
			Guadagno eventuale (€)
			<Field class={color.textSuccess} value={APPROX_IMPORTO(result().guadagno)} />
			Turni iniziali saltati
			<Field value={saltati()} setter={setSaltati} />
			Numero puntata
			<Field class={style.important} value={volta()} setter={setVolta} />
			Probabilità di vittoria (%)
			<Field value={APPROX_PERC(100 * (1 - (1 - CHANCE) ** volta()))} />
			<div class={util.control}>
				<button title="Vittoria" class={`${layout.align} ${color.backSuccess}`} onClick={() => setVolta(DEFAULT_VOLTA)}>
					<i class="fa-duotone fa-sack-dollar" />
				</button>
				<button title="Sconfitta" class={`${layout.align} ${color.backDanger}`} onClick={() => setVolta(x => x + 1)}>
					<i class="fa-duotone fa-hand-holding-dollar" />
				</button>
			</div>
		</div>
	</>
}

/** Componente che rappresenta un campo da input della pagina */
function Field(props: { step?: number, class?: string, value: number, setter?: Setter<number> }) {
	const setter = createMemo(() => props.setter);
	return <>
		<input
			min={0}
			type="number"
			step={props.step}
			readOnly={!setter()}
			value={props.value}
			class={`${util.input} ${props.class ?? ""}`}
			onInput={e => setter()?.(e.target.valueAsNumber || 0)}
		/>
	</>
}

/**
 * Genera un'{@link Accessor} reattivo che restituisce il calcolo della puntata corrente
 * @param mul Moltiplicatore da utilizzare per la puntata
 * @param i Numero della puntata
 */
function solve(mul: Accessor<number>, i: Accessor<number>) {
	return createMemo(on([ mul, i ], ([ multiplier, volta ]) => {
		var puntata = 0, spesa = 0;
		for (const elm of fibonacci())
			if (puntata = elm * multiplier, volta-- > 0)
				spesa += puntata;
			else
				break;
		const ricavo = puntata / CHANCE;
		return { puntata, spesa, perdita: puntata + spesa, ricavo, guadagno: ricavo - spesa };
	}));
}

/** Funzione che genera un'iteratore che emette la sequenza di Fibonacci */
function *fibonacci() {
	var prev = 0, last = 1;
	yield prev;
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