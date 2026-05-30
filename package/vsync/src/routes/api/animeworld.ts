
"use server";

import { parse, HTMLElement } from "node-html-parser";
import { EpExp, parseEpExp } from "@seanalunni/epexp";
import { APIEvent } from "@solidjs/start/server";
import { fetch as fetchHttp2 } from "fetch-h2";
import { json } from "@solidjs/router";

/** Costanti necessarie alla ricerca di una serie */
const URL_RICERCA = new URL("https://www.animeworld.so/filter?sort=2"), URL_RICERCA_PARAM = "keyword";

/** Costanti necessarie alla ricerca di una episodio */
const URL_API = new URL("/api/episode/info", URL_RICERCA.origin), URL_API_PARAM = "id";

/** Chiavi degli attributi utilizzati nei bottoni degli episodi */
const ATTR_EP_NUM = "data-episode-num", ATTR_EP_ID = "data-id";

/**
 * Esegue {@link parse} sul risultato di {@link fetchHttp2}.
 * Non si usa {@link fetch} perchè ora AnimeWorld:
 * - Supporta solo HTTP/2
 * - Richiede che sia settato un certo cookie per funzionare
 * Il cookie viene preso la prima volta che viene effettuata una richiesta con un cookie sbagliato, {@link fetchHttp2} lo mantiene automaticamente ed esegue i dovuti redirect per eseguire nuovamente la richiesta in maniera trasparente ora che si ha il cookie giusto.
 * Il cookie inizia con "SecurityAW-" ma il suffisso sembra cambiare sporadicamente
 * @param url Link della pagina della quale ottenere il DOM
 */
const html = (url: URL) => fetchHttp2(url.href, { redirect: "follow" }).then(x => x.text()).then(parse);

/**
 * Ottiene il link di un {@link HTMLAnchorElement} sotto forma di {@link URL} assoluto basandosi su {@link URL_RICERCA.origin}
 * @param elm L'elemento dal quale ottenere il link
 */
const href = (elm: HTMLElement) => new URL(elm.getAttribute("href")!, URL_RICERCA.origin);

/**
 * Ottiene l'url di un episodio di una serie su AnimeWorld
 * @param name Nome dell'anime dal quale ottenere il video di uno dei suoi episodi
 * @param ep Episodio desiderato, di default è il primo
 */
export async function getAnimeWorldVideoUrl(name: string, ep: number | EpExp = 0) {
	URL_RICERCA.searchParams.set(URL_RICERCA_PARAM, name);
	const searchPage = await html(URL_RICERCA);	
	const showButton = searchPage.querySelector(".film-list > .item a");
	if (!showButton) throw new Error("Serie non trovata");
	const showPage = await html(href(showButton));
	const episodeList = showPage.querySelectorAll(`.server.active .episodes.range .episode a[${ATTR_EP_NUM}]`);
	const episodeButton = typeof ep === "number" ? episodeList[ep] : ep.get(episodeList, x => x.getAttribute(ATTR_EP_NUM)!)!;
	if (!episodeButton) throw new Error("Episodio non trovato");
	URL_API.searchParams.set(URL_API_PARAM, episodeButton.getAttribute(ATTR_EP_ID)!);
	const episodeInfo = await fetch(URL_API).then<{ grabber: string }>(x => x.json());
	return new URL(episodeInfo.grabber);
}

/**
 * Endpoint per eseguire {@link getAnimeWorldVideoUrl}.
 * Restituisce un {@link Result} che restituisce o l'url o la stringa di errore
 */
export async function GET(event: APIEvent) {	
	try
	{
		const url = new URL(event.request.url);
		const name = url.searchParams.get("name");
		if (!name) throw new ReferenceError("Manca il nome della serie");
		const ep = url.searchParams.get("ep");
		const expr = ep == null ? undefined : parseEpExp(ep);
		const res = await getAnimeWorldVideoUrl(name, expr);
		return json(res.href);
	}
	catch (err)
	{
		const headers = new Headers();
		headers.set("Content-Type", "text/plain");
		return new Response((err as Error).stack, { headers, status: 500 });
	}
}