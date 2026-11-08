// Tiny IndexedDB wrapper. Stores: kv (settings etc.), women, matches, images (blobs).
const DB_NAME = "afterglow", VER = 1;
let dbp;
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    const q = indexedDB.open(DB_NAME, VER);
    q.onupgradeneeded = () => {
      const d = q.result;
      for (const s of ["kv", "women", "matches", "images"]) if (!d.objectStoreNames.contains(s)) d.createObjectStore(s);
    };
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
  return dbp;
}
function tx(store, mode, fn) {
  return db().then((d) => new Promise((res, rej) => {
    const t = d.transaction(store, mode);
    const s = t.objectStore(store);
    const out = fn(s);
    t.oncomplete = () => res(out && "result" in out ? out.result : out);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  }));
}
export const get = (store, key) => tx(store, "readonly", (s) => s.get(key));
export const put = (store, key, val) => tx(store, "readwrite", (s) => s.put(val, key));
export const del = (store, key) => tx(store, "readwrite", (s) => s.delete(key));
export const all = (store) => tx(store, "readonly", (s) => s.getAll());
export const keys = (store) => tx(store, "readonly", (s) => s.getAllKeys());
export const clear = (store) => tx(store, "readwrite", (s) => s.clear());
