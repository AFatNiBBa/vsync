
import { parse, HTMLElement } from "node-html-parser";
import { fromProxy, toProxy } from "./url";

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
async function getPage(url: URL) {
  const res = await fetch(url, { headers: { "Cookie": "PHPSESSID=2o317umn7o646mdq9g81ligaqf" } });
  return parse(await res.text());
}

/**
 * Ottiene il link del flusso video di un episodio da "https://www.animeworld.tv"
 * @param name Nome della stagione della serie
 * @param ep Episodio della serie
 */
export default async function getAnimeUrl(name: string, ep: string | number) {
  try
  {
    // Generazione indirizzo di ricerca
    const url = new URL("https://www.animeworld.tv/search");
    url.searchParams.set("keyword", name);
    
    // Ricerca passando per proxy
    const base = toProxy(url);
    const search = await getPage(base);
    
    // Selezione serie
    const serie = await getPage(getHref(base, search.querySelector(".film-list > .item a")));
    
    // Selezione episodio (Se è già selezionato, salta)
    const btnEp = serie.querySelector(`.server.active .episodes.range .episode a[data-episode-num="${ ep }"]`);
    const episodio = btnEp.classNames.includes("active") ? serie : await getPage(getHref(base, btnEp));

    // Estrazione link di download da quello con il proxy
    const btnDownload2 = episodio.querySelector("#alternativeDownloadLink");
    return fromProxy(getHref(base, btnDownload2));
  }
  catch (e) { return console.error(e), null; }
}