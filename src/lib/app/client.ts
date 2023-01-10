
import { ReactiveSynchronizer } from "~/lib/app/synchronizer";
import { createEffect } from "solid-js";

globalThis.onpopstate = () => globalThis.location.reload();

export function shiftTab(template: TemplateStringsArray, ...args: any[]) {
  var out = "";
  const search = template[0].match(/((?!\n)\s)*?(?=\S|$)/s)[0];
  for (var i = 0; i < template.length; i++)
    out += template[i].replaceAll(search, "") + (args[i] ?? "");
  return out.trim();
}

export function copyToClipboard(str: string) {
  const elm = document.createElement('textarea');
  elm.style.opacity = "0";
  elm.readOnly = true;
  elm.value = str;
  document.body.appendChild(elm);
  try
  {
    elm.select();
    document.execCommand("copy");
  }
  finally { elm.remove(); }
}

export function createEnv(): [ URL, ReactiveSynchronizer ] {

  const url = new URL(globalThis.location.href);
  const sync = globalThis.sync = new ReactiveSynchronizer(url.searchParams.get("room"), url.searchParams.get("pass"), url.searchParams.get("link"));

  sync.room ??= crypto.randomUUID();
  sync.link ??= "https://server6.streamingaw.online/DDL/ANIME/SpyXFamily/SpyXFamily_Ep_01_SUB_ITA.mp4"

  createEffect(() => {
    for (const k of ["room", "link", "pass"])
      url.searchParams[sync[k] ? "set" : "delete"](k, sync[k]);
    history.pushState(null, null, url.href);
    sync.send();
  });

  return [ url, sync ];
}