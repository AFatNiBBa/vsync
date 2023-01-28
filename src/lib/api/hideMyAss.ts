
import { encode, decode } from "base64-url";
import { get } from "./request";

/** Sito da usare come proxy */
export const host = "https://www.hidemyass-freeproxy.com"

/**
 * Ottiene un link proxy partendo da un link normale
 * @param url Link di destinazione
 */
export function toProxy(url: URL) {
  return new URL(`${host}/proxy/en-ww/${encode(url.href)}?agreed=1`);
}

/**
 * Estrae il link da un link proxy
 * @param url Link proxy
 */
export function fromProxy(url: URL) {
  return new URL(decode(url.href.match(/([^/]*)$/)[1]));
}

/**
 * Restituisce il cookie necessario al sito proxy per funzionare.
 * È valido per l'intera sessione
 */
export async function getCookie() {
  const res = await get(host);
  const cookie = res.headers["set-cookie"]?.[0];
  return cookie.match(/PHPSESSID=[^;]+/)?.[0];
}