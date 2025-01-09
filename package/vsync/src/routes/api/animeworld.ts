
"use server";

import { parse, HTMLElement } from "node-html-parser";
import { EpExp, parseEpExp } from "@seanalunni/epexp";
import { APIEvent } from "@solidjs/start/server";
import { json } from "@solidjs/router";
import { fetch } from "fetch-h2";

/** Costanti necessarie alla ricerca di un episodio */
const RICERCA_URL = new URL("https://www.animeworld.so/filter?sort=2"), RICERCA_QUERY_KEY = "keyword", EPISODE_NUM_ATTRIBUTE = "data-episode-num", EPISODE_ACTIVE_CLASS = "active";

/**
 * Esegue {@link parse} sul risultato di {@link fetch}.
 * Non si usa {@link globalThis.fetch} perchè ora AnimeWorld supporta solo HTTP/2
 * @param url Link della pagina della quale ottenere il DOM
 */
const html = (url: URL) => fetch(url.href, { redirect: "follow" }).then(x => x.text()).then(parse);

/**
 * Ottiene il link di un {@link HTMLAnchorElement} sotto forma di {@link URL} assoluto basandosi su {@link RICERCA_URL.origin}
 * @param elm L'elemento dal quale ottenere il link
 */
const href = (elm: HTMLElement) => new URL(elm.getAttribute("href")!, RICERCA_URL.origin);

/**
 * Ottiene l'url di un episodio di una serie su AnimeWorld
 * @param name Nome dell'anime dal quale ottenere il video di uno dei suoi episodi
 * @param ep Episodio desiderato, di default è il primo
 */
export async function getAnimeWorldVideoUrl(name: string, ep: number | EpExp = 0) {
	RICERCA_URL.searchParams.set(RICERCA_QUERY_KEY, name);
	const searchPage = await html(RICERCA_URL);	
	const showButton = searchPage.querySelector(".film-list > .item a");
	if (!showButton) throw new Error("Serie non trovata");
	const showPage = await html(href(showButton));
	const episodeList = showPage.querySelectorAll(`.server.active .episodes.range .episode a[${EPISODE_NUM_ATTRIBUTE}]`);
	const episodeButton = typeof ep === "number" ? episodeList[ep] : ep.get(episodeList, x => x.getAttribute(EPISODE_NUM_ATTRIBUTE)!)!;
	const episodePage = episodeButton.classNames.includes(EPISODE_ACTIVE_CLASS) ? showPage : await html(href(episodeButton));
	return href(episodePage.querySelector("#alternativeDownloadLink")!);
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
		const temp = await getAnimeWorldVideoUrl(name, expr);
		return json(temp.href);
	}
	catch (err)
	{
		const headers = new Headers();
		headers.set("Content-Type", "text/plain");
		return new Response((err as Error).stack, { headers, status: 500 });
	}
}