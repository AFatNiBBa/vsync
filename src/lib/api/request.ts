
import type { CoreOptions, Response as RequestResponse } from "request";
import type { Response as ExpressResponse } from "express";
import { createRequire } from "module";

// Viene usato il "require()" perchè se "request" viene incluso nel bundle da errore
const require = createRequire(import.meta.url);
const request: typeof import("request") = require("request");

/**
 * Versione con le promise di {@link request.get}
 * @param url Link a dove della destinazione della richiesta
 * @param opts Opzioni della richiesta
 * @returns La risposta alla richiesta
 */
export function get(url: string, opts?: CoreOptions) {
  return new Promise<RequestResponse>((t, c) => request.get(url, opts, (e, r) => e ? c(e) : t(r)));
}

/**
 * Come {@link get}, ma al posto di restituire la risposta la usa per valorizzare {@link res}
 * @param url Link a dove della destinazione della richiesta
 * @param res La risposta da valorizzare
 * @param opts Opzioni della richiesta
*/
export function pipe(url: string, res: ExpressResponse, opts?: CoreOptions) {
  return new Promise<void>((t, c) =>
    request
      .get(url, opts, e => e && c(e))
      .pipe(res)
      .once("finish", t));
}