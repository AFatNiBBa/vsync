
import { APIEvent } from "@solidjs/start/server";

/** Endpoint che permette di creare una pagina HTML basata sui parametri passati */
export function GET(event: APIEvent) {
	const url = new URL(event.request.url);
	const html = url.searchParams.get("html");
	const js = url.searchParams.get("js");
	const code = `${html || ""}<script>${js || ""}</script>`;
	const headers = new Headers();
	headers.set("Content-Type", "text/html");
	return new Response(code, { headers })
}