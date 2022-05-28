
const Room = require('./lib/room');
const express = require('express');
const { join } = require("path")

const app = express();
require("express-ws")(app);

app.get("/-wakemydyno.txt", (req, res) => res.send(""));

app.use(express.static(join(__dirname, '../dist')));

app.ws("/", socket => {
    /** @type {import("./lib/room")} */
    var info;
    var lastPass;

    // Pacchetto di aggiornamento
    const update = () => JSON.stringify({ paused: info?.paused, time: info?.time });
    
    // Chiusura
    socket.on("close", () => {
        info?.delete(socket);
        Room.print();
    });

    // Messaggio
    socket.on("message", msg => {
        if (msg == "alive") return;
        try
        {
            /** @type {{ room: string, pass: string, paused: boolean, time: number }} */
            const obj = JSON.parse(msg);
            var show = false;

            // Cambio stanza (Prima di questo punto "info" poteva essere non settato)
            if (info?.key != obj.room)
                info = Room.migrate(info, socket, obj.room),
                show = true;

            console.log(">>>", info.pass, (obj.pass ||= null), lastPass, info.pass == obj.pass, info.pass == lastPass);

            // Cambio password
            if (info.pass != (obj.pass ||= null))                      // Se la password della stanza è diversa da quella del pacchetto
                if (info.pass == lastPass)                                      // Se la password della stanza era stata inserita corretttamente la scorsa volta
                    info.pass = obj.pass,                            // Cambia la password della stanza
                    show = true;
                else
                    return;                                                     // Altrimenti, se la password non è corretta, esce
            lastPass = obj.pass; // Aggiorna la password precedente, quest'ultima permette di mantenere i permessi d'amministratore per un ciclo dopo il cambio della password
            
            // Cambio stato pausa
            if (obj.paused != null && info.paused != obj.paused)
                info.paused = obj.paused,
                show = true;

            // Updata
            info.time = obj.time ?? info.time;
            const result = update();
            for (const e of info.set)
                if(e != socket)
                    e.send(result);

            // Eventualmente mostra il cambiamento
            if (show) Room.print();
        }
        catch (e) { console.error(e); }
    });

    Room.print();
});

app.listen(process.env.PORT || 3000, Room.print);