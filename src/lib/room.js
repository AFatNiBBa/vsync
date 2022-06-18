
module.exports = class Room {
    static Room = this;
    static map = new Map();
    static get = key => Room.map.get(key) ?? new Room(key);
    static print = () => console.log("\x1bc\x1b[91mAcceso:\x1b[0m", Room.map);

    /** @type {string} */ key;
    /** @type {number} */ time;
    /** @type {boolean} */ paused;
    /** @type {string} */ pass;
    set = new Set();

    /**
     * @param {typeof this.key} key Codice della stanza
     * @param {typeof this.time} time Tempo corrente del video
     * @param {typeof this.paused} paused Stato di riproduzione del video
     * @param {typeof this.pass} pass Password della stanza
     */
    constructor(key, time = 0, paused = true, pass = null) {
        this.key = key;
        this.time = time;
        this.paused = paused;
        this.pass = pass;

        Room.map.set(key, this);
    }

    add(socket) {
        this.set.add(socket);
    }

    delete(socket) {
        this.set.delete(socket);
        if (this.set.size == 0)
            Room.map.delete(this.key);
    }

    send(obj, socket) {
        for (const e of this.set)
            if (e != socket)
                e.send(obj);
    }

    static migrate(info, socket, key) {
        info?.delete(socket);
        const out = Room.get(key);
        out.add(socket);
        return out;
    }
}