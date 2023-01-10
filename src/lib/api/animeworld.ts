
import { createRequire } from "module";

const require = createRequire(import.meta.url); // Viene usato il "require()" per non includere nel bundle un certo modulo
const puppeteerExtraPluginStealth: typeof import("puppeteer-extra-plugin-stealth") = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra: typeof import("puppeteer-extra").default = require("puppeteer-extra");
const { executablePath }: typeof import("puppeteer") = require("puppeteer");

const puppeteer = puppeteerExtra.use(puppeteerExtraPluginStealth());
const browser = puppeteer.launch({ args: [ '--no-sandbox' ], executablePath: executablePath() });

export default async function getAnimeUrl(name: string, ep: string) {
  const page = await (await browser).newPage();

  try
  {
    // Ricerca serie
    const url = new URL("https://www.animeworld.tv/search");
    url.searchParams.set("keyword", name);
    await page.goto(url.href);

    // Selezione serie
    const stagione = await page.evaluate(() => (document.querySelector(".film-list > .item a") as HTMLAnchorElement)!.href);
    await page.goto(stagione);

    // Selezione episodio
    const episodio = await page.evaluate(x => (document.querySelector(`.server.active .episodes.range .episode a[data-episode-num="${ x }"]`) as HTMLAnchorElement)!.href, ep);
    await page.goto(episodio);

    // Link di download
    const link = new URL(await page.evaluate(() => (document.querySelector("#download .widget-body center a") as HTMLAnchorElement)!.href));
    link.pathname = link.searchParams.get("id")!;
    link.searchParams.delete("id");
    return link;
  }
  catch (e) { return console.error(e), null; }
  finally { await page.close(); }
}