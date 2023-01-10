
import { splitProps, Signal, JSX } from "solid-js";

type Opts = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value"> & {
  value: Signal<string>,
  label?: string,
  icon?: JSX.Element,
  children?: JSX.Element
};

export default function Input(props: Opts) {
  const id = crypto.randomUUID();
  const [local, other] = splitProps(props, ["value", "label", "icon", "children", "class"]);
  return (
    <div class="form-group">
      <label for={id}>
        <h4> {local.label} {local.icon} </h4>
      </label>
      <br />
      <input
        {...other}
        id={id}
        value={local.value[0]()}
        onChange={e => local.value[1]((e.target as HTMLInputElement).value)}
        placeholder="Vuoto"
        class={`form-control ${local.class}`}
      />
      <small class="form-text text-muted"> {local.children} </small>
    </div>
  );
}