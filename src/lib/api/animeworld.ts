
import { parse, HTMLElement } from "node-html-parser";
import { encode, decode } from "base64-url";

function toProxy(url: URL) {
  return url;
  return new URL(`https://www.hidemyass-freeproxy.com/proxy/en-ww/${ encode(url.href) }?agreed=1`);
}

function fromProxy(url: URL) {
  return url;
  return new URL(decode(url.href.match(/([^/]*)$/)[1]));
}

function getHref(baseUrl: URL, elem: HTMLElement) {
  return new URL(elem.attrs["href"], baseUrl);
}

async function getPage(url: URL) {
  const x = await fetch(url);
  const data = await x.text();
  return parse(data);
}

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
    const stagione = await getPage(getHref(base, search.querySelector(".film-list > .item a")));
    
    // Selezione episodio (Se è già selezionato, salta)
    const btnEp = stagione.querySelector(`.server.active .episodes.range .episode a[data-episode-num="${ ep }"]`);
    const episodio = btnEp.classNames.includes("active") ? stagione : await getPage(getHref(base, btnEp));

    // Estrazione link di download da quello con il proxy
    const btnDownload2 = episodio.querySelector("#alternativeDownloadLink");
    return fromProxy(getHref(base, btnDownload2));
  }
  catch (e) { return console.error(e), null; }
}