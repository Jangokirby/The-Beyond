/* ============================================================================
   THE KIT: reusable pieces for building a room, and the builder that turns a layout into a picture.

   A LAYOUT (what you save, what the editor edits, what the game reads) is plain data:
     { name, w, h,                       size in metres
       style: { floor, wall, mood },     floor: wood | stone | tile | dirt   wall: plaster | brick | wood | concrete   mood: day | dim | night
       walls:   [ { a:[x,z], b:[x,z] } ],            straight, horizontal or vertical
       doors:   [ { x, z, w, axis } ],               axis "h" = in a wall that runs along x, "v" = along z
       windows: [ { x, z, w, axis } ],
       props:   [ { t, x, z, rot } ],                t = a catalog id below, rot in degrees (0, 90, 180, 270)
       things:  [ { x, z, label, text, act, res } ], what you can examine (point and click)
       npcs:    [ { x, z, label, portrait } ],
       start:   [x, z] }
   To add a piece: add an entry to CATALOG (its size, tags and a `make` that builds it from boxes and cylinders).
   ========================================================================== */
import * as THREE from "./lib/three.module.js";
export { THREE };

const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const tex = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t; };
const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .85, metalness: 0, ...o });

/* ---------------------------------------------------------------- surfaces */
const FLOORS = {
  wood: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { const y = i * h / 8; g.fillStyle = `hsl(${28 + rnd() * 6},${30 + rnd() * 8}%,${24 + rnd() * 8}%)`; g.fillRect(0, y, w, h / 8 - 2); g.strokeStyle = "rgba(0,0,0,.35)"; g.strokeRect(0, y, w, h / 8 - 2); } }),
  stone: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const c = 78 + rnd() * 26 | 0; g.fillStyle = `rgb(${c},${c - 4},${c - 10})`; g.fillRect(i * 128, j * 128, 126, 126); } }),
  tile: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? "#cfd0c8" : "#2e3a3c"; g.fillRect(i * 64, j * 64, 62, 62); } }),
  dirt: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#4a3a2a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "20,14,8" : "120,96,64"},${rnd() * .18})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 5, 2 + rnd() * 5); } })
};
const WALLS = {
  plaster: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#cfc8b4"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "90,80,60" : "255,255,240"},${rnd() * .07})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 2 + rnd() * 6); } }),
  brick: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#6a3b2c"; g.fillRect(0, 0, w, h); for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) { g.fillStyle = `hsl(${10 + rnd() * 8},${40 + rnd() * 10}%,${28 + rnd() * 8}%)`; g.fillRect(i * 44 + (j % 2) * 22, j * 32, 42, 30); } }),
  wood: () => tex(256, 256, (g, w, h) => { for (let i = 0; i < 6; i++) { g.fillStyle = `hsl(${26 + rnd() * 6},${26}%,${30 + rnd() * 8}%)`; g.fillRect(i * 43, 0, 41, h); } }),
  concrete: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#8d8f90"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1200; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "40,40,40" : "230,230,230"},${rnd() * .08})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 5, 2 + rnd() * 5); } })
};

/* ---------------------------------------------------------------- the catalog
   size: [width, depth] in metres, before rotation.  block: true if you cannot walk through it.
   make(k) returns a THREE.Group at the origin, facing "up" the room (north, -z), standing on y = 0.
   k gives helpers: k.box, k.cyl, k.m (materials). Lights are declared with `light` and added by the builder. */
export const CATALOG = {
  bed_iron: { name: "Iron bed", tags: ["medical", "bedroom", "1850+"], size: [1.0, 2.1], block: true, make: (k) => { const g = k.group(); k.box(g, 1.0, .06, 2.1, k.m.iron, 0, .42, 0); k.box(g, .92, .16, 2.0, k.m.sheet, 0, .53, 0); k.box(g, .94, .1, 1.3, k.m.blanket, 0, .64, .35); k.box(g, .6, .12, .4, k.m.sheet, 0, .66, -.75); for (const [x, z] of [[-.5, -1.04], [.5, -1.04], [-.5, 1.04], [.5, 1.04]]) k.box(g, .05, .9, .05, k.m.iron, x, .45, z); k.box(g, 1, .05, .05, k.m.iron, 0, .88, -1.04); k.box(g, 1, .05, .05, k.m.iron, 0, .6, 1.04); return g; } },
  bed_double: { name: "Double bed", tags: ["bedroom", "domestic"], size: [1.7, 2.1], block: true, make: (k) => { const g = k.group(); k.box(g, 1.7, .35, 2.1, k.m.wood, 0, .18, 0); k.box(g, 1.6, .22, 2.0, k.m.sheet, 0, .46, 0); k.box(g, 1.62, .12, 1.3, k.m.blanket, 0, .6, .35); k.box(g, .6, .14, .38, k.m.sheet, -.4, .62, -.78); k.box(g, .6, .14, .38, k.m.sheet, .4, .62, -.78); k.box(g, 1.7, .9, .08, k.m.wood, 0, .65, -1.06); return g; } },
  cot: { name: "Camp cot", tags: ["military", "medical", "camp"], size: [.8, 1.9], block: true, make: (k) => { const g = k.group(); k.box(g, .8, .06, 1.9, k.m.canvas, 0, .36, 0); k.box(g, .06, .36, 1.9, k.m.dark, -.4, .18, 0); k.box(g, .06, .36, 1.9, k.m.dark, .4, .18, 0); k.box(g, .5, .1, .3, k.m.sheet, 0, .45, -.7); return g; } },
  stretcher: { name: "Stretcher", tags: ["medical", "military"], size: [.7, 2.0], block: false, make: (k) => { const g = k.group(); k.box(g, .7, .06, 2.0, k.m.canvas, 0, .4, 0); k.box(g, .05, .4, 2.0, k.m.dark, -.35, .2, 0); k.box(g, .05, .4, 2.0, k.m.dark, .35, .2, 0); return g; } },
  desk: { name: "Desk", tags: ["office", "study", "medical"], size: [1.8, .9], block: true, make: (k) => { const g = k.group(); k.box(g, 1.8, .06, .9, k.m.wood, 0, .78, 0); k.box(g, .06, .76, .8, k.m.wood, -.85, .38, 0); k.box(g, .06, .76, .8, k.m.wood, .85, .38, 0); k.box(g, .5, .02, .4, k.m.sheet, .2, .82, .05); k.box(g, .3, .12, .3, k.m.dark, -.5, .87, -.1); return g; } },
  chair: { name: "Chair", tags: ["any"], size: [.5, .5], block: false, make: (k) => { const g = k.group(); k.box(g, .46, .05, .46, k.m.wood, 0, .45, 0); k.box(g, .46, .5, .05, k.m.wood, 0, .72, -.22); for (const [x, z] of [[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]]) k.box(g, .04, .45, .04, k.m.wood, x, .22, z); return g; } },
  stool: { name: "Stool", tags: ["any"], size: [.4, .4], block: false, make: (k) => { const g = k.group(); k.cyl(g, .2, .05, k.m.wood, 0, .5); k.cyl(g, .03, .5, k.m.dark, 0, .25); return g; } },
  bench: { name: "Bench", tags: ["any", "church", "tavern"], size: [1.8, .45], block: false, make: (k) => { const g = k.group(); k.box(g, 1.8, .06, .4, k.m.wood, 0, .45, 0); k.box(g, .06, .45, .36, k.m.dark, -.8, .22, 0); k.box(g, .06, .45, .36, k.m.dark, .8, .22, 0); return g; } },
  table_long: { name: "Long table", tags: ["tavern", "dining", "canteen"], size: [2.4, .9], block: true, make: (k) => { const g = k.group(); k.box(g, 2.4, .07, .9, k.m.wood, 0, .76, 0); for (const [x, z] of [[-1.1, -.38], [1.1, -.38], [-1.1, .38], [1.1, .38]]) k.box(g, .08, .74, .08, k.m.dark, x, .37, z); return g; } },
  table_round: { name: "Round table", tags: ["tavern", "dining", "domestic"], size: [1.1, 1.1], block: true, make: (k) => { const g = k.group(); k.cyl(g, .55, .06, k.m.wood, 0, .76); k.cyl(g, .08, .74, k.m.dark, 0, .37); k.cyl(g, .3, .04, k.m.dark, 0, .02); return g; } },
  bookshelf: { name: "Bookshelf", tags: ["study", "library", "domestic"], size: [1.4, .4], block: true, make: (k) => { const g = k.group(); k.box(g, 1.4, 2.0, .4, k.m.wood, 0, 1.0, 0); for (let i = 0; i < 5; i++) { k.box(g, 1.3, .05, .38, k.m.dark, 0, .3 + i * .38, .02); for (let j = 0; j < 9; j++) k.box(g, .08, .26, .26, k.book(), -.55 + j * .13, .45 + i * .38, .06); } return g; } },
  cabinet: { name: "Cabinet", tags: ["medical", "office", "domestic"], size: [1.0, .5], block: true, make: (k) => { const g = k.group(); k.box(g, 1, 1.3, .5, k.m.wood, 0, .65, 0); k.box(g, .46, 1.2, .02, k.m.dark, -.24, .65, .26); k.box(g, .46, 1.2, .02, k.m.dark, .24, .65, .26); return g; } },
  wardrobe: { name: "Wardrobe", tags: ["bedroom", "domestic"], size: [1.2, .6], block: true, make: (k) => { const g = k.group(); k.box(g, 1.2, 2.0, .6, k.m.wood, 0, 1, 0); k.box(g, .56, 1.8, .02, k.m.dark, -.3, 1, .31); k.box(g, .56, 1.8, .02, k.m.dark, .3, 1, .31); return g; } },
  counter: { name: "Counter / bar", tags: ["tavern", "shop", "reception"], size: [2.6, .7], block: true, make: (k) => { const g = k.group(); k.box(g, 2.6, 1.0, .7, k.m.wood, 0, .5, 0); k.box(g, 2.7, .06, .8, k.m.dark, 0, 1.03, 0); return g; } },
  filing_cabinet: { name: "Filing cabinet", tags: ["office"], size: [.5, .6], block: true, make: (k) => { const g = k.group(); k.box(g, .5, 1.3, .6, k.m.iron, 0, .65, 0); for (let i = 0; i < 4; i++) k.box(g, .42, .02, .02, k.m.brass, 0, .25 + i * .3, .31); return g; } },
  locker: { name: "Locker", tags: ["military", "industrial", "school"], size: [.5, .5], block: true, make: (k) => { const g = k.group(); k.box(g, .5, 1.8, .5, k.m.metalBlue, 0, .9, 0); k.box(g, .02, 1.5, .02, k.m.dark, 0, .9, .26); return g; } },
  barrel: { name: "Barrel", tags: ["cellar", "tavern", "dock"], size: [.7, .7], block: true, make: (k) => { const g = k.group(); k.cyl(g, .35, .9, k.m.wood, 0, .45); k.cyl(g, .37, .05, k.m.iron, 0, .2); k.cyl(g, .37, .05, k.m.iron, 0, .7); return g; } },
  crate: { name: "Crate", tags: ["any", "cellar", "dock"], size: [.8, .8], block: true, make: (k) => { const g = k.group(); k.box(g, .8, .8, .8, k.m.crate, 0, .4, 0); k.box(g, .82, .06, .82, k.m.dark, 0, .1, 0); k.box(g, .82, .06, .82, k.m.dark, 0, .7, 0); return g; } },
  crate_stack: { name: "Stacked crates", tags: ["cellar", "dock", "industrial"], size: [1.6, .8], block: true, make: (k) => { const g = k.group(); k.box(g, .8, .8, .8, k.m.crate, -.4, .4, 0); k.box(g, .8, .8, .8, k.m.crate, .4, .4, 0); k.box(g, .8, .8, .8, k.m.crate, 0, 1.2, 0); return g; } },
  stove: { name: "Stove", tags: ["domestic", "medical", "camp"], size: [.9, .9], block: true, light: { c: 0xff8a3a, i: 6, r: 6, y: .6 }, make: (k) => { const g = k.group(); k.cyl(g, .45, 1.1, k.m.iron, 0, .55); k.cyl(g, .07, 1.8, k.m.iron, 0, 1.9); return g; } },
  fireplace: { name: "Fireplace", tags: ["tavern", "domestic", "study"], size: [1.8, .6], block: true, light: { c: 0xff8a3a, i: 9, r: 8, y: .5, dz: .5 }, make: (k) => { const g = k.group(); k.box(g, 1.8, 1.6, .6, k.m.brick, 0, .8, 0); k.box(g, 1.0, .9, .1, k.m.fire, 0, .55, .26); k.box(g, 2.0, .1, .7, k.m.dark, 0, 1.65, 0); return g; } },
  lamp_table: { name: "Lamp on a table", tags: ["any", "medical", "domestic"], size: [.5, .5], block: true, light: { c: 0xffc27a, i: 14, r: 8.5, y: .95 }, make: (k) => { const g = k.group(); k.box(g, .5, .5, .5, k.m.wood, 0, .25, 0); k.cyl(g, .09, .22, k.m.brass, 0, .6); const b = new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 8), k.m.glass); b.position.set(0, .78, 0); g.add(b); return g; } },
  lamp_floor: { name: "Standing lamp", tags: ["any", "modern", "1890+"], size: [.4, .4], block: false, light: { c: 0xffd9a0, i: 12, r: 8, y: 1.7 }, make: (k) => { const g = k.group(); k.cyl(g, .14, .04, k.m.iron, 0, .02); k.cyl(g, .02, 1.6, k.m.iron, 0, .8); const b = new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, .26, 12), k.m.glass); b.position.set(0, 1.7, 0); g.add(b); return g; } },
  candle: { name: "Candle", tags: ["any", "church", "1800-"], size: [.3, .3], block: false, light: { c: 0xffb060, i: 5, r: 4.5, y: .5 }, make: (k) => { const g = k.group(); k.cyl(g, .03, .25, k.m.sheet, 0, .12); const b = new THREE.Mesh(new THREE.SphereGeometry(.03, 8, 6), k.m.glass); b.position.set(0, .28, 0); g.add(b); return g; } },
  rug: { name: "Rug", tags: ["domestic", "study", "tavern"], size: [2.4, 1.6], block: false, make: (k) => { const g = k.group(); k.box(g, 2.4, .02, 1.6, k.m.rug, 0, .01, 0, false); k.box(g, 2.0, .025, 1.2, k.m.rug2, 0, .015, 0, false); return g; } },
  pillar: { name: "Pillar", tags: ["any", "church", "cellar"], size: [.6, .6], block: true, make: (k) => { const g = k.group(); k.cyl(g, .3, 2.6, k.m.stone, 0, 1.3); return g; } },
  sink: { name: "Sink", tags: ["medical", "domestic", "kitchen"], size: [1.0, .6], block: true, make: (k) => { const g = k.group(); k.box(g, 1, .9, .6, k.m.sheet, 0, .45, 0); k.box(g, .7, .04, .4, k.m.iron, 0, .92, 0); return g; } },
  gramophone: { name: "Gramophone", tags: ["1900-1960", "domestic"], size: [.7, .6], block: true, make: (k) => { const g = k.group(); k.box(g, .7, .8, .6, k.m.wood, 0, .4, 0); k.cyl(g, .3, .06, k.m.dark, 0, .83); const h = new THREE.Mesh(new THREE.ConeGeometry(.28, .5, 14, 1, true), k.m.brass); h.position.set(.1, 1.15, 0); h.rotation.z = -.9; h.castShadow = true; g.add(h); return g; } },
  crate_med: { name: "Medical crate", tags: ["medical", "military"], size: [.9, .6], block: true, make: (k) => { const g = k.group(); k.box(g, .9, .5, .6, k.m.crate, 0, .25, 0); k.box(g, .3, .22, .02, k.m.red, 0, .3, .31); return g; } }
};

