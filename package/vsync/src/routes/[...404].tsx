
import color from "@seanalunni/style/color";
import layout from "@seanalunni/style/layout";

import { A, RouteSectionProps } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { Title } from "@solidjs/meta";
import { Icon } from "~/lib/icon";

/** Pagina visualizzata quando se ne richiede una che non esiste */
export default function(props: RouteSectionProps) {
	return <>
		<HttpStatusCode code={404} />
		<Title>Vsync - Not Found</Title>
		<div class={`${layout.root} ${layout.center}`}>
			<div style={{ "text-align": "center" }}>
				<h1 style={{ "font-size": "300%" }}>
					Errore 404 - <span class={`${Icon.fileCircleExclamation} ${color.textDanger}`} />
				</h1>
				<p>La pagina <b>"{props.location.pathname}"</b> non esiste</p>
				<A href="/?">Home</A>
			</div>
		</div>
	</>
}