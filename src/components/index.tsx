
import { createEffect, Switch, Match } from 'solid-js';
import { Synchronizer, EmbedSynchronizer } from '../lib/synchronizer';
import { url, sync, shiftTab } from '../lib/env';
import Input from './input';

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
    navigator.clipboard.writeText(shiftTab`
        ${Synchronizer}
        ${EmbedSynchronizer}
        sync = new EmbedSynchronizer(
            $0, // Clicca una volta l'Elemento video e nient'altro da ispeziona elemento prima di eseguire il codice
            ${ JSON.stringify(sync.room) }, // Sessione
            ${ JSON.stringify(sync.pass) }, // Cancellala dal link di chi non vuoi abbia accesso
            ${ JSON.stringify(sync.server) }, // Lascia stare guarda
            ${ JSON.stringify(sync.delta) } // Secondi massimi di differenza tra il video di un utente e quello di un'altro
        );
    `);
}

export default function App() {
    const icon = <i id="icon" class={`fad ${ State.WAIT }`}></i>;
    const video = globalThis.video = <video controls class="w-100" src={sync.link} onLoadedData={() => onSourceChanged(State.OK)} onError={() => onSourceChanged(State.FAIL)} />;
    sync.initVideo(video as any);

    function onSourceChanged(state: State) {
        $(icon as any).removeClass([ State.OK, State.FAIL, State.WAIT ]).addClass(state);
    }

    createEffect(() => {
        sync.link;
        onSourceChanged(State.WAIT);
    });

    return (
        <div class="container-fluid mt-5">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-sm-10">
                    {video}
                </div>
                <div class="col-lg-5 col-sm-10">
                    <form>
                        <div class="mb-4">
                            <Switch fallback={<> Ci sono <b>{sync.users}</b> utenti connessi </>}>
                                <Match when={sync.users === 0}>
                                    La stanza è <b>vuota</b>, come è possibile?!
                                </Match>
                                <Match when={sync.users === 1}>
                                    Sei <b>l'unico</b> utente connesso
                                </Match>
                            </Switch>
                        </div>

                        <Input name='room' label='Stampa' value={sync._room}>
                            Per guardare un video insieme dovete avere tutti la stessa.
                        </Input>
                        <Input name='link' label='Link Diretto Video' value={sync._link} icon={icon}>
                            Potete averlo diverso: Il sito sincronizza lo stesso.
                        </Input>
                        <Input name='pass' label='Password' value={sync._pass}>
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