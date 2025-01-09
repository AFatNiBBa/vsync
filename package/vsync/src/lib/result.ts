
/** Tipo che rappresenta il risultato di un'operazione che può non essere andata a buon fine */
export type Result<T, E = unknown> = { ok: true, res: T, err?: undefined } | { ok: false, res?: undefined, err: E };

/** Funzioni di utility per lavorare con i {@link Result} */
export namespace Result {
	
	/**
	 * Ottiene un {@link Result} positivo
	 * @param res Il risultato
	 */
	export const ok = <T>(res: T): Result<T> => ({ ok: true, res });

	/**
	 * Ottiene un {@link Result} negativo
	 * @param res L'errore
	 */
	export const fail = <E>(err: E): Result<never, E> => ({ ok: false, err });

	/**
	 * Gestisce gli errori di una {@link Promise} tramite un {@link Result}
	 * @param task La {@link Promise} da catchare
	 */
	export const from = <T>(task: Promise<T>): Promise<Result<T>> => task.then(ok).catch(fail);
}