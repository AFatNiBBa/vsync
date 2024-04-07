
import style from "./index.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";

import { JSX, ParentProps, createMemo, createResource, createUniqueId } from "solid-js";
import { getAnimeWorldVideoUrl } from "../api/animeworld";
import { EpExp, createEpExp } from "@seanalunni/epexp";
import { useSearchParams } from "@solidjs/router";
import { parseTime } from "../../lib/util";
import { Result } from "../../lib/result";

/** Pagina iniziale dell'applicazione */
export default function() {
	type search = { name?: string, ep?: string, time?: string };
	const [ params, setParams ] = useSearchParams<search>();
	const [ url ] = createResource(() => Result.from(bridge(params.name, params.ep)), x => x);
	const state = createMemo(() => url.loading ? State.loading : url()!.ok ? State.ok : State.fail);
	const setEp = (f: (x: string) => string) => setParams({ ep: f(params.ep ?? "1°") } satisfies search);
	return <>
		<div class={`${style.host} ${layout.stretch}`}>
			<div class={style.page}>
				<video
					controls
					src={url()?.res ?? ""} // Se l'url non viene trovato ci mette la stringa vuota perchè se ci andava a finire `undefined` toglieva tutto l'attributo ma non il video vecchio
					ref={x => params.time && (x.currentTime = parseTime(params.time))}
				/>
				<div class={style.form}>
					<Field
						children="Nome"
						placeholder="Vuoto"
						value={params.name}
						onInput={name => setParams({ name } satisfies search)}
						detail="Il nome della serie da cercare"
					/>
					<Field
						placeholder="1º"
						value={params.ep}
						onInput={x => setEp(() => x)}
						detail="Espressione di riferimento ad episodio del video desiderato"
					>
						{/* Se il `nbsp;` lo metti sotto ti ci mette un'altro spazio */}
						Episodio&nbsp;
						<i class={`fad ${state()}`} title={(url()?.err as Error)?.message} />
					</Field>
					<div class={style.control}>
						<button class={layout.center} onClick={() => setEp(x => `${x}-`)}>
							<i class="fa-solid fa-caret-left" />
						</button>
						<button class={layout.center} onClick={() => setEp(x => `${x}+`)}>
							<i class="fa-solid fa-caret-right" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</>
}

/** Componente che rappresenta un campo da input della pagina */
function Field(props: ParentProps<{ value?: string, onInput?(x: string): void, detail?: JSX.Element, placeholder?: string }>) {
	const id = createUniqueId();
	return <>
		<div class={style.field}>
			<label for={id}>
				<h4>{props.children}</h4>
			</label>
			<input
				id={id}
				placeholder={props.placeholder}
				value={props.value ?? ""}
				onChange={e => props.onInput?.(e.target.value)}
			/>
			<small>
				{props.detail}
			</small>
		</div>
	</>
}

/**
 * Come {@link getAnimeWorldVideoUrl} ma prende in input una stringa al posto di un {@link EpExp} perchè "seroval" di merda non è in grado di serializzalli
 * @param name Nome della serie richiesta
 * @param ep Episodio richiesto
 * @returns Restituisce un'oggetto che comunica il risultato/errore dell'operazione
 */
async function bridge(name: string | undefined, ep: string = "1°") {
	"use server";
	if (!name) throw new RangeError("Non è stato fornito il nome della serie");
	return (await getAnimeWorldVideoUrl(name, createEpExp(ep))).href;
}

/**
 * Enumeratore che rappresenta lo stato di caricamento del video.
 * Non è un `enum` perchè non permettono l'interpolazione.
 * Non è un `namespace` a causa di [questo](https://github.com/solidjs/solid-start/issues/1438)
 */
abstract class State {
	static readonly ok = `fa-check-circle ${color.textSuccess}`;
	static readonly fail = `fa-times-circle ${color.textDanger}`;
	static readonly loading = `fa-spinner-third ${color.textWarning} fa-spin`;
}