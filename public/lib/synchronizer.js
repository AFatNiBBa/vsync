
class Synchronizer
{
    #lock = 0;
    constructor(opts)
    {
        /**
         * So che non fa lo tengo solo come riferimento
         * @param video Elemento video da controllare
         * @param room Sessione all'interno della quale si trovano tutti gli utenti con i quali si desidera sincronizzarsi
         * @param pass Password della sessione, finchè non viene settata tutti possono fare tutto, per cambiarla si deve entrare in una nuova sessione; Le sessioni sono considerate nuove anche una volta che sono tutti usciti da esse
         * @param server Link del server che eseguirà la sincronizzazione
         * @param delta Tempo di desincronizzazione massima (in secondi) dal server
         */
        Object.assign(this, opts);
        const sync = this.constructor;
        this.delta ??= 1;
        this.room ??= sync.uuid();
        this.socket ??= new WebSocket(this.server ??= sync.url());

        this.video.onplay = () => this.send("play");
        this.video.onpause = () => this.send("pause");
        this.video.ontimeupdate = () => this.send("current");

        const id = setInterval(() => this.socket.send("alive"), 1000);
        this.socket.onclose = x => clearInterval(id);
        this.socket.onopen = x => this.socket.send(this.room);
        this.socket.onmessage = async x => {
            this.#lock++;
            try
            {
                const { video } = this;
                const obj = JSON.parse(x.data);
                if (this.onupdate instanceof Function) this.onupdate(obj);
                if (obj.type == "play" && video.paused) await video.play();
                if (obj.type == "pause" && !video.paused) await video.pause();
                if (Math.abs(video.currentTime - obj.time) > this.delta) video.currentTime = obj.time;
            }
            catch { }
            this.#lock--; // Le funzioni "play" e "pause" sono asincrone, perciò "lock" veniva diminuito prima della loro esecuzione senza gli 'await'
        };
    }

    //| Manda un pacchetto di aggiornamento con password, tempo corrente e tipo del pacchetto
    send(type)
    {
        if (this.#lock == 0) this.socket.send(JSON.stringify({
            type,
            pass: this.pass,
            time: this.video.currentTime
        }));
    }

    //| Genera l'url del server dando per scontato che si trova sul server corrente
    static url()
    {
        return `ws${ window.location.protocol == "https:" ? "s" : "" }://${ window.location.hostname }${ window.location.hostname == "localhost" ? ":3000" : "" }`;
    }

    //| Universally Unique ID v4
    static uuid()
    {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
            const rnd = Math.random() * 16 | 0;
            return (
                char == "x"
                ? rnd
                : (rnd & 0x3 | 0x8)
            ).toString(16);
        }); 
    }
}

if (typeof window == "object") // HTML5
    Object.assign(window, { Synchronizer });

if (typeof module == "object") // Node.js
    module.exports = Synchronizer;