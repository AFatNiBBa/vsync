
import style from "./winBase.module.scss";
import layout from "@seanalunni/style/layout";

import { JSX, ParentProps } from "solid-js";

/** Layout di base per una finestra con un player */
export function WinBase(props: ParentProps<{ player: JSX.Element }>) {
	return <>
		<div class={`${style.host} ${layout.root}`}>
			<div class={style.page}>
				{props.player}
				<div class={style.form}>
					{props.children}
				</div>
			</div>
		</div>
	</>
}