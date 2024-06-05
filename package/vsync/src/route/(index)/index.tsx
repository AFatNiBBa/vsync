
import style from "./index.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";

import { JSX, ParentProps, Show, createMemo, createResource, createUniqueId } from "solid-js";
import { getAnimeWorldVideoUrl } from "../api/animeworld";
import { EpExp, parseEpExp } from "@seanalunni/epexp";
import { copyText, parseTime } from "../../lib/util";
import { useSearchParams } from "@solidjs/router";
import { Result } from "../../lib/result";

/** Episodio di default se non viene fornito uno esplicitamente */
const DEFAULT_EPISODE = "1°";

/** Pagina iniziale dell'applicazione */
export default function() {
	type search = { name?: string, ep?: string, time?: string };
	const [ params, setParams ] = useSearchParams<search>();
	const [ url ] = createResource(() => Result.from(bridge(params.name, params.ep)), x => x);
	const state = createMemo(() => url.loading ? State.loading : url()!.ok ? State.ok : State.fail);
	const setEp = (f: (x: string) => string) => setParams({ ep: f(params.ep || DEFAULT_EPISODE), time: undefined } satisfies search);
	var video!: HTMLVideoElement;
	return <>
		<div class={`${style.host} ${layout.stretch}`}>
			<div class={style.page}>
				<video
					controls
					class={layout.stretch}
					src={url()?.res ?? ""} // Se l'url non viene trovato ci mette la stringa vuota perchè se ci andava a finire `undefined` toglieva tutto l'attributo ma non il video vecchio
					ref={x => {
						video = x;
						if (!params.time) return;
						x.currentTime = parseTime(params.time);
					}}
				/>
				<div class={style.form}>
					<Field
						children="Nome"
						placeholder="Vuoto"
						value={params.name}
						onInput={name => setParams({ name, time: undefined } satisfies search)}
						detail="Il nome della serie da cercare"
					/>
					<Field
						placeholder={DEFAULT_EPISODE}
						value={params.ep}
						onInput={x => setEp(() => x)}
						detail="Espressione di riferimento ad episodio del video desiderato"
					>
						{/* Se lo spazio lo metto sotto ci mette un'altro spazio */}
						{/* Il `nbsp;` è necessario perchè il testo è su una flexbox */}
						Episodio&nbsp;
						<i class={`fad ${state()}`} title={(url()?.err as Error)?.message} />
					</Field>
					<Field
						readOnly
						children="Url"
						placeholder="Vuoto"
						value={url()?.res}
						detail="Link diretto al video in riproduzione"
					/>
					<div class={style.control}>
						<button title="Episodio precedente" class={`${layout.align} ${color.backSecondary}`} onClick={() => setEp(x => `${x}-`)}>
							<i class="fa-solid fa-caret-left" />
						</button>
						<button title="Episodio successivo" class={`${layout.align} ${color.backSecondary}`} onClick={() => setEp(x => `${x}+`)}>
							<i class="fa-solid fa-caret-right" />
						</button>
						<button title="Copia link" class={`${layout.align} ${color.backPrimary}`} onClick={() => copyText(location.href)}>
							<i class="fa-duotone fa-link" />
						</button>
						<button title="Formatta l'espressione di riferimento all'episodio" class={`${layout.align} ${color.backInfo}`} onClick={() => setEp(x => parseEpExp(x).toString())}>
							<i class="fa-duotone fa-hashtag" />
						</button>
						<button title="Scrivi il minutaggio sul link" class={`${layout.align} ${color.backSuccess}`} onClick={() => setParams({ time: video.currentTime.toString() } satisfies search)}>
							<i class="fa-duotone fa-stopwatch-20" />
						</button>
						<Show when={params.time}>
							<button title="Cancella il minutaggio dal link" class={`${layout.align} ${color.backDanger}`} onClick={() => setParams({ time: undefined } satisfies search)}>
								<i class="fa-duotone fa-stopwatch" />
							</button>
						</Show>
					</div>
				</div>
			</div>
		</div>
	</>
}

/** Componente che rappresenta un campo da input della pagina */
function Field(props: ParentProps<{ value?: string, onInput?(x: string): void, detail?: JSX.Element, placeholder?: string, readOnly?: boolean }>) {
	const id = createUniqueId();
	return <>
		<div class={style.field}>
			<label for={id}>
				<h4>{props.children}</h4>
			</label>
			<input
				id={id}
				readOnly={props.readOnly}
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
async function bridge(name: string | undefined, ep = DEFAULT_EPISODE) {
	"use server";
	if (!name) throw new RangeError("Non è stato fornito il nome della serie");
	return (await getAnimeWorldVideoUrl(name, parseEpExp(ep))).href;
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