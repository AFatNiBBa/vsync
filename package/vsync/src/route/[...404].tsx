
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";

import { A, RouteSectionProps } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";

/** Pagina visualizzata quando se ne richiede una che non esiste */
export default function(props: RouteSectionProps) {
	return <>
		<HttpStatusCode code={404} />
		<div class={`${layout.stretch} ${layout.center}`} style={{ background: "#dedede" }}>
			<div style={{ "text-align": "center" }}>
				<h1 style={{ "font-size": "3em" }}>
					Errore 404 -&nbsp;
					<i class={`fa-duotone fa-file-circle-exclamation ${color.textDanger}`} />
				</h1>
				<p>La pagina <b>"{props.location.pathname}"</b> non esiste</p>
				<A href="/?">Home</A>
			</div>
		</div>
	</>
}