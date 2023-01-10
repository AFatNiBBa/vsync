
import Room from "./room";
import type { WebSocket } from "ws";

export default function sync(socket: WebSocket) {
  var info: Room;
  var lastPass: string;

  // Chiusura
  socket.on("close", () => {
    info?.delete(socket);
    Room.print();
  });

  // Messaggio
  socket.on("message", (msg: string) => {
    if (msg == "alive") return;
    try
    {
      const obj = JSON.parse(msg) as { room: string, pass: string, paused: boolean, time: number };
      var show = false;

      // Cambio stanza (Prima di questo punto "info" poteva essere non settato)
      if (info?.key != obj.room)
        info = Room.migrate(info, socket, obj.room),
          show = true;

      // Cambio password
      if (info.pass != (obj.pass ||= null)) // Se la password della stanza è diversa da quella del pacchetto
        if (info.pass == lastPass)          // Se la password della stanza era stata inserita corretttamente la scorsa volta
          info.pass = obj.pass,             // Cambia la password della stanza
            show = true;
        else
          return;                           // Altrimenti, se la password non è corretta, esce
      lastPass = obj.pass;                  // Aggiorna la password precedente, quest'ultima permette di mantenere i permessi d'amministratore per un ciclo dopo il cambio della password

      // Cambio stato pausa
      if (obj.paused != null && info.paused != obj.paused)
        info.paused = obj.paused,
          show = true;

      // Updata
      info.time = obj.time ?? info.time;
      info.send(undefined, socket);

      // Eventualmente mostra il cambiamento
      if (show) Room.print();
    }
    catch (e) { console.error(e); }
  });

  Room.print();
}