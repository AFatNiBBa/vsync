
import type { WaitForOptions } from "puppeteer";
import { encode, decode } from "base64-url";
import { createRequire } from "module";

const require = createRequire(import.meta.url); // Viene usato il "require()" per non includere nel bundle un certo modulo
const puppeteerExtraPluginStealth: typeof import("puppeteer-extra-plugin-stealth") = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra: typeof import("puppeteer-extra").default = require("puppeteer-extra");
const { executablePath }: typeof import("puppeteer") = require("puppeteer");

const puppeteer = puppeteerExtra.use(puppeteerExtraPluginStealth());
const browser = puppeteer.launch({ args: [ '--no-sandbox' ], executablePath: executablePath(), headless: false });

/**
 * Ottiene il link del flusso video di un episodio da "https://www.animeworld.tv"
 * @param name Nome della stagione della serie
 * @param ep Episodio della serie
 */
export default async function getAnimeUrl(name: string, ep: string) {
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

    // Selezione episodio
    const episodio = await page.evaluate(x => (document.querySelector(`.server.active .episodes.range .episode a[data-episode-num="${ x }"]`) as HTMLAnchorElement)!.href, ep);
    await page.goto(episodio, opts);

    // Link di download estratto da quello con il proxy
    const proxy = await page.evaluate(() => (document.querySelector("#alternativeDownloadLink") as HTMLAnchorElement)!.href);
    const link = new URL(decode(proxy.match(/([^/]*)$/)[1]));
    return link;
  }
  catch (e) { return console.error(e), null; }
  finally { await page.close(); }
}