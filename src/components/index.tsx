
import { args, url } from '../lib/env';
import Synchronizer from '../lib/synchronizer';
import Input from './input';

declare const sync: Synchronizer;
declare const $: JQueryStatic;

function user() {
    const out = new URL(url);
    out.searchParams.delete("pass");
    navigator.clipboard.writeText(out.href);
}

function embed() {
    navigator.clipboard.writeText(`window.Synchronizer ??= ${ Synchronizer.toString() }\nsync = new Synchronizer(\n\t${
        [
            `$0, // Clicca una volta l'Elemento video e nient'altro da ispeziona elemento prima di eseguire il codice`,
            `${ JSON.stringify(sync.room) }, // Sessione`,
            `${ JSON.stringify(sync.pass) }, // Cancellala dal link di chi non vuoi abbia accesso`,
            `${ JSON.stringify(sync.server) }, // Lascia stare guarda`,
            `${ JSON.stringify(sync.delta) } // Secondi massimi di differenza tra il video di un utente e quello di un'altro`,
        ].join("\n\t")
    }\n);`);
}

export default function App() {
    const icon = <i id="icon" class="fad fa-check-circle text-success"></i>;
    const submit = <button type="submit" title="Applica le Impostazioni." class="btn btn-secondary"> Aggiorna </button>;

    function change() {
        submit.classList.remove("btn-secondary");
        submit.classList.add("btn-warning");
        submit.innerHTML = 'Aggiorna<span class="text-danger font-weight-bold">*</span>';
    }

    return (
        <div class="container-fluid mt-5">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-sm-10">
                    <video controls class="w-100">
                        <source onerror={() => $(icon).removeClass("fa-check-circle").removeClass("text-success").addClass("fa-times-circle").addClass("text-danger")} type="video/mp4" src={args.link}></source>
                    </video>
                </div>
                <div class="col-lg-5 col-sm-10">
                    <form>
                        <Input name='room' label='Stampa' value={args.room} onChange={change}>
                            Per guardare un video insieme dovete avere tutti la stessa.
                        </Input>
                        <Input name='link' label='Link Diretto Video' value={args.link} icon={icon} onChange={change}>
                            Potete averlo diverso: Il sito sincronizza lo stesso.
                        </Input>
                        <Input name='pass' label='Password' value={args.pass} onChange={change}>
                            Il primo che la setta comanda (Insime agli altri che hanno la stessa).
                        </Input>

                        { submit }
                        <input type="button" value="Admin" title="Condividi il tuo Link." class="btn btn-danger ml-2" onclick={() => navigator.clipboard.writeText(url.href)} />
                        <input type="button" value="Utente" title="Condividi un link che non include la Password." class="btn btn-primary ml-2" onclick={user} />
                        <input type="button" value="Embed" title="Sincronizza video con link privati incollando questo sul loro sito." class="btn btn-info ml-2" onclick={embed} />
                    </form>
                </div>
            </div>
        </div>
    );
}