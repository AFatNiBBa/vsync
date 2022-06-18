
import { Signal } from "solid-js";

type Opts = {
    name?: string,
    value: Signal<string>,
    label?: string,
    icon?: HTMLElement,
    children?: import("solid-js").JSX.Element
};

export default function Input(props: Opts) {
    const id = `input-${ props.name }`;  
    const [ getValue, setValue ] = props.value;
    return (
        <div class="form-group">
            <label for={id}>
                <h4> {props.label} {props.icon} </h4>
            </label>
            <br />
            <input id={id} name={props.name} value={getValue()} onChange={e => setValue(e.target.value)} placeholder="Vuoto" class="form-control" />
            <small class="form-text text-muted"> {props.children} </small>
        </div>
    );
}