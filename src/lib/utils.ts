
import "jquery";
import "bootstrap";
import { createRenderEffect } from "solid-js";
import { setAttribute } from "solid-js/web";

declare const $: JQueryStatic;

/**
 * Genera un id univoco
 */
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, x => ((Math.random() * 16 | 0) & (x === "x" ? ~0 : 0b00001011)).toString(16));
}

/**
 * Proprietà d'estensione che aggiunge un tooltip
 */
export function tooltip(elm: Element, accessor: () => string) {
  createRenderEffect(() => setAttribute(elm, "title", accessor()));  
  $(elm).tooltip();
}

/**
 * Dichiaratore di proprietà d'estensione
 */
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      tooltip: string
    }
  }
}