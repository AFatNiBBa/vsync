
import { args } from "../lib/env";

type Opts = {
    name?: keyof typeof args,
    value?: string,
    label?: string,
    icon?: HTMLElement,
    onChange?: (e: Event) => void,
    children?: import("solid-js").JSX.Element
};

export default function Input(props: Opts) {
    const id = `input-${ props.name }`;    
    return (
        <div class="form-group">
            <label for={ id }>
                <h4> { props.label } { props.icon } </h4>
            </label>
            <br />
            <input id={ id } name={ props.name } value={ args[props.name] } onChange={e => args[props.name] = e.target.value} placeholder="Vuoto" class="form-control" />
            <small class="form-text text-muted"> { props.children } </small>
        </div>
    );
}