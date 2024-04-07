
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