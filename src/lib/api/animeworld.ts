
import type { Browser, WaitForOptions } from "puppeteer";
import { encode, decode } from "base64-url";
import { createRequire } from "module";

const require = createRequire(import.meta.url); // Viene usato il "require()" per non includere nel bundle un certo modulo
const puppeteerExtraPluginStealth: typeof import("puppeteer-extra-plugin-stealth") = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra: typeof import("puppeteer-extra").default = require("puppeteer-extra");
const { executablePath }: typeof import("puppeteer") = require("puppeteer");

const puppeteer = puppeteerExtra.use(puppeteerExtraPluginStealth());
var browser: Promise<Browser>;

/**
 * Funzione lato client che valuta un episodio
 * @param ep Episodio
 * @returns Il link all'episodio ed un {@link Boolean} che indica se si tratta di quello attivo
 */
function checkEpisode(ep: string) {
  const elm = document.querySelector(`.server.active .episodes.range .episode a[data-episode-num="${ ep }"]`);
  return [ (elm as HTMLAnchorElement)!.href, elm.matches(".active") ] as const;
}

/**
 * Ottiene il link del flusso video di un episodio da "https://www.animeworld.tv"
 * @param name Nome della stagione della serie
 * @param ep Episodio della serie
 */
export default async function getAnimeUrl(name: string, ep: string) {
  browser ??= puppeteer.launch({ args: [ '--no-sandbox' ], executablePath: executablePath() });
  const page = await (await browser).newPage();
  const opts: WaitForOptions = { waitUntil: "domcontentloaded" };

  try
  {
    // Ricerca serie
    const url = new URL("https://www.animeworld.tv/search");
    url.searchParams.set("keyword", name);

    // Passaggio per proxy
    await page.goto(`https://www.hidemyass-freeproxy.com/proxy/en-ww/${ encode(url.href) }?agreed=1`, opts);
    
    // Selezione serie
    const stagione = await page.evaluate(() => (document.querySelector(".film-list > .item a") as HTMLAnchorElement)!.href);
    await page.goto(stagione, opts);
    
    // Selezione episodio (Se è già selezionato, salta)
    const [ episodio, active ] = await page.evaluate(checkEpisode, ep);
    if (!active) await page.goto(episodio, opts);

    // Link di download estratto da quello con il proxy
    const proxy = await page.evaluate(() => (document.querySelector("#alternativeDownloadLink") as HTMLAnchorElement)!.href);
    const link = new URL(decode(proxy.match(/([^/]*)$/)[1]));
    return link;
  }
  catch (e) { return console.error(e), null; }
  finally { await page.close(); }
}