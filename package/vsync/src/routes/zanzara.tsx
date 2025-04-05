
import color from "@seanalunni/style/color";

import { parseTime, registerMediaShortcut } from "~/lib/util";
import { WinBase } from "~/component/winBase/winBase";
import { useSearchParams } from "@solidjs/router";
import { Field } from "~/component/field/field";
import { Footer } from "~/component/footer";
import { createMemo, on } from "solid-js";
import { Title } from "@solidjs/meta";
import { icon } from "~/lib/icon";

/** Pagina che fornisce un'episodio della zanzara */
export default function() {
	type search = { date?: string, time?: string };
	const [ params, setParams ] = useSearchParams<search>();
	const url = createMemo(on(() => params.date, x => x && getZanzaraAudioUrl(new Date(x))));
	var audio: HTMLAudioElement;
	return <>
		<Title>Vsync - La Zanzara{params.date ? ` ${params.date}` : ""}</Title>
		<WinBase 
			player={<>
				<audio
					controls
					src={url() ?? ""} // Se l'url non viene trovato ci mette la stringa vuota perchè se ci andava a finire `undefined` toglieva tutto l'attributo ma non il video vecchio}
					ref={x => {
						audio = x;
						registerMediaShortcut(x);
						if (!params.time) return;
						x.currentTime = parseTime(params.time);
					}}
				/>
			</>}
			children={<>
				<Field
					type="date"
					value={params.date}
					onInput={date => setParams({ date })}
					detail="Data dell'episodio da cercare"
				>
					Data <span class={params.date ? `${icon.circleCheck} ${color.textSuccess}` : `${icon.circleXmark} ${color.textDanger}`} />
				</Field>
				<Footer
					hasTime={!!params.time}
					onTimeSave={() => setParams({ time: audio.currentTime.toString() } satisfies search)}
					onTimeReset={() => setParams({ time: undefined } satisfies search)}
					onEpShift={k => {
						const { date } = params;
						if (!date) return;
						const temp = new Date(date);
						temp.setDate(temp.getDate() + k);
						setParams({ date: temp.toISOString().split("T")[0], time: undefined } satisfies search);
					}}
				/>
			</>}
		/>
	</>
}

/**
 * Ottiene l'url di un'episodio del podcast de La Zanzara
 * @param date La data dell'episodio
 */
function getZanzaraAudioUrl(date: Date) {
	const year = date.getFullYear();
	const pad2 = (x: number) => x.toString().padStart(2, '0');
	return `https://podcast-radio24.ilsole24ore.com/radio24_audio/${year}/${pad2(year % 100)}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}-lazanzara.mp3`;
}