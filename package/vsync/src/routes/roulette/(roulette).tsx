
import style from "./roulette.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";
import util from "../../style/util.module.scss";

import { For, Setter, createMemo, createSignal, on } from "solid-js";
import { IndexAwareFibonacciGenerator } from "@seanalunni/fibonacci";
import { icon } from "~/lib/icon";

/** Possibilità di vincere per ogni turno */
const CHANCE = 1 / 3;

/** Valore iniziale del campo volta */
const DEFAULT_VOLTA = 1;

/** Calcolatore di puntate alla roulette col metodo di Fibonacci */
export default function() {
	const [ row, setRow ] = createSignal(1);
	const [ col, setCol ] = createSignal(1);
	return <>
		<div class={`${style.page} ${layout.root}`} style={{ grid: `auto repeat(${row()}, 1fr) / repeat(${col()}, 1fr)` }}>
			<div class={style.header}>
				<Field title="Riga" value={row()} setter={setRow} />
				<Field title="Colonna" value={col()} setter={setCol} />
			</div>
			<For each={Array(row())}>
				{() => <>
					<For each={Array(col())}>
						{() => <Calculator />}
					</For>
				</>}
			</For>
		</div>
	</>
}

/** Singolo calcolatore del metodo di Fibonacci */
function Calculator() {
	const generator = new IndexAwareFibonacciGenerator();
	const [ unit, setUnit ] = createSignal(.4);
	const [ skip, setSkip ] = createSignal(0);
	const [ virtual, setVirtual ] = createSignal(0);
	const [ volta, setVolta ] = createSignal(DEFAULT_VOLTA);
	const result = createMemo(on([ unit, skip, volta ], x => solve(generator, ...x)));
	return <>
		<div class={`${style.calculator} ${util.layer}`}>
			<h1 contentEditable>Metodo Fibonacci</h1>
			Importo unitario (€)
			<Field step={.1} value={unit()} setter={setUnit} />
			Puntata corrente (€)
			<Field class={style.important} value={result().puntata} />
			Persi fino ad ora (€)
			<Field value={result().spesa} />
			Perdita eventuale (€)
			<Field class={color.textDanger} value={result().perdita} />
			Ricavo eventuale (€)
			<Field class={color.textWarning} value={result().ricavo} />
			Guadagno eventuale (€)
			<Field class={color.textSuccess} value={result().guadagno} />
			Turni iniziali saltati
			<Field value={skip()} setter={setSkip} />
			Numero puntata
			<Field class={style.important} value={volta()} setter={setVolta} />
			Sconfitte virtuali
			<Field value={virtual()} setter={setVirtual} />
			Probabilità di vittoria (%)
			<Field cifre={5} value={100 * (1 - (1 - CHANCE) ** (virtual() + volta()))} />
			<div class={util.control}>
				<button title="Vittoria" class={color.backSuccess} onClick={() => setVolta(DEFAULT_VOLTA)}>
					<span class={icon.sackDollar} />
				</button>
				<button title="Sconfitta" class={color.backDanger} onClick={() => setVolta(x => x + 1)}>
					<span class={icon.handHoldingDollar} />
				</button>
			</div>
		</div>
	</>
}

/** Componente che rappresenta un campo da input della pagina */
function Field(props: { title?: string, cifre?: number, step?: number, class?: string, value: number, setter?: Setter<number> }) {
	const setter = createMemo(() => props.setter);
	const mul = createMemo(() => 10 ** (props.cifre ?? 2));
	return <>
		<input
			min={0}
			type="number"
			step={props.step}
			title={props.title}
			readOnly={!setter()}
			value={Math.round(props.value * mul()) / mul()}
			class={`${util.input} ${props.class ?? ""}`}
			onInput={e => setter()?.(e.target.valueAsNumber || 0)}
		/>
	</>
}

/**
 * Calcola la puntata corrente
 * @param unit Moltiplicatore da utilizzare per la puntata
 * @param skip Elementi della sequenza di Fibonacci da saltare
 * @param i Numero della puntata
 */
function solve(generator: IndexAwareFibonacciGenerator, unit: number, skip: number, i: number) {
	var puntata = 0, spesa = 0, perdita = 0;

	generator.goto(skip);
	for (var k = 0; k < i; k++)
		spesa = perdita,
		perdita += puntata = generator.next() * unit;

	const ricavo = puntata / CHANCE;
	return { puntata, spesa, perdita, ricavo, guadagno: ricavo - spesa };
}