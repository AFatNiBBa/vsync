
/**
 * Genera un id univoco
 */
export function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, x => ((Math.random() * 16 | 0) & (x === "x" ? ~0 : 0b00001011)).toString(16));
}