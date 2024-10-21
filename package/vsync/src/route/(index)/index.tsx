
import style from "./index.module.scss";
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";
import util from "../../style/util.module.scss";

import Link from "solid-fa6-pro/duotone/link";
import Hashtag from "solid-fa6-pro/duotone/hashtag";
import CaretLeft from "solid-fa6-pro/solid/caret-left";
import Stopwatch from "solid-fa6-pro/duotone/stopwatch";
import CaretRight from "solid-fa6-pro/solid/caret-right";
import CircleCheck from "solid-fa6-pro/duotone/circle-check";
import CircleXmark from "solid-fa6-pro/duotone/circle-xmark";
import Stopwatch_20 from "solid-fa6-pro/duotone/stopwatch-20";
import SpinnerThird from "solid-fa6-pro/duotone/spinner-third";
import { JSX, Match, ParentProps, Show, Switch, createMemo, createResource, createUniqueId } from "solid-js";
import { getAnimeWorldVideoUrl } from "../api/animeworld";
import { anim, DEFAULT_ICON_SIZE } from "solid-fa6-pro";
import { EpExp, parseEpExp } from "@seanalunni/epexp";
import { copyText, parseTime } from "../../lib/util";
import { useSearchParams } from "@solidjs/router";
import { Result } from "../../lib/result";

/** Episodio di default se non viene fornito uno esplicitamente */
const DEFAULT_EPISODE = "1°";

/** Enumeratore che rappresenta lo stato di caricamento del video */
enum State { ok, fail, loading }

/** Pagina iniziale dell'applicazione */
export default function() {
	type search = { name?: string, ep?: string, time?: string };
	const [ params, setParams ] = useSearchParams<search>();
	const [ url ] = createResource(() => Result.from(bridge(params.name, params.ep)), x => x);
	const state = createMemo(() => url.loading ? State.loading : url()!.ok ? State.ok : State.fail);
	const setEp = (f: (x: string) => string) => setParams({ ep: f(params.ep || DEFAULT_EPISODE), time: undefined } satisfies search);
	var video!: HTMLVideoElement;
	return <>
		<div class={style.host}>
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
						<ViewState state={state()} message={(url()?.err as Error)?.message} />
					</Field>
					<Field
						readOnly
						children="Url"
						placeholder="Vuoto"
						value={url()?.res}
						detail="Link diretto al video in riproduzione"
					/>
					<div class={util.control}>
						<button title="Episodio precedente" class={`${layout.align} ${color.backSecondary}`} onClick={() => setEp(x => `${x}-`)}>
							<CaretLeft />
						</button>
						<button title="Episodio successivo" class={`${layout.align} ${color.backSecondary}`} onClick={() => setEp(x => `${x}+`)}>
							<CaretRight />
						</button>
						<button title="Copia link" class={`${layout.align} ${color.backPrimary}`} onClick={() => copyText(location.href)}>
							<Link />
						</button>
						<button title="Formatta l'espressione di riferimento all'episodio" class={`${layout.align} ${color.backInfo}`} onClick={() => setEp(x => parseEpExp(x).toString())}>
							<Hashtag />
						</button>
						<button title="Scrivi il minutaggio sul link" class={`${layout.align} ${color.backSuccess}`} onClick={() => setParams({ time: video.currentTime.toString() } satisfies search)}>
							<Stopwatch_20 />
						</button>
						<Show when={params.time}>
							<button title="Cancella il minutaggio dal link" class={`${layout.align} ${color.backDanger}`} onClick={() => setParams({ time: undefined } satisfies search)}>
								<Stopwatch />
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
				class={util.input}
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

/** Icona per visualizzare uno {@link State} */
function ViewState(props: { state: State, message: string }) {
	const state = createMemo(() => props.state);
	return <>
		{/* Applico l'altezza per allineare verticalmente (Solito problema che ancora non ho capito) */}
		<span title={props.message} style={{ height: DEFAULT_ICON_SIZE }}>
			<Switch>
				<Match when={state() === State.ok}>
					<CircleCheck class={color.textSuccess} />
				</Match>
				<Match when={state() === State.fail}>
					<CircleXmark class={color.textDanger} />
				</Match>
				<Match when={state() === State.loading}>
					<SpinnerThird class={`${color.textWarning} ${anim.spin}`} />
				</Match>
			</Switch>
		</span>
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