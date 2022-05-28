
const { container, state } = require('./lib/utils');
const { join } = require("path")
const express = require('express');

const app = express();
require("express-ws")(app);

app.get("/wakemydyno.txt", (req, res) => res.send(""));

app.use(express.static(join(__dirname, '../dist')));

app.ws("/", async socket => {
    const info = container[await new Promise(t => socket.once("message", t))];
    const { set } = info;

    // Pacchetto di aggiornamento
    const update = () => JSON.stringify({ time: info.time, type: info.play ? "play" : "pause" });

    set.add(socket);
    socket.send(update());
    
    // Chiusura
    socket.on("close", () => {
        set.delete(socket);
        if (set.size == 0) delete container[info.key];
        state();
    });

    // Evento
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

app.listen(process.env.PORT || 80, state);