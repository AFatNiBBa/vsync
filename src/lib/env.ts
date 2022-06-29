
import { createEffect } from "solid-js";
import { ReactiveSynchronizer } from './synchronizer';

export function shiftTab(template: TemplateStringsArray, ...args: any[]) {
    var out = "";
    const search = template[0].match(/((?!\n)\s)*?(?=\S|$)/s)[0];
    for (var i = 0; i < template.length; i++)
        out += template[i].replaceAll(search, "") + (args[i] ?? "");
    return out.trim();
}

export const url = new URL(globalThis.location.href);
export const sync = globalThis.sync = new ReactiveSynchronizer(url.searchParams.get("room"), url.searchParams.get("pass"), url.searchParams.get("link"));

sync.room ??= ReactiveSynchronizer.uuid();
sync.link ??= "https://server7.streamingaw.online/DDL/ANIME/SpyXFamilyAW/SpyXFamily_Ep_01_SUB_ITA.mp4"

createEffect(() => {
    for (const k of [ "room", "link", "pass" ])
        url.searchParams[sync[k] ? "set" : "delete"](k, sync[k]);    
    sync.send();
    history.pushState({}, "", url.href);
});