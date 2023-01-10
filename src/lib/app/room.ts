
import type { WebSocket } from "ws";

export default class Room {
  static Room = this;
  static map = new Map();
  static get = (key: string) => Room.map.get(key) ?? new Room(key);
  static print = () => console.log("\x1bc\x1b[91mAcceso:\x1b[0m", Room.map);
  set = new Set<WebSocket>();

  get state() { return { users: this.set.size, paused: this.paused, time: this.time }; }

  /**
   * @param key Codice della stanza
   * @param time Tempo corrente del video
   * @param paused Stato di riproduzione del video
   * @param pass Password della stanza
   */
  constructor(public key: string, public time: number = 0, public paused: boolean = true, public pass: string = null) { Room.map.set(key, this); }

  add(socket: WebSocket) { this.set.add(socket); }

  delete(socket: WebSocket) {
    this.set.delete(socket);
    if (this.set.size == 0)
      Room.map.delete(this.key);
    else
      this.send();
  }

  send(obj?: any, sender?: WebSocket) {
    const str = JSON.stringify(obj ?? this.state);
    for (const e of this.set)
      if (e != sender)
        e.send(str);
  }

  static migrate(info: Room, socket: WebSocket, key: string) {
    info?.delete(socket);
    const out = Room.get(key);
    out.add(socket);
    out.send();
    return out;
  }
}