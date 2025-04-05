
import { onCleanup } from "solid-js";

/** Numero di secondi skippati quando si usano i comandi media */
const SKIP_SECONDS = 10;

/**
 * Data una stringa che rappresenta un lasso di tempo ne estrae i secondi.
 * Grazie all'algoritmo, sono permessi anche formati esotici del tipo "1.5:-16" (Che equivale ad 1 minuto e mezzo meno 16 secondi, ossia 1 minuto e 14 secondi) o "1:::" (Che equivale a 60 ore)
 * Algoritmo:
 * - La stringa viene divisa per ":"
 * - Ogni componente viene convertito in un numero, se il componente è vuoto conta come 0
 * - Ogni numero viene moltiplicato per 60 elevato all'indice dalla fine del componente corrente
 * - Tutti i numeri vengono sommati
 * @param time Il lasso di tempo
 */
export function parseTime(time: string) {
	const list = time.split(":");
	for (var i = list.length - 1, k = 0, sum = 0, elm: string; i >= 0; i--, k++)
		if (elm = list[i])
			sum += +elm * 60 ** k;
	return sum;
}

/**
 * Copia del testo nella clipboard.
 * Prova ad usare {@link navigator.clipboard} se è possibile, ma dato che c'è solo in HTTPS fornisce anche un metodo alternativo.
 * In caso venga usato il metodo alternativo, l'operazione viene completata in maniera sincrona.
 * Funzione utilizzabile solo lato client
 * @param text Il testo da copiare
 */
export async function copyText(text: string): Promise<void> {
	const { clipboard } = navigator;
	if (clipboard) return clipboard.writeText(text);
	const area = document.createElement("textarea");
	try
	{
		document.body.append(area);
		area.focus({ preventScroll: true });
		area.select();
		document.execCommand("copy");
	}
	finally { area.remove(); }
}

/**
 * Registra i comandi media per un'elemento multimediale
 * @param f Riferimento all'elemento multimediale
 */
export function registerMediaShortcut(ctrl: HTMLMediaElement) {
	const { mediaSession } = navigator;
	mediaSession.setActionHandler("previoustrack", () => ctrl.currentTime -= SKIP_SECONDS);
	mediaSession.setActionHandler("nexttrack", () => ctrl.currentTime += SKIP_SECONDS);
	onCleanup(() => {
		mediaSession.setActionHandler("previoustrack", null);
		mediaSession.setActionHandler("nexttrack", null);
	});
}