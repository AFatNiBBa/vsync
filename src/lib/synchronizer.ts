
type State = { room?: string, paused?: boolean, time?: number };

type RefTarget = {
    /** Sessione all'interno della quale si trovano tutti gli utenti con i quali si desidera sincronizzarsi */
    room: string

    /** Password della sessione, finchè non viene settata tutti possono fare tutto, per cambiarla si deve entrare in una nuova sessione; Le sessioni sono considerate nuove anche una volta che sono tutti usciti da esse */
    pass: string
};

export default class Synchronizer
{
    _lock = 0;
    socket: WebSocket;
    onUpdate?: (x: any) => void;

    get state(): State & { pass: string } { return { room: this.target.room, pass: this.target.pass, paused: this.video.paused, time: this.video.currentTime }; }

    /**
     * @param video Elemento video da controllare
     * @param target Oggetto mutabile che comunica la sessione al server
     * @param server Link del server che eseguirà la sincronizzazione
     * @param delta Tempo di desincronizzazione massima (in secondi) dal server
     */
    constructor(public video: HTMLVideoElement, public target: RefTarget = { room: Synchronizer.uuid(), pass: null }, public server: string = Synchronizer.url(), public delta: number = 1) {
        this.socket = new WebSocket(this.server);

        this.video.onplay = () => this.send();
        this.video.onpause = () => this.send();
        this.video.ontimeupdate = () => this.send();

        this.socket.onopen = () => {
            const id = setInterval(() => this.socket.send("alive"), 1000);
            this.socket.onclose = () => clearInterval(id);
            this.socket.onmessage = async x => {
                this._lock++;
                try
                {
                    const { video } = this;
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
            
            this.send({ room: this.target.room });
        };
    }

    /** Manda un pacchetto di aggiornamento con password, tempo corrente e tipo del pacchetto */
    send(obj: State = this.state) {
        if (!this._lock && this.socket.readyState === WebSocket.OPEN)
            this.socket.send(JSON.stringify(obj));
    }

    /** Genera l'url del server dando per scontato che si trova sul server corrente */
    static url() { return `ws${ location.protocol == "https:" ? "s" : "" }://${ location.hostname }${ location.port && `:${ location.port }` }`; }

    /** Universally Unique ID v4 */
    static uuid() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, x => ((Math.random() * 16 | 0) & (x === "x" ? ~0 : 0b00001011)).toString(16)); }
}