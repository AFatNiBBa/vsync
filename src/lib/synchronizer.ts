
export default class Synchronizer
{
    _lock = 0;
    socket: WebSocket;
    onUpdate?: (x: any) => void;

    /**
     * @param video Elemento video da controllare
     * @param room Sessione all'interno della quale si trovano tutti gli utenti con i quali si desidera sincronizzarsi
     * @param pass Password della sessione, finchè non viene settata tutti possono fare tutto, per cambiarla si deve entrare in una nuova sessione; Le sessioni sono considerate nuove anche una volta che sono tutti usciti da esse
     * @param server Link del server che eseguirà la sincronizzazione
     * @param delta Tempo di desincronizzazione massima (in secondi) dal server
     */
    constructor(public video: HTMLVideoElement, public room: string = Synchronizer.uuid(), public pass: string = null, public server: string = Synchronizer.url(), public delta: number = 1)
    {
        this.socket = new WebSocket(this.server);

        this.video.onplay = () => this.send("play");
        this.video.onpause = () => this.send("pause");
        this.video.ontimeupdate = () => this.send("current");

        this.socket.onopen = () => {
            const id = setInterval(() => this.socket.send("alive"), 1000);
            this.socket.onclose = () => clearInterval(id);
            this.socket.onmessage = async x => {
                this._lock++;
                try
                {
                    const { video } = this;
                    const obj = JSON.parse(x.data);

                    this.onUpdate?.(obj);

                    switch (obj.type)
                    {
                        case "play":
                            if (video.paused)
                                await video.play();
                            break;
                        case "pause":
                            if (!video.paused)
                                video.pause();
                            break;
                    }

                    if (Math.abs(video.currentTime - obj.time) > this.delta)
                        video.currentTime = obj.time;
                }
                finally { this._lock--; } // La funzione "video.play()" è asincrona, perciò "_lock" veniva diminuito prima della sua esecuzione senza 'await'
            };
            
            this.socket.send(this.room);
        };
    }

    /**
     * Manda un pacchetto di aggiornamento con password, tempo corrente e tipo del pacchetto
     * @param type Il tipo del pacchetto
     */
    send(type: "play" | "pause" | "current" | "alive")
    {
        if (!this._lock)
            this.socket.send(JSON.stringify({ type, pass: this.pass, time: this.video.currentTime }));
    }

    /**
     * Genera l'url del server dando per scontato che si trova sul server corrente
     */
    static url = () => `ws${ window.location.protocol == "https:" ? "s" : "" }://${ window.location.hostname }${ window.location.port }`;

    /**
     * Universally Unique ID v4
     */
    static uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, x => ((Math.random() * 16 | 0) & (x === "x" ? ~0 : 0b00001011)).toString(16));
}