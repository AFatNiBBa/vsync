
// Contenitore di "stanze"
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

// Mostra lo stato del server
function state()
{
    console.clear();
    console.log("\x1b[91mAcceso:\x1b[0m", Object.assign({}, container()));
}

module.exports = { container, state };