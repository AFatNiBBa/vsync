
// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

mount(() => <StartClient />, document.body); // Se ti attacchi al documento direttamente non funzionano i redirect lato client