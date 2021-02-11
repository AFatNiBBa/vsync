
/*
    File: 1z-mDQjpmdIq75Bm4EFi8Qy340ks-vetl
    API: AIzaSyAB_HQx9nP2UlKaNN4TS6_C05H1kjmup00
    Generator: https://www.wonderplugin.com/online-tools/google-drive-direct-link-generator/
    Output: https://www.googleapis.com/drive/v3/files/1z-mDQjpmdIq75Bm4EFi8Qy340ks-vetl?alt=media&key=AIzaSyAB_HQx9nP2UlKaNN4TS6_C05H1kjmup00
*/

const express = require("express");
const { Server } = require('ws');
const http = require("http");

//| Mostra lo stato del server
function state()
{
    const size = set.size;
    console.clear();
    console.log("Acceso.");
    if (size == 0) [time, play] = [0, false];
    console.log({ size, play, time });
}

//| Impostazioni globali correnti
function update()
{
    return JSON.stringify({
        time,
        type: play
        ? "play"
        : "pause"
    });
}

//| Pagina Web
const app = http.createServer(
    express()
    .use("/public", express.static("public"))
);

//| Socket
var time;
var play;
const set = new Set();
const server = new Server({ server: app });
server.on("connection", async socket => {
    set.add(socket);
    socket.send(update());
    
    //| Chiusura
    socket.on("close", () => {
        set.delete(socket);
        state();
    });

    //| Evento
    socket.on("message", async msg => {
        try
        {
            const obj = JSON.parse(msg);
            if (obj.type != "current") console.log(obj);
            
            if (obj.type == "play") play = true;
            else if (obj.type == "pause") play = false;
            time = obj.time ?? time;

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