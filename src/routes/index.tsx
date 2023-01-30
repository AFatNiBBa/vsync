
import Input from '~/components/input';
import SubTitle from '~/components/subTitle';
import { createEffect, Switch, Match, createSignal, onMount, Show, createMemo } from 'solid-js';
import { Synchronizer, EmbedSynchronizer } from "~/lib/app/synchronizer";
import { shiftTab, copyToClipboard, createEnv } from "../lib/app/client";
import { tooltip } from '~/lib/utils'; tooltip;

enum State {
  OK = "fa-check-circle text-success",
  FAIL = "fa-times-circle text-danger",
  WAIT = "fa-spinner-third text-warning fa-spin"
}

export default function Player() {
  const [url, sync] = createEnv();
  const [state, setState] = createSignal(State.WAIT);
  
  const provider = createMemo(() => {
    if (!sync.provider) return null;
    const temp = new URL(url);
    temp.host = `api.${temp.host}`;
    return new URL(sync.provider, temp);
  });

  function copyUserUrl() {
    const out = new URL(url);
    out.searchParams.delete("pass");
    copyToClipboard(out.href);
  }

  function copyEmbedCode() {
    copyToClipboard(shiftTab`
      ${Synchronizer}
      ${EmbedSynchronizer}
      sync = new EmbedSynchronizer(
        $0, // Clicca una volta l'Elemento video e nient'altro da ispeziona elemento prima di eseguire il codice
        ${JSON.stringify(sync.room)}, // Sessione
        ${JSON.stringify(sync.pass)}, // Cancellala dal link di chi non vuoi abbia accesso
        ${JSON.stringify(sync.server)}, // Lascia stare guarda
        ${JSON.stringify(sync.delta)} // Secondi massimi di differenza tra il video di un utente e quello di un'altro
      );
    `);
  }

  createEffect(() => {
    sync.link;
    setState(State.WAIT);
  });

  const video = globalThis.video = <video controls class="w-100" src={sync.link} onLoadedData={() => setState(State.OK)} onError={() => setState(State.FAIL)} />;
  sync.initVideo(video as any);
  
  return <>
    <SubTitle> Player </SubTitle>
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

            <Input label='Stanza' value={sync._room}>
              Per guardare un video insieme dovete avere tutti la stessa.
            </Input>
            <Input label='Link Diretto Video' value={sync._link} icon={<i id="icon" class={`fad ${state()}`} />}>
              Potete averlo diverso: Il sito sincronizza lo stesso.
            </Input>
            <Input label='Password' value={sync._pass}>
              Il primo che la setta comanda (Insieme agli altri che hanno la stessa).
            </Input>

            <button use:tooltip="Condividi il tuo Link" class="btn btn-danger ml-2" onclick={() => copyToClipboard(url.href)}>Admin</button>
            <button use:tooltip="Condividi un link che non include la Password" class="btn btn-primary ml-2" onclick={copyUserUrl}>Utente</button>
            <button use:tooltip="Sincronizza video con link privati incollando questo sul loro sito" class="btn btn-info ml-2" onclick={copyEmbedCode}>Embed</button>
            <Show when={provider()}>
              <a use:tooltip="Precedente" class="btn btn-secondary ml-2" href={provider() + encodeURI("-")}>
                <i class="fa-solid fa-caret-left" />
              </a>
              <a use:tooltip="Successivo" class="btn btn-secondary ml-2" href={provider() + encodeURI("+")}>
                <i class="fa-solid fa-caret-right" />
              </a>
            </Show>
          </form>
        </div>
      </div>
    </div>
  </>
}