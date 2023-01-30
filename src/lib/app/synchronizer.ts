
import { batch, createSignal } from "solid-js";
import { uuid } from "../utils";

type BaseState = { paused?: boolean, time?: number };
type InputState = BaseState & { users: number };
type OutputState = BaseState & { room: string, pass?: string };

export abstract class Synchronizer {
  _lock = 0;
  video: HTMLVideoElement;
  socket: WebSocket;
  onUpdate?: (x: InputState) => void;

  abstract room: string;

  abstract pass: string;

  get state(): OutputState { return { room: this.room, pass: this.pass, paused: this.video.paused, time: this.video.currentTime }; }

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
        try {
          const { video } = this;
          if (!video) return;

          const obj: InputState = JSON.parse(x.data);
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

  /**
   * Imposta l'elemento video da sincronizzare (Eseguire appena disponibile)
   * @param video Elemento video da utilizzare
   */
  initVideo(video: HTMLVideoElement) {
    video.onplay =  // ↓
    video.onpause = // ↓
    (this.video = video).ontimeupdate = () => this.send();
  }

  /**
   * Manda un pacchetto di aggiornamento con password, tempo corrente e tipo del pacchetto
   * @param obj Il pacchetto
   */
  send(obj?: OutputState) {
    if (!this._lock && this.video && this.socket.readyState === WebSocket.OPEN)
      this.socket.send(JSON.stringify(obj ?? this.state));
  }

  /**
   * Genera l'url del server dando per scontato che si trova sul server corrente
   */
  static url() { return `ws${location.protocol == "https:" ? "s" : ""}://${location.hostname}${location.port && `:${location.port}`}`; }
}

export class EmbedSynchronizer extends Synchronizer {
  /**
   * Versione di embed del {@link Synchronizer}
   * @param video Elemento video da controllare
   * @param room Sessione all'interno della quale si trovano tutti gli utenti con i quali si desidera sincronizzarsi
   * @param pass Password della sessione, finchè non viene settata tutti possono fare tutto, per cambiarla si deve entrare in una nuova sessione; Le sessioni sono considerate nuove anche una volta che sono tutti usciti da esse 
   * @inheritdoc Synchronizer
   */
  constructor(video: HTMLVideoElement, public room: string = uuid(), public pass: string = null, server?: string, delta?: number) {
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

  _provider = createSignal<string>();
  get provider() { return this._provider[0](); }
  set provider(v) { this._provider[1](() => v); }

  _users = createSignal<number>(1);
  get users() { return this._users[0](); }
  set users(v) { this._users[1](() => v); }

  /**
   * Versione reattiva del {@link Synchronizer}
   * @param link Url del video da caricare e sincronizzare
   * @param provider Link alla API che ha generato la stanza corrente, deve finire con una espressione di selezione episodio
   * @inheritdoc EmbedSynchronizer
   */
  constructor(room: string = uuid(), pass: string = null, link?: string, provider?: string, server?: string, delta?: number) {
    super(server, delta);
    
    // Vengono settati a pacchetto
    batch(() => {
      this.room = room;
      this.pass = pass;
      this.link = link;
      this.provider = provider;
    });

    // Se viene cambiato il link viene annullato il provider
    const [ , setLink ] = this._link;
    this._link[1] = <any>((x: any) => {
      batch(() => {
        setLink(x);
        this.provider = null;
      });
    });

    this.onUpdate = (obj: InputState) => this.users = obj.users;    
  }
}