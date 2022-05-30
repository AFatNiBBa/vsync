
import { args, url } from '../lib/env';
import Synchronizer from '../lib/synchronizer';
import Input from './input';

declare const sync: Synchronizer;
declare const $: JQueryStatic;

enum State {
    OK = "fa-check-circle text-success",
    FAIL = "fa-times-circle text-danger",
    WAIT = "fa-spinner-third text-warning fa-spin"
}

function copyUserUrl() {
    const out = new URL(url);
    out.searchParams.delete("pass");
    navigator.clipboard.writeText(out.href);
}

function copyEmbedCode() {
    navigator.clipboard.writeText(`window.Synchronizer ??= ${ Synchronizer.toString() }\nsync = new Synchronizer(\n\t${
        [
            `$0, // Clicca una volta l'Elemento video e nient'altro da ispeziona elemento prima di eseguire il codice`,
            `{\n\t\t${
                [
                    `room: ${ JSON.stringify(sync.target.room) }, // Sessione`,
                    `pass: ${ JSON.stringify(sync.target.pass) } // Cancellala dal link di chi non vuoi abbia accesso`,
                ].join("\n\t\t")
            }\n\t},`,
            `${ JSON.stringify(sync.server) }, // Lascia stare guarda`,
            `${ JSON.stringify(sync.delta) } // Secondi massimi di differenza tra il video di un utente e quello di un'altro`,
        ].join("\n\t")
    }\n);`);
}

export default function App() {
    const icon = <i id="icon" class={`fad ${ State.WAIT }`}></i>;

    function onSourceChanged(state: State) {
        $(icon).removeClass([ State.OK, State.FAIL, State.WAIT ]).addClass(state);
    }

    return (
        <div class="container-fluid mt-5">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-sm-10">
                    <video controls class="w-100" src={args.link} onLoadedData={() => onSourceChanged(State.OK)} onError={() => onSourceChanged(State.FAIL)} />
                </div>
                <div class="col-lg-5 col-sm-10">
                    <form>
                        <Input name='room' label='Stampa' value={args.room}>
                            Per guardare un video insieme dovete avere tutti la stessa.
                        </Input>
                        <Input name='link' label='Link Diretto Video' value={args.link} icon={icon} onChange={() => onSourceChanged(State.WAIT)}>
                            Potete averlo diverso: Il sito sincronizza lo stesso.
                        </Input>
                        <Input name='pass' label='Password' value={args.pass}>
                            Il primo che la setta comanda (Insieme agli altri che hanno la stessa).
                        </Input>

                        <input type="button" value="Admin" title="Condividi il tuo Link." class="btn btn-danger ml-2" onclick={() => navigator.clipboard.writeText(url.href)} />
                        <input type="button" value="Utente" title="Condividi un link che non include la Password." class="btn btn-primary ml-2" onclick={copyUserUrl} />
                        <input type="button" value="Embed" title="Sincronizza video con link privati incollando questo sul loro sito." class="btn btn-info ml-2" onclick={copyEmbedCode} />
                    </form>
                </div>
            </div>
        </div>
    );
}