
/*
    AOT 4x08 (FileTransfer):    https://filetransfer.io/data-package/eX4xyCEC/download
    Tenet (SpeedVideo):         https://zfs209.svid.li/dnzpeezgy7g4a3gyvafh7mlsqkbs27b5p3zvoj4iogayucyn3lqtojfaqedq/Tenet_[HD]_(2020)_IMAX_Bluray_1080p[supervideo.tv].mp4
*/

const express = require("express");
const { Server } = require('ws');
const http = require("http");

//| Contenitore di "stanze"
const container = new Proxy(() => {}, {
    type: class Info {
        constructor(key, time, play, pass)
        {
            this.key = key;
            this.time = time ?? 0;
            this.play = play ?? false;
            this.pass = pass || null;
            this.set = new Set();
        }
    },
    apply: t => t,
    deleteProperty: (t, k) => delete t[k],
    set: (t, k, v) => t[k] = v,
    get(t, k) { return t[k] ??= new this.type(k); }
});

//| Mostra lo stato del server
function state()
{
    console.clear();
    console.log("\x1b[91mAcceso:\x1b[0m", Object.assign({}, container()));
}

//| Pagina Web
const app = http.createServer(
    express()
    .use("/", express.static("./public"))
);

//| Socket
const server = new Server({ server: app });
server.on("connection", async socket => {
    const info = container[await new Promise(t => socket.once("message", t))];
    const { set } = info;

    //| Impostazioni globali correnti
    function update()
    {
        return JSON.stringify({
            time: info.time,
            type: info.play
            ? "play"
            : "pause"
        });
    }

    set.add(socket);
    socket.send(update());
    
    //| Chiusura
    socket.on("close", () => {
        set.delete(socket);
        if (set.size == 0) delete container[info.key];
        state();
    });

    //| Evento
    socket.on("message", async msg => {
        if (msg == "alive") return;
        try
        {
            const obj = JSON.parse(msg);
            if (info.pass && obj.pass != info.pass) return;
            if (obj.type != "current") console.log(obj);
            
            if (obj.type == "play") info.play = true;
            else if (obj.type == "pause") info.play = false;
            info.time = obj.time ?? info.time;
            if (!info.pass && obj.pass)
            {
                info.pass = obj.pass;
                state();
            }

            const result = update();
            for (const e of set)
                if(e != socket)
                    e.send(result);
        }
        catch { }
    });

    state();
});

app.listen(process.env.PORT || 3000);
state();