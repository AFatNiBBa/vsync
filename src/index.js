
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

            // Cambio password
            if (info.pass && info.pass != obj.pass && info.pass != lastPass)    // Se la stanza ha la password, e la suddetta è diversa da quella del pacchetto e quella precedentemente passata
                return;                                                         // Allora esci
            else if (obj.pass)                                                  // Altrimenti se sul pacchetto c'è una password
                info.pass = obj.pass,                                           // Cambia la password della stanza
                show = true;
            lastPass = info.pass;                                               // Salva la password precedente, essa permette di mantenere i permessi d'amministratore per un ciclo
            
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