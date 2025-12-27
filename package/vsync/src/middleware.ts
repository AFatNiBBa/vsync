
import { createMiddleware } from "@solidjs/start/middleware";
import { readFile } from "fs/promises";
import { dirname, join } from "path";

/**
 * Middleware che si assicura che tutti i file dentro la cartella public vengano effettivamente resi pubblici.
 * Il server, si salva su un JSON tutti i file che erano presenti quando si è buildato il progetto, e le robe dinamiche (Che non sono presenti in quel JSON) non vengono servite.
 * Nello specifico viene usato per i file creati da "certbot" per la verifica del dominio
 */
export default createMiddleware({
  async onRequest(event) {
		if (!import.meta.env.PROD) return;
		const url = new URL(event.request.url);
		if (url.pathname.includes("..")) return;
		const entryPoint = process.argv[1];
		const publicFolder = join(dirname(entryPoint), "../public");
		const filePath = join(publicFolder, url.pathname);
		const content = await readFile(filePath).catch(() => null);
		if (!content) return;
		return new Response(content);
  }
});