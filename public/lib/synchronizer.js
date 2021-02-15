
class Synchronizer
{
    #lock = 0;
    constructor(opts)
    {
        //| video, room, pass, delta
        Object.assign(this, opts);
        this.delta ??= 1;
        this.room ??= Synchronizer.uuid();
        this.socket ??= new WebSocket(link ?? `ws${ window.location.protocol == "https:" ? "s" : "" }://${ window.location.hostname }${ window.location.hostname == "localhost" ? ":3000" : "" }`);

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
                if (this.onupdate && this.update instanceof Function) this.onupdate(obj);
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