
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";

import { parseTime, registerMediaShortcut } from "../lib/util";
import { createMemo, createResource, on } from "solid-js";
import { getAnimeWorldVideoUrl } from "./api/animeworld";
import { EpExp, parseEpExp } from "@seanalunni/epexp";
import { WinBase } from "~/component/winBase/winBase";
import { useSearchParams } from "@solidjs/router";
import { Field } from "~/component/field/field";
import { Footer } from "~/component/footer";
import { Result } from "../lib/result";
import { Title } from "@solidjs/meta";
import { anim } from "font-class";
import { Icon } from "~/lib/icon";

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
	var video: HTMLVideoElement;
	return <>
		<Title>Vsync{params.name ? ` - ${params.name}` : ""}</Title>
		<WinBase
			player={<>
				<video
					controls
					class={layout.stretch}
					src={url()?.res ?? ""} // Se l'url non viene trovato ci mette la stringa vuota perchè se ci andava a finire `undefined` toglieva tutto l'attributo ma non il video vecchio
					ref={x => {
						video = x;
						registerMediaShortcut(x);
						if (!params.time) return;
						x.currentTime = parseTime(params.time);
					}}
				/>
			</>}
			children={<>
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
					Episodio <ViewState state={state()} message={(url()?.err as Error)?.message} />
				</Field>
				<Field
					readOnly
					children="Url"
					placeholder="Vuoto"
					value={url()?.res}
					detail="Link diretto al video in riproduzione"
				/>
				<Footer
					hasTime={!!params.time}
					onEpShift={k => setEp(x => `${x}${k < 0 ? "-".repeat(-k) : "+".repeat(k)}`)}
					onTimeSave={() => setParams({ time: video.currentTime.toString() } satisfies search)}
					onTimeReset={() => setParams({ time: undefined } satisfies search)}
					children={<>
						<button title="Formatta l'espressione di riferimento all'episodio" class={color.backInfo} onClick={() => setEp(x => parseEpExp(x).toString())}>
							<span class={Icon.hashtag} />
						</button>
					</>}
				/>
			</>}
		/>
	</>
}

/** Icona per visualizzare uno {@link State} */
function ViewState(props: { state: State, message: string }) {
	const style = createMemo(on(() => props.state, x => {
		switch (x) {
			case State.ok: return `${Icon.circleCheck} ${color.textSuccess}`;
			case State.fail: return `${Icon.circleXmark} ${color.textDanger}`;
			case State.loading: return `${Icon.spinnerThird} ${color.textWarning} ${anim.spin}`;
			default: return `${Icon.circleQuestion} ${color.textSecondary}`;
		}
	}));
	return <span title={props.message} class={style()} />
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