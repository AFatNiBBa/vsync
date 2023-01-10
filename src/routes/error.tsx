
import SubTitle from "~/components/subTitle";
import { HttpStatusCode } from "solid-start/server";
import { useSearchParams } from "solid-start";
import { JSX } from "solid-js";

const ERRORE_CODICE_STRINGA = 499;

export function getDefaultIcon(code: number) {
  switch (code) {
    case 200: return "fa-duotone fa-circle-check text-success";
    case 400: return "fa-duotone fa-face-confused text-danger";
    case 404: return "fa-duotone fa-file-circle-exclamation text-danger";
    case ERRORE_CODICE_STRINGA: return "fa-duotone fa-hashtag text-primary"; // Errore che viene emesso se il codice errore è una stringa
    case 500: return "fa-duotone fa-bomb text-danger";
    default: return "fa-duotone fa-circle-question";
  }
}

export function getDefaultDex(code: number): JSX.Element {
  switch (code) {
    case 200: return "Non c'è nessun errore, ma sei qui comunque, strano...";
    case 400: return "Richiesta percepita come senza senso";
    case 404: return "La pagina non è stata trovata";
    case ERRORE_CODICE_STRINGA: return "È stato inserito un codice errore non numerico";
    case 500: return "È schioppato";
    default: return "Errore sconosciuto";
  }
}

export default function Error(props: { code?: number, icon?: string, children?: JSX.Element }) {
  const [ search ] = useSearchParams<{ code?: string, icon?: string, dex?: string }>();
  const code = () => (props.code ?? +search.code!) || ERRORE_CODICE_STRINGA;
  return <>
    <SubTitle> Errore </SubTitle>
    <HttpStatusCode code={code()} />
    <div class="d-flex flex-row align-items-center" style={{ "min-height": "100vh" }}>
      <style textContent="body { background: #dedede; }" />
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-12 text-center">
            <span class="display-1 d-block">
              Errore {code()} - <i class={`${props.icon ?? search.icon ?? getDefaultIcon(code())} text-75`}></i>
            </span>
            <div class="mt-2 mb-2 lead">
              {props.children ?? search.dex ?? getDefaultDex(code())}
            </div>
            <a href="/?" class="btn btn-link">Home</a>
          </div>
        </div>
      </div>
    </div>
  </>
}