
import getAnimeUrl from "./animeworld";
import subdomain from "express-subdomain";
import { getSubDomainOffset, getSubDomainLength, hostLink, errorLink } from "./url";
import { createRequire } from "module"
import { Router } from "express";

const require = createRequire(import.meta.url); // Viene usato il "require()" per non includere nel bundle un certo modulo
const request: typeof import("request") = require("request");

/** Crea il router per il sottodominio "api" */
export default function getApi() {
  const api = Router();

  // Codice della pagina contenuto nel link
  api.get("/eval", (req, res) => 
    res.send(`<script>eval(${ JSON.stringify(req.query.code).replace(/<\/script>/g, "<\\/script>") } )</script>`)
  );

  // Proxy verso l'indirizzo codificato nel subdominio
  api.use(subdomain("proxy", async (req, res, _) => {
    const { hostname } = req;
    const offset = getSubDomainOffset(hostname) + 2;                        // Salta anche "proxy.api"
    const length = getSubDomainLength(hostname, offset);                    // Ottiene la lunghezza del sottodominio all'interno del dominio intero
    const target = hostname.substring(0, (length % hostname.length) - 1);   // Salta il punto alla fine (Esempio: "blah.blah.") e ritorna una stringa vuota nel caso in cui non sia stato specificato l'host (La lunghezza del sottodominio è la stessa del dominio)
    if (!target)
      return void res.redirect(errorLink(req, 400, "Host non impostato"));

    const headers = { range: req.headers.range };                           // Viene mantenuto l'header che permette di ottenere le robe a chunk
    const { href } = new URL(req.url, `http://${ target }`);
    await new Promise((t, c) =>                                             // Viene sincronizzato per poter catchare l'eccezione se schioppa
      request
        .get(href, { headers }, e => e && c(e))
        .pipe(res)
        .on("finish", t));
  }));

  // Reindirizza al player
  api.get("/animeworld/:name/:ep", async (req, res) => {
    const { name, ep } = req.params;
    const url = await getAnimeUrl(name, ep);
    if (url == null) 
      return void res.redirect(errorLink(req, 404, "Anime non trovato"));
    
    const host = hostLink(req);
    host.searchParams.set("link", url.href);
    res.redirect(host.href);
  });

  // Ottieni link episodio
  api.get("/animeworld/:name/:ep/raw", async (req, res) => {
    const { name, ep } = req.params;
    res.status(500).json(await getAnimeUrl(name, ep));
  });

  return api;
}