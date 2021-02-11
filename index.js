
/*
    [WIP]: Test url[GET]
    Drive: 1z-mDQjpmdIq75Bm4EFi8Qy340ks-vetl
    Direct: https://www.googleapis.com/drive/v3/files/1z-mDQjpmdIq75Bm4EFi8Qy340ks-vetl?alt=media&key=AIzaSyAB_HQx9nP2UlKaNN4TS6_C05H1kjmup00
    
    Filesend: https://www.filesend.jp/l/en-US/RRZnPS
    FileTransfer: https://filetransfer.io/data-package/eX4xyCEC/download
*/

const express = require("express");
const { Server } = require('ws');
const http = require("http");

//| Contenitore di "stanze"
const container = new Proxy(()=>{}, {
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
    console.log("Acceso.");
    console.log(container());
}

//| Pagina Web
const app = http.createServer(
    express()
    .use("/", express.static("public"))
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
            info.pass ||= obj.pass || null;

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