
type Opts = {
    name?: string,
    value?: string,
    label?: string,
    icon?: HTMLElement,
    onChange?: (e: Event) => void,
    children?: any,
};

export default function Input(props: Opts) {
    const id = `input-${ props.name }`;
    const input = <input id={ id } name={ props.name } value={ props.value } onChange={ props.onChange } placeholder="Vuoto" class="form-control" />;
    console.log(props.children)
    return (
        <div class="form-group">
            <label htmlFor={ id }>
                <h4> { props.label } { props.icon } </h4>
            </label>
            <br />
            { input }
            <small class="form-text text-muted"> { props.children } </small>
        </div>
    );
}