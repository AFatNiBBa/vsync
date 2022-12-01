
const api = module.exports = require("express").Router();
const { join } = require("path");

/**
 * Fa sì che il link passi attrraverso il sito per renderlo indipendente dal visitatore
 */
const request = require("request");
api.get("/proxy", (req, res) => {
    const headers = { range: req.headers.range }; // Il range serve per prendere un pezzo di video per volta e non doverlo scaricare intero
    request
        .get(req.query.url, { headers })
        .pipe(res);
});

/**
 * Ottiene un video da animeworld basandosi sul nome della serie ed il numero dell'episodio.
 * Su Anime World le stagioni sono separate in più serie.
 * I download di animeworld non necessitano di proxy.
 */
const { executablePath } = require("puppeteer");
console.log(">>>", executablePath());

const puppeteer = require("puppeteer-extra").use(require("puppeteer-extra-plugin-stealth")());
const browser = puppeteer.launch({ args: [ '--no-sandbox' ], executablePath: executablePath() });
api.get("/animeworld/:serie/:ep", async (req, res) => {
    try // Log errore
    {
        /** @type {import("puppeteer").Page} */
        const page = await (await browser).newPage();
        const host = req.protocol + "://" + req.get('host');

        try // Smaltimento della pagina
        {
            // Ricerca serie
            const url = new URL("https://www.animeworld.tv/search");
            url.searchParams.set("keyword", req.params.serie);
            await page.goto(url.href);

            // Selezione serie
            const anime = await page.evaluate(() => document.querySelector(".film-list > .item a").href);
            await page.goto(anime);

            // Selezione episodio
            const ep = await page.evaluate(x => document.querySelector(`.server.active .episodes.range .episode a[data-episode-num="${ x }"]`).href, req.params.ep);
            await page.goto(ep);

            // Link di download
            const link = new URL(await page.evaluate(() => document.querySelector("#download .widget-body center a").href));
            link.pathname = link.searchParams.get("id");
            link.searchParams.delete("id");

            // Player con il link proxy
            const player = new URL(host);
            player.searchParams.set("link", link.href);

            res.redirect(player.href);
        }
        finally { await page.close(); }
    }
    catch { res.status(404).sendFile("error.html", { root: join(__dirname, "..") }); }
});