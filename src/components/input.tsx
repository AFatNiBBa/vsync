
import { args } from "../lib/env";

type Opts = {
    name?: keyof typeof args,
    value?: string,
    label?: string,
    icon?: HTMLElement,
    onChange?: (e: Event) => void,
    children?: import("solid-js").JSX.Element
};

declare const sync: import("../lib/synchronizer").default;

export default function Input(props: Opts) {
    const id = `input-${ props.name }`;    

    function onChanged(e) {
        args[props.name] = e.target.value;  // Aggiorna i parametri dell'app
        sync.send();                        // Invia i parametri al server (Altrimenti se il video era pausato non li mandava)
        props.onChange?.(e);                // Evento custom attaccabile al controllo
    }

    return (
        <div class="form-group">
            <label for={ id }>
                <h4> { props.label } { props.icon } </h4>
            </label>
            <br />
            <input id={ id } name={ props.name } value={ args[props.name] } onChange={onChanged} placeholder="Vuoto" class="form-control" />
            <small class="form-text text-muted"> { props.children } </small>
        </div>
    );
}