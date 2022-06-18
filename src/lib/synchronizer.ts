
import { createSignal } from "solid-js";

type State = { room?: string, paused?: boolean, time?: number };

export abstract class Synchronizer {
    _lock = 0;
    video: HTMLVideoElement;
    socket: WebSocket;
    onUpdate?: (x: any) => void;

    abstract room: string;

    abstract pass: string;

    get state(): State & { pass: string } { return { room: this.room, pass: this.pass, paused: this.video.paused, time: this.video.currentTime }; }

    /**
     * @param server Link del server che eseguirà la sincronizzazione
     * @param delta Tempo di desincronizzazione massima (in secondi) dal server
     */
    constructor(public server: string = Synchronizer.url(), public delta: number = 1) {
        this.socket = new WebSocket(this.server);
        this.socket.onopen = () => {
            const id = setInterval(() => this.socket.send("alive"), 1000);
            this.socket.onclose = () => clearInterval(id);
            this.socket.onmessage = async x => {
                this._lock++;
                try
                {
                    const { video } = this;
                    if (!video) return;

                    const obj: State = JSON.parse(x.data);
                    this.onUpdate?.(obj);

                    if (obj.paused !== video.paused)
                        if (video.paused)
                            await video.play().catch(() => { });
                        else
                            video.pause();

                    if (Math.abs(video.currentTime - obj.time) > this.delta)
                        video.currentTime = obj.time;
                }
                finally { this._lock--; } // La funzione "video.play()" è asincrona, perciò "_lock" veniva diminuito prima della sua esecuzione senza 'await'
            };
            
            this.send({ room: this.room });
        };
    }

    /** Imposta l'elemento video da sincronizzare (Eseguire appena disponibile) */
    initVideo(video: HTMLVideoElement) {
        video.onplay =  // ↓
        video.onpause = // ↓
        (this.video = video).ontimeupdate = () => this.send();
    }

    /** Manda un pacchetto di aggiornamento con password, tempo corrente e tipo del pacchetto */
    send(obj?: State) {
        if (!this._lock && this.video && this.socket.readyState === WebSocket.OPEN)
            this.socket.send(JSON.stringify(obj ?? this.state));
    }

    /** Genera l'url del server dando per scontato che si trova sul server corrente */
    static url() { return `ws${ location.protocol == "https:" ? "s" : "" }://${ location.hostname }${ location.port && `:${ location.port }` }`; }

    /** Universally Unique ID v4 */
    static uuid() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, x => ((Math.random() * 16 | 0) & (x === "x" ? ~0 : 0b00001011)).toString(16)); }
}

export class EmbedSynchronizer extends Synchronizer {
    /**
     * Versione di embed del {@link Synchronizer}
     * @param video Elemento video da controllare
     * @param room Sessione all'interno della quale si trovano tutti gli utenti con i quali si desidera sincronizzarsi
     * @param pass Password della sessione, finchè non viene settata tutti possono fare tutto, per cambiarla si deve entrare in una nuova sessione; Le sessioni sono considerate nuove anche una volta che sono tutti usciti da esse 
     * @inheritdoc Synchronizer
     */
    constructor(video: HTMLVideoElement, public room: string = Synchronizer.uuid(), public pass: string = null, server?: string, delta?: number) {
        super(server, delta);
        this.initVideo(video);
    }
}

export class ReactiveSynchronizer extends Synchronizer {
    _room = createSignal<string>();
    get room() { return this._room[0](); }
    set room(v) { this._room[1](() => v); }

    _pass = createSignal<string>();
    get pass() { return this._pass[0](); }
    set pass(v) { this._pass[1](() => v); }

    _link = createSignal<string>();
    get link() { return this._link[0](); }
    set link(v) { this._link[1](() => v); }

    /**
     * Versione reattiva del {@link Synchronizer}
     * @param link Url del video da caricare e sincronizzare
     * @inheritdoc EmbedSynchronizer
     */
    constructor(room: string = Synchronizer.uuid(), pass: string = null, link?: string, server?: string, delta?: number) {
        super(server, delta);
        this.room = room;
        this.pass = pass;
        this.link = link;
    }
}