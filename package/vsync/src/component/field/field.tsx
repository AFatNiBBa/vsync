
import style from "./field.module.scss";
import util from "../../style/util.module.scss";

import { ParentProps, JSX, createUniqueId } from "solid-js";

/** Componente che rappresenta un campo da input della pagina */
export function Field(props: ParentProps<{ type?: string, value?: string, onInput?(x: string): void, detail?: JSX.Element, placeholder?: string, readOnly?: boolean }>) {
	const id = createUniqueId();
	return <>
		<div class={style.field}>
			<label for={id}>
				<h4>{props.children}</h4>
			</label>
			<input
				id={id}
				type={props.type}
				class={util.input}
				readOnly={props.readOnly}
				placeholder={props.placeholder}
				value={props.value ?? ""}
				onChange={e => props.onInput?.(e.target.value)}
			/>
			<small>{props.detail}</small>
		</div>
	</>
}