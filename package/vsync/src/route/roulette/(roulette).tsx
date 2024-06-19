
import style from "./roulette.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";
import util from "../../style/util.module.scss";

import { createSignal } from "solid-js";
import { Atom } from "solid-model";

/** Cifre decimali da mostrare sul contatore della puntata */
const CIFRE = 2, PRECISION = 10 ** CIFRE;

/** Calcolatore di puntate alla roulette col metodo di Fibonacci */
export default function() {
	const multiplier = Atom.from(createSignal(.5));
	const current = Atom.from(createSignal(0));
	const index = Atom.from(createSignal(0));
	const puntata = current.convert(x => Math.round(x * multiplier.value * PRECISION) / PRECISION, x => x / multiplier.value);
	
	var iter: Iterator<number>;
	const next = () => (index.value++, current.value = iter.next().value!);
	const reset = () => (iter = fibonacci(), index.value = 0, next());
	reset();

	return <>
		<div class={`${style.page} ${util.layer} ${layout.center}`}>
			Importo unitario (€)
			<Field atom={multiplier} />
			Puntata corrente (€)
			<Field readOnly atom={puntata} />
			Numero puntata
			<Field readOnly atom={index} />
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

/** Componente che rappresenta un campo da input della pagina */
function Field(props: { atom: Atom<number>, readOnly?: boolean }) {
	return <>
		<input
			type="number"
			step={.1}
			min={0}

			value={props.atom.value}
			readOnly={props.readOnly}
			onInput={e => props.atom.value = e.currentTarget.valueAsNumber}
		/>
	</>
}

/** Funzione che genera un'iteratore che emette la sequenza di Fibonacci */
function *fibonacci() {
	var prev = 0, last = 1;
	yield last;
	for (var curr: number; true; prev = last, last = curr)
		yield curr = prev + last;
}