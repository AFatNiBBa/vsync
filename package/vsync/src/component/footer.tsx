
import color from "@seanalunni/style/color";
import util from "../style/util.module.scss";

import { ParentProps, Show } from "solid-js";
import { copyText } from "~/lib/util";
import { icon } from "~/lib/icon";

/** Controlli comuni dei player */
export function Footer(props: ParentProps<{ hasTime: boolean, onEpShift(x: number): void, onTimeSave(): void, onTimeReset(): void }>) {
	return <>
		<div class={util.control}>
			<button title="Episodio precedente" class={color.backSecondary} onClick={() => props.onEpShift(-1)}>
				<span class={icon.caretLeft} />
			</button>
			<button title="Episodio successivo" class={color.backSecondary} onClick={() => props.onEpShift(1)}>
				<span class={icon.caretRight} />
			</button>
			<button title="Copia link" class={color.backPrimary} onClick={() => copyText(location.href)}>
				<span class={icon.link} />
			</button>
			<button title="Scrivi il minutaggio sul link" class={color.backSuccess} onClick={() => props.onTimeSave()}>
				<span class={icon.stopwatch_20} />
			</button>
			<Show when={props.hasTime}>
				<button title="Cancella il minutaggio dal link" class={color.backDanger} onClick={() => props.onTimeReset()}>
					<span class={icon.stopwatch} />
				</button>
			</Show>
			{props.children}
		</div>
	</>
}