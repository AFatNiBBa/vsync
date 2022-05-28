
import { createSignal } from 'solid-js';

const target = {};
export const url = new URL(globalThis.location.href);
export const args = <{ room: string, link: string, pass: string }>new Proxy(target, { get: (t, k) => t[k][0](), set: (t, k, v) => (t[k][1](() => v), true) });

for (const k of [ "room", "link", "pass" ])
{
    const sign: [ () => string, (v: string | ((x: string) => string)) => string ] = target[k] = createSignal(url.searchParams.get(k));
    const old = sign[1];
    sign[1] = v => {
        const out = old(v);
        url.searchParams.set(k, out);
        history.replaceState({}, "", url.pathname + url.search);
        return out;
    };
}