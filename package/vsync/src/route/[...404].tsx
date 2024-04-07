
import { RouteSectionProps } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";

/** Pagina visualizzata quando se ne richiede una che non esiste */
export default function(props: RouteSectionProps) {
	return <>
		<HttpStatusCode code={404} />
		La pagina "{props.location.pathname}" non esiste
	</>
}