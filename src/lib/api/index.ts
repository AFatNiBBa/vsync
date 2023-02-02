
import getAnimeUrl from "./animeWorld";
import subdomain from "express-subdomain";
import { getSubDomainOffset, getSubDomainLength, hostLink, errorLink } from "./url";
import { Router } from "express";
import { pipe } from "./request";

/**
 * Crea il router per il sottodominio "api"
 */
export default function getApi() {
  const api = Router();

  // Disabilita le CORS
  api.use((_, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });

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

    const { href, host } = new URL(req.url, `http://${ target }`);
    await pipe(href, res, { headers: { ...req.headers, host } });           // Sovrascrive l'header "host" per non farlo puntare al proxy
  }));

  // Reindirizza al player
  api.get("/animeworld/:name/:ep", async (req, res) => {
    const { name, ep } = req.params;
    const url = await getAnimeUrl(name, ep);
    if (url == null) 
      return void res.redirect(errorLink(req, 404, `${ JSON.stringify(name) } ep. ${ JSON.stringify(ep) } non trovato`));
    const host = hostLink(req);
    host.searchParams.set("link", url.href);
    host.searchParams.set("provider", req.url);
    res.redirect(host.href);
  });

  // Ottieni link episodio
  api.get("/animeworld/:name/:ep/raw", async (req, res) => {
    const { name, ep } = req.params;
    const url = await getAnimeUrl(name, ep);
    if (url == null)
      res.status(500);
    res.json(url);
  });

  return api;
}