/* ---------------------------------------------------------------- the builder */
export function build(L, opt = {}) {
  const S = new THREE.Scene(), mood = (L.style && L.style.mood) || "day", Wm = L.w, Hm = L.h, T = .3, WH = 2.6;
  S.background = new THREE.Color(0x0b0d10);
  const floorMap = FLOORS[(L.style && L.style.floor) || "wood"](); floorMap.repeat.set(Wm / 4, Hm / 4);
  const wallMap = WALLS[(L.style && L.style.wall) || "plaster"]();
  const m = { floor: M(0xffffff, { map: floorMap, roughness: .9 }), wall: M(0xffffff, { map: wallMap }), trim: M(0x5a4636), iron: M(0x59606b, { roughness: .55, metalness: .35 }), sheet: M(0xe9e4d6), blanket: M(0x6b7b5e), wood: M(0x9a6f46), dark: M(0x6a4c34), glass: M(0xffe9b0, { emissive: 0xffd48a, emissiveIntensity: 1.6 }), win: M(0x9bb4cf, { emissive: 0x6f8fb8, emissiveIntensity: .9 }), brass: M(0xb18b3a, { metalness: .7, roughness: .4 }), crate: M(0xa98250), canvas: M(0xb8ad8c), brick: M(0x7a4332), stone: M(0x8a8780), fire: M(0xff9a40, { emissive: 0xff7a20, emissiveIntensity: 2 }), rug: M(0x7a2f2f), rug2: M(0xb59a5a), metalBlue: M(0x4a6a86), red: M(0xb0302a) };
  const add = (o, cast = true) => { o.castShadow = cast; o.receiveShadow = true; S.add(o); return o; };
  const box = (w, h, d, mat, x, y, z, cast = true) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); return add(o, cast); };
  box(Wm + 2, .1, Hm + 2, m.floor, Wm / 2, -.05, Hm / 2, false);
  /* walls: default is the room's outline */
  const walls = (L.walls && L.walls.length) ? L.walls : [{ a: [0, 0], b: [Wm, 0] }, { a: [Wm, 0], b: [Wm, Hm] }, { a: [0, Hm], b: [Wm, Hm] }, { a: [0, 0], b: [0, Hm] }];
  const cuts = []; const collide = []; const exits = [];
  for (const w of walls) {
    const horiz = Math.abs(w.a[1] - w.b[1]) < .01, len = horiz ? Math.abs(w.b[0] - w.a[0]) : Math.abs(w.b[1] - w.a[1]), c0 = horiz ? Math.min(w.a[0], w.b[0]) : Math.min(w.a[1], w.b[1]), fix = horiz ? w.a[1] : w.a[0];
    const near = horiz && fix > Hm / 2 + .01;   // walls on the near side are cut down so the camera can see over them
    const hh = (horiz && fix > .01) ? (near ? .5 : 1.2) : WH;
    const ops = [...(L.doors || []).map((d) => ({ ...d, door: true })), ...(L.windows || []).map((d) => ({ ...d }))].filter((o) => (horiz ? o.axis === "h" && Math.abs(o.z - fix) < .2 && o.x >= c0 - .01 && o.x <= c0 + len + .01 : o.axis === "v" && Math.abs(o.x - fix) < .2 && o.z >= c0 - .01 && o.z <= c0 + len + .01)).sort((p, q) => (horiz ? p.x - q.x : p.z - q.z));
    let p = c0;
    const solid = (a, b, h, y0, mat = m.wall) => { if (b - a < .02) return; if (horiz) box(b - a, h, T, mat, (a + b) / 2, y0 + h / 2, fix); else box(T, h, b - a, mat, fix, y0 + h / 2, (a + b) / 2); };
    for (const o of ops) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; solid(p, a, hh, 0); if (o.door) { solid(a, b, Math.max(0, hh - 2.1), 2.1); exits.push({ x: horiz ? o.x : fix, z: horiz ? fix : o.z, w: o.w || 1.4, axis: o.axis }); cuts.push([a, b, horiz, fix]); } else { solid(a, b, Math.min(.9, hh), 0); if (hh > 1.1) solid(a, b, Math.max(0, hh - 1.9), 1.9); if (hh > 1.1) { if (horiz) box(b - a - .1, 1.0, .06, m.win, (a + b) / 2, 1.4, fix); else box(.06, 1.0, b - a - .1, m.win, fix, 1.4, (a + b) / 2); } } p = b; }
    solid(p, c0 + len, hh, 0);
    /* collision: the wall's solid spans (doors are gaps; windows block) */
    let q = c0; for (const o of ops) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; if (!o.door) continue; if (a > q) collide.push(horiz ? [q, fix, a, fix] : [fix, q, fix, a]); q = b; }
    if (q < c0 + len) collide.push(horiz ? [q, fix, c0 + len, fix] : [fix, q, fix, c0 + len]);
    for (const o of ops) if (!o.door) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; collide.push(horiz ? [a, fix, b, fix] : [fix, a, fix, b]); }
  }
  /* baseboards on the back and side walls */
  box(Wm, .2, .08, m.trim, Wm / 2, .1, .04, false); box(.08, .2, Hm, m.trim, .04, .1, Hm / 2, false); box(.08, .2, Hm, m.trim, Wm - .04, .1, Hm / 2, false);
  /* props */
  const lights = [], foot = [];
  const k = { m, group: () => new THREE.Group(), book: () => M(new THREE.Color().setHSL(rnd(), .35, .3 + rnd() * .15)),
    box: (g, w, h, d, mat, x, y, z, cast = true) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); o.castShadow = cast; o.receiveShadow = true; g.add(o); return o; },
    cyl: (g, r, h, mat, x, y, z) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), mat); o.position.set(x, y, z || 0); o.castShadow = o.receiveShadow = true; g.add(o); return o; } };
  for (const p of L.props || []) {
    const def = CATALOG[p.t]; if (!def) continue;
    const g = def.make(k); g.position.set(p.x, 0, p.z); g.rotation.y = -(p.rot || 0) * Math.PI / 180; S.add(g);
    const sw = (p.rot || 0) % 180 ? def.size[1] : def.size[0], sd = (p.rot || 0) % 180 ? def.size[0] : def.size[1];
    if (def.block) foot.push({ x: p.x - sw / 2, z: p.z - sd / 2, w: sw, h: sd, t: p.t });
    if (def.light) { const l = new THREE.PointLight(def.light.c, def.light.i * (mood === "night" ? 1.3 : 1), def.light.r, 1.5); l.position.set(p.x, def.light.y, p.z + (def.light.dz || 0)); l.castShadow = true; l.shadow.mapSize.set(512, 512); l.shadow.bias = -.002; S.add(l); lights.push({ x: p.x, z: p.z, r: def.light.r, c: def.light.c }); }
  }
  /* daylight */
  const day = { day: [1.4, 2.0], dim: [1.0, 1.0], night: [.35, .25] }[mood] || [1.2, 1.5];
  S.add(new THREE.HemisphereLight(0xb4c4dc, 0x4a3a2c, day[0]));
  const sun = new THREE.DirectionalLight(0xc8d8f0, day[1]); sun.position.set(Wm * .3, 12, -6); sun.target.position.set(Wm / 2, 0, Hm / 2); sun.castShadow = true; Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16 }); sun.shadow.mapSize.set(2048, 2048); S.add(sun, sun.target);
  return { scene: S, collide, foot, lights, exits };
}

/* the camera: tilted orthographic, framed to the room */
export function view(L, W = 1600, tiltDeg = 52, pad = 1.2) {
  const tilt = tiltDeg * Math.PI / 180, sin = Math.sin(tilt), cos = Math.cos(tilt), k = W / (L.w + pad * 2), H = Math.round((L.h * sin + 2.6 * cos + pad * 2 * sin) * k);
  return { W, H, k, sin, cos, tilt, cx: L.w / 2, cz: L.h / 2 - (1.3 * cos) / sin };
}
export function render(L, canvas, opt = {}) {
  const V = view(L, opt.W || 1600), { scene, collide, foot, lights, exits } = build(L);
  canvas.width = V.W; canvas.height = V.H;
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.25;
  const halfW = V.W / (2 * V.k), halfH = V.H / (2 * V.k), cam = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, .1, 100), dist = 30;
  cam.position.set(V.cx, Math.sin(V.tilt) * dist, V.cz + Math.cos(V.tilt) * dist); cam.lookAt(V.cx, 0, V.cz); R.render(scene, cam);
  return { view: V, collide, foot, lights, exits };
}
export const project = (V, x, z) => [V.W / 2 + (x - V.cx) * V.k, V.H / 2 + (z - V.cz) * V.sin * V.k];
