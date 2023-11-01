
import EpExp from "@seanalunni/epexp";
import { parse, HTMLElement } from "node-html-parser";
import { get } from "./request";

/**
 * Ottiene un link assoluto dall'attributo "href" di {@link elem}
 * @param baseUrl Url della pagina in caso si tratti di un percorso relativo
 * @param elem Probabilmente un {@link HTMLAnchorElement}
 */
function getHref(baseUrl: URL, elem: HTMLElement) {
  return new URL(elem.getAttribute("href"), baseUrl);
}

/**
 * Scarica e parsa una pagina HTML
 * @param url Link alla pagina
 */
async function getPage(url: URL): Promise<HTMLElement> {
  const res = await get(url.href);
  return parse(res.body);
}

/**
 * Ottiene il link del flusso video di un episodio da "https://www.animeworld.tv"
 * @param name Nome della stagione della serie
 * @param ep Episodio della serie
 */
export default async function getAnimeUrl(name: string, ep: string) {
  try
  {
    // Generazione indirizzo di ricerca
    const url = new URL("https://www.animeworld.tv/search");
    url.searchParams.set("keyword", name);

    // Ricerca
    const search = await getPage(url);
    
    // Selezione serie
    const serie = await getPage(getHref(url, search.querySelector(".film-list > .item a")));
    
    // Selezione episodio (Se è già selezionato, salta)
    const attr = "data-episode-num"
    const lstEp = serie.querySelectorAll(`.server.active .episodes.range .episode a[${attr}]`);
    const btnEp = new EpExp(ep).get(lstEp, x => x.getAttribute(attr));
    const episodio = btnEp.classNames.includes("active") ? serie : await getPage(getHref(url, btnEp));

    // Estrazione link di download da quello con il proxy
    const btnDownload2 = episodio.querySelector("#alternativeDownloadLink");
    return getHref(url, btnDownload2);
  }
  catch (e) { return console.error(e), null; }
}