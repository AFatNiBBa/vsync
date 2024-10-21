
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";

import FileCircleExclamation from "solid-fa6-pro/duotone/file-circle-exclamation";
import { A, RouteSectionProps } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server";
import { HttpStatusCode } from "@solidjs/start";
import { readFile } from "fs/promises";
import { Title } from "@solidjs/meta";
import { dirname, join } from "path";

/**
 * Endpoint che si assicura che tutti i file dentro la cartella public vengano effettivamente resi pubblici.
 * Il server, si salva su un JSON tutti i file che erano presenti quando si è buildato il progetto, e le robe dinamiche (Che non sono presenti in quel JSON) non vengono servite.
 * Nello specifico viene usato per i file creati da "certbot" per la verifica del dominio
 */
export async function GET(event: APIEvent) {
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

/** Pagina visualizzata quando se ne richiede una che non esiste */
export default function(props: RouteSectionProps) {
	return <>
		<HttpStatusCode code={404} />
		<Title>Vsync - Not Found</Title>
		<div class={layout.center} style={{ "text-align": "center" }}>
			<h1 class={layout.align} style={{ "font-size": "300%" }}>
				Errore 404 -&nbsp;<FileCircleExclamation class={color.textDanger} />
			</h1>
			<p>La pagina <b>"{props.location.pathname}"</b> non esiste</p>
			<A href="/?">Home</A>
		</div>
	</>
}