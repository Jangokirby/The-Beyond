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
import { GLTFLoader } from "./lib/GLTFLoader.js";
export { THREE };

const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const tex = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t; };
const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .85, metalness: 0, ...o });

/* ---------------------------------------------------------------- surfaces */
const FLOORS = {
  wood: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { const y = i * h / 8; g.fillStyle = `hsl(${28 + rnd() * 6},${30 + rnd() * 8}%,${24 + rnd() * 8}%)`; g.fillRect(0, y, w, h / 8 - 2); g.strokeStyle = "rgba(0,0,0,.35)"; g.strokeRect(0, y, w, h / 8 - 2); } }),
  stone: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const c = 78 + rnd() * 26 | 0; g.fillStyle = `rgb(${c},${c - 4},${c - 10})`; g.fillRect(i * 128, j * 128, 126, 126); } }),
  tile: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? "#cfd0c8" : "#2e3a3c"; g.fillRect(i * 64, j * 64, 62, 62); } }),
  grass: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#4f6a3a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 2200; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "30,60,25" : "120,150,70"},${rnd() * .22})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 4, 2 + rnd() * 6); } }),
  snow: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#dfe7ee"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "150,170,190" : "255,255,255"},${rnd() * .25})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 7, 2 + rnd() * 5); } }),
  cobble: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#4b4a47"; g.fillRect(0, 0, w, h); for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const c = 70 + rnd() * 40 | 0; g.fillStyle = `rgb(${c},${c - 3},${c - 8})`; g.fillRect(i * 32 + (j % 2) * 16 - 16, j * 32, 29, 29); } }),
  sand: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#b9a374"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "120,95,55" : "240,220,170"},${rnd() * .2})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 4, 1 + rnd() * 3); } }),
  asphalt: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#35373a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1800; i++) { const c = 40 + rnd() * 50 | 0; g.fillStyle = `rgba(${c},${c},${c + 4},${rnd() * .5})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); } g.fillStyle = "rgba(230,200,90,.55)"; g.fillRect(0, h / 2 - 3, w * .55, 6); }),
  carpet: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#5b4452"; g.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "30,20,30" : "160,130,150"},${rnd() * .15})`; g.fillRect(rnd() * w, rnd() * h, 2, 2); } }),
  marble: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const c = 205 + rnd() * 30 | 0; g.fillStyle = `rgb(${c},${c - 2},${c - 6})`; g.fillRect(i * 128, j * 128, 126, 126); g.strokeStyle = "rgba(90,90,100,.25)"; g.beginPath(); g.moveTo(i * 128 + rnd() * 120, j * 128); g.lineTo(i * 128 + rnd() * 120, j * 128 + 126); g.stroke(); } }),
  metal: () => tex(512, 512, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const c = 62 + rnd() * 16 | 0; g.fillStyle = `rgb(${c},${c + 5},${c + 12})`; g.fillRect(i * 128, j * 128, 126, 126); g.fillStyle = "rgba(255,255,255,.18)"; for (const [x, y] of [[8, 8], [114, 8], [8, 114], [114, 114]]) g.fillRect(i * 128 + x, j * 128 + y, 5, 5); } g.fillStyle = "rgba(90,200,230,.5)"; g.fillRect(0, 250, w, 4); }),
  flag: () => tex(512, 512, (g, w, h) => { g.fillStyle = "#4a4945"; g.fillRect(0, 0, w, h); for (let j = 0; j < 4; j++) { let x = (j % 2) * 40; while (x < w) { const ww = 90 + rnd() * 70, c = 84 + rnd() * 30 | 0; g.fillStyle = `rgb(${c},${c - 2},${c - 8})`; g.fillRect(x, j * 128, ww - 3, 125); x += ww; } } }),
  water: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#2f5566"; g.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(190,225,235,${rnd() * .25})`; g.beginPath(); const x = rnd() * w, y = rnd() * h; g.moveTo(x, y); g.lineTo(x + 8 + rnd() * 18, y); g.stroke(); } }),
  gravel: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#6b665e"; g.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { const c = 70 + rnd() * 90 | 0; g.fillStyle = `rgb(${c},${c - 4},${c - 10})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 3, 2 + rnd() * 3); } }),
  dirt: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#4a3a2a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "20,14,8" : "120,96,64"},${rnd() * .18})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 5, 2 + rnd() * 5); } })
};
const WALLS = {
  plaster: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#cfc8b4"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "90,80,60" : "255,255,240"},${rnd() * .07})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 2 + rnd() * 6); } }),
  brick: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#6a3b2c"; g.fillRect(0, 0, w, h); for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) { g.fillStyle = `hsl(${10 + rnd() * 8},${40 + rnd() * 10}%,${28 + rnd() * 8}%)`; g.fillRect(i * 44 + (j % 2) * 22, j * 32, 42, 30); } }),
  wood: () => tex(256, 256, (g, w, h) => { for (let i = 0; i < 6; i++) { g.fillStyle = `hsl(${26 + rnd() * 6},${26}%,${30 + rnd() * 8}%)`; g.fillRect(i * 43, 0, 41, h); } }),
  stone: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#6f6d68"; g.fillRect(0, 0, w, h); for (let j = 0; j < 6; j++) { let x = (j % 2) * 30; while (x < w) { const ww = 50 + rnd() * 40, c = 100 + rnd() * 30 | 0; g.fillStyle = `rgb(${c},${c - 3},${c - 9})`; g.fillRect(x, j * 43, ww - 3, 40); x += ww; } } }),
  metal: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#50585f"; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(i * 64, 0, 3, h); g.fillStyle = "rgba(100,220,255,.55)"; g.fillRect(i * 64 + 28, 200, 8, 3); } g.fillStyle = "rgba(90,200,230,.5)"; g.fillRect(0, 128, w, 3); }),
  adobe: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#b99a6e"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${rnd() < .5 ? "90,65,40" : "240,215,170"},${rnd() * .1})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 7, 2 + rnd() * 5); } }),
  tin: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#7d7f78"; g.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.14)"; g.fillRect(i * 22, 0, 11, h); } for (let i = 0; i < 25; i++) { g.fillStyle = "rgba(140,70,30,.25)"; g.fillRect(rnd() * w, rnd() * h, 8 + rnd() * 20, 6 + rnd() * 12); } }),
  whitewash: () => tex(256, 256, (g, w, h) => { g.fillStyle = "#e4e0d4"; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,110,90,${rnd() * .06})`; g.fillRect(rnd() * w, rnd() * h, 3 + rnd() * 6, 3 + rnd() * 6); } }),
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
  fireplace: { name: "Fireplace", tags: ["tavern", "domestic", "study"], size: [1.8, .6], block: true, light: { c: 0xff8a3a, i: 9, r: 8, y: .5, dz: .5 }, make: (k) => { const g = k.group(); if (k.fp) { k.box(g, 1.7, 2.6, .5, k.m.brick, 0, 1.3, -.05); k.box(g, 1.0, 1.05, .12, k.m.dark, 0, .53, .2); k.box(g, .8, .6, .06, k.m.fire, 0, .4, .22); k.box(g, 2.1, .1, .75, k.m.dark, 0, 1.4, .05); k.box(g, 1.5, .05, .7, k.m.dark, 0, .03, .2); return g; } k.box(g, 1.8, 1.6, .6, k.m.brick, 0, .8, 0); k.box(g, 1.0, .9, .1, k.m.fire, 0, .55, .26); k.box(g, 2.0, .1, .7, k.m.dark, 0, 1.65, 0); return g; } },
  lamp_table: { name: "Lamp on a table", tags: ["any", "medical", "domestic"], size: [.5, .5], block: true, light: { c: 0xffc27a, i: 14, r: 8.5, y: .95 }, make: (k) => { const g = k.group(); k.box(g, .5, .5, .5, k.m.wood, 0, .25, 0); k.cyl(g, .09, .22, k.m.brass, 0, .6); const b = new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 8), k.m.glass); b.position.set(0, .78, 0); g.add(b); return g; } },
  lamp_floor: { name: "Standing lamp", tags: ["any", "modern", "1890+"], size: [.4, .4], block: false, light: { c: 0xffd9a0, i: 12, r: 8, y: 1.7 }, make: (k) => { const g = k.group(); k.cyl(g, .14, .04, k.m.iron, 0, .02); k.cyl(g, .02, 1.6, k.m.iron, 0, .8); const b = new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, .26, 12), k.m.glass); b.position.set(0, 1.7, 0); g.add(b); return g; } },
  candle: { name: "Candle", tags: ["any", "church", "1800-"], size: [.3, .3], block: false, light: { c: 0xffb060, i: 5, r: 4.5, y: .5 }, make: (k) => { const g = k.group(); k.cyl(g, .03, .25, k.m.sheet, 0, .12); const b = new THREE.Mesh(new THREE.SphereGeometry(.03, 8, 6), k.m.glass); b.position.set(0, .28, 0); g.add(b); return g; } },
  rug: { name: "Rug", tags: ["domestic", "study", "tavern"], size: [2.4, 1.6], block: false, make: (k) => { const g = k.group(); k.box(g, 2.4, .02, 1.6, k.m.rug, 0, .01, 0, false); k.box(g, 2.0, .025, 1.2, k.m.rug2, 0, .015, 0, false); return g; } },
  pillar: { name: "Pillar", tags: ["any", "church", "cellar"], size: [.6, .6], block: true, make: (k) => { const g = k.group(); k.cyl(g, .3, 2.6, k.m.stone, 0, 1.3); return g; } },
  sink: { name: "Sink", tags: ["medical", "domestic", "kitchen"], size: [1.0, .6], block: true, make: (k) => { const g = k.group(); k.box(g, 1, .9, .6, k.m.sheet, 0, .45, 0); k.box(g, .7, .04, .4, k.m.iron, 0, .92, 0); return g; } },
  gramophone: { name: "Gramophone", tags: ["1900-1960", "domestic"], size: [.7, .6], block: true, make: (k) => { const g = k.group(); k.box(g, .7, .8, .6, k.m.wood, 0, .4, 0); k.cyl(g, .3, .06, k.m.dark, 0, .83); const h = new THREE.Mesh(new THREE.ConeGeometry(.28, .5, 14, 1, true), k.m.brass); h.position.set(.1, 1.15, 0); h.rotation.z = -.9; h.castShadow = true; g.add(h); return g; } },
  crate_med: { name: "Medical crate", tags: ["medical", "military"], size: [.9, .6], block: true, make: (k) => { const g = k.group(); k.box(g, .9, .5, .6, k.m.crate, 0, .25, 0); k.box(g, .3, .22, .02, k.m.red, 0, .3, .31); return g; } }
};


/* ---------------------------------------------------------------- pieces defined as DATA (so a person or an AI can add one without writing code)
   A spec: { id, name, tags:[...], size:[w,d], block:true|false, light:{c,i,r,y}|null,
             parts:[ { shape:"box|cyl|cone|sphere", size:[w,h,d] | r,h | r, pos:[x,y,z], rot:[rx,ry,rz] (degrees), mat:"wood"|"#8a3b2e" } ],
             model: { file:"models/chest.glb", scale:1, rotY:0, yOffset:0 }   // instead of parts: a glTF/GLB model, sized by its scale }
   Spec files live in public/lab/pieces/ and are listed in pieces/index.json. */
const MODELS = {};
export function registerPiece(s) {
  const mat = (k, m) => (typeof k === "string" && k[0] === "#" ? M(new THREE.Color(k)) : m[k] || m.dark);
  CATALOG[s.id] = { name: s.name || s.id, tags: s.tags || [], size: s.size || [1, 1], block: s.block !== false, light: s.light || undefined, data: true, spec: s,
    make: (k) => {
      const g = k.group();
      if (s.model) { const src = MODELS[s.model.file]; if (src) { const o = src.clone(true); o.scale.setScalar(s.model.scale || 1); o.rotation.y = (s.model.rotY || 0) * Math.PI / 180; o.position.y = s.model.yOffset || 0; o.traverse((c) => { if (c.isMesh) { c.castShadow = c.receiveShadow = true; } }); g.add(o); } return g; }
      for (const p of s.parts || []) {
        let geo; const sz = p.size || [1, 1, 1];
        if (p.shape === "cyl") geo = new THREE.CylinderGeometry(p.r || .2, p.r || .2, p.h || 1, 16); else if (p.shape === "cone") geo = new THREE.ConeGeometry(p.r || .2, p.h || 1, 16); else if (p.shape === "sphere") geo = new THREE.SphereGeometry(p.r || .2, 14, 10); else geo = new THREE.BoxGeometry(sz[0], sz[1], sz[2]);
        const o = new THREE.Mesh(geo, mat(p.mat, k.m)); o.position.set(...(p.pos || [0, 0, 0])); if (p.rot) o.rotation.set(...p.rot.map((d) => d * Math.PI / 180)); o.castShadow = o.receiveShadow = true; g.add(o);
      }
      return g;
    } };
}
/* read the spec files (from the web in the browser, from disk in Node) and register them */
export async function loadPieces(read) {
  const get = read || (async (u) => { const r = await fetch(new URL(u, import.meta.url)); if (!r.ok) throw new Error(u + " " + r.status); return r.json(); });
  let idx = []; try { idx = await get("./pieces/index.json"); } catch (e) { return 0; }
  try { idx = [...idx, ...(await get("./pieces/index.local.json"))]; } catch (e) { /* no local pieces: normal */ }   // index.local.json lists licensed packs kept out of git
  let n = 0; for (const f of idx) { try { const spec = await get("./pieces/" + f); for (const s of Array.isArray(spec) ? spec : [spec]) { registerPiece(s); n++; } } catch (e) { console.warn("piece", f, e.message); } }
  try { let ks = []; try { ks = await get("./kits/index.json"); } catch (e) {} try { ks = [...ks, ...(await get("./kits/index.local.json"))]; } catch (e) {} for (const f of ks) { try { const k = await get("./kits/" + f); KITS[k.id] = k; } catch (e) { console.warn("kit", f, e.message); } } } catch (e) {}
  return n;
}
/* terrain: a height map and a map picture made by Overlord's Forge (public/lab/terrain/<id>/). Optional;
   a layout with  terrain: { heightmap, map, relief }  gets rolling ground instead of a flat floor. */
const TERRAIN = {};
function loadHeights(file) {
  return new Promise((res) => { const im = new Image(); im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d"); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, im.width, im.height).data; const h = new Float32Array(im.width * im.height); for (let i = 0; i < h.length; i++) h[i] = d[i * 4] / 255; res({ h, cols: im.width, rows: im.height }); }; im.onerror = () => { console.warn("terrain failed", file); res(null); }; im.src = new URL("./" + file, import.meta.url).href; });
}
/* the ground's height (m) at x, z on a layout, for standing props on hills */
export function groundAt(L, x, z) {
  const t = L.terrain && TERRAIN[L.terrain.heightmap]; if (!t) return 0;
  const u = Math.min(1, Math.max(0, x / L.w)) * (t.cols - 1), v = Math.min(1, Math.max(0, z / L.h)) * (t.rows - 1);
  const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, at = (a, b) => t.h[Math.min(t.rows - 1, b) * t.cols + Math.min(t.cols - 1, a)];
  return ((at(i, j) * (1 - fu) + at(i + 1, j) * fu) * (1 - fv) + (at(i, j + 1) * (1 - fu) + at(i + 1, j + 1) * fu) * fv) * (L.terrain.relief ?? 1.5);
}
/* MODULAR KITS: a kit names the pieces that make walls, doors, windows, corners and floor tiles, all on a grid.
   kit = { id, name, grid (metres a wall piece spans), wall, corner?, door?, window?, floor?, floorGrid?, rot? (degrees to turn wall/door/window pieces), offset? ([x,y,z] metres to slide them) }.  Wall pieces face +z (toward the room when on the north wall), centred on x, standing on y=0.
   A room uses a kit with style.kit = "<id>". Files: kits/<id>.json, listed in kits/index.json (or kits/index.local.json, which is not committed). */
export const KITS = {};
/* models used by a layout must be loaded before it is built */
export async function prepare(L) {
  if (L.terrain && L.terrain.heightmap && !TERRAIN[L.terrain.heightmap]) { const t = await loadHeights(L.terrain.heightmap); if (t) TERRAIN[L.terrain.heightmap] = t; }
  if (L.terrain && L.terrain.map && !TERRAIN[L.terrain.map]) { try { const tx = await new THREE.TextureLoader().loadAsync(new URL("./" + L.terrain.map, import.meta.url).href); tx.colorSpace = THREE.SRGBColorSpace; TERRAIN[L.terrain.map] = tx; } catch (e) { console.warn("terrain picture failed", L.terrain.map); } }
  const need = new Set(); const kitIds = []; { const kt = L.style && L.style.kit && KITS[L.style.kit]; if (kt) for (const k of ["wall", "corner", "door", "window", "floor"]) if (kt[k]) kitIds.push({ t: kt[k] }); } for (const p of [...(L.props || []), ...kitIds]) { const d = CATALOG[p.t]; if (d && d.spec && d.spec.model && !MODELS[d.spec.model.file]) need.add(d.spec.model.file); }
  await Promise.all([...need].map((f) => new Promise((res) => new GLTFLoader().load(new URL("./" + f, import.meta.url).href, (g) => { MODELS[f] = g.scene; res(); }, undefined, () => { console.warn("model failed", f); res(); }))));
}
/* the size of a model file, for the importer */
export function measureModel(file) { return new Promise((res, rej) => new GLTFLoader().load(new URL("./" + file, import.meta.url).href, (g) => { const b = new THREE.Box3().setFromObject(g.scene), s = new THREE.Vector3(); b.getSize(s); res({ w: s.x, h: s.y, d: s.z }); }, undefined, rej)); }

/* ---------------------------------------------------------------- the builder */
export function build(L, opt = {}) {
  const S = new THREE.Scene(), mood = (L.style && L.style.mood) || "day", Wm = L.w, Hm = L.h, T = .3, WH = 2.6;
  S.background = new THREE.Color(0x0b0d10);
  const out = !!(L.style && L.style.outdoor), KIT = !out && L.style && L.style.kit && KITS[L.style.kit], draw = !out && !KIT, kitJobs = [];   // outdoors: no walls are drawn, the ground runs on past the edges
  const floorMap = FLOORS[(L.style && L.style.floor) || "wood"](); floorMap.repeat.set((Wm + (out ? 20 : 2)) / 4, (Hm + (out ? 20 : 2)) / 4);
  const wallMap = WALLS[(L.style && L.style.wall) || "plaster"]();
  const m = { floor: M(0xffffff, { map: floorMap, roughness: .9 }), wall: M(0xffffff, { map: wallMap }), trim: M(0x5a4636), iron: M(0x59606b, { roughness: .55, metalness: .35 }), sheet: M(0xe9e4d6), blanket: M(0x6b7b5e), wood: M(0x9a6f46), dark: M(0x6a4c34), glass: M(0xffe9b0, { emissive: 0xffd48a, emissiveIntensity: 1.6 }), win: M(0x9bb4cf, { emissive: 0x6f8fb8, emissiveIntensity: .9 }), brass: M(0xb18b3a, { metalness: .7, roughness: .4 }), crate: M(0xa98250), canvas: M(0xb8ad8c), brick: M(0x7a4332), stone: M(0x8a8780), fire: M(0xff9a40, { emissive: 0xff7a20, emissiveIntensity: 2 }), rug: M(0x7a2f2f), rug2: M(0xb59a5a), metalBlue: M(0x4a6a86), red: M(0xb0302a), neon: M(0x66f0ff, { emissive: 0x33d8ff, emissiveIntensity: 2.2 }), neonp: M(0xff66cc, { emissive: 0xff2fa8, emissiveIntensity: 2.2 }), neong: M(0x7dff9a, { emissive: 0x2fe070, emissiveIntensity: 2 }), screen: M(0x9fe8ff, { emissive: 0x4ab8e0, emissiveIntensity: 1.4 }), holo: M(0x7fd8ff, { emissive: 0x3aa8e8, emissiveIntensity: 1.8, transparent: true, opacity: .65 }), torch: M(0xffb050, { emissive: 0xff8a20, emissiveIntensity: 2.4 }), steel: M(0x8a929a, { metalness: .6, roughness: .4 }), white: M(0xe8e8e4), black: M(0x1c1d20), gold: M(0xc9a23a, { metalness: .7, roughness: .35 }), rust: M(0x8a4a2a), leather: M(0x5a3a28), cloth: M(0x9a3a3a), cloth2: M(0x2f4f7a), straw: M(0xc8aa5a), thatch: M(0x9a8040), ice: M(0xbfe0ef, { transparent: true, opacity: .8 }), water: M(0x3a6f86, { transparent: true, opacity: .85 }), bone: M(0xd8d2bc), leaf: M(0x3e7a3a), yellow: M(0xd8b030), greenm: M(0x4a6a4a) };
  const add = (o, cast = true) => { o.castShadow = cast; o.receiveShadow = true; S.add(o); return o; };
  const box = (w, h, d, mat, x, y, z, cast = true) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); return add(o, cast); };
  const ter = L.terrain && TERRAIN[L.terrain.heightmap];
  box(Wm + (out ? 20 : 2), .1, Hm + (out ? 20 : 2), m.floor, Wm / 2, -.05, Hm / 2, false);
  if (ter) {   /* rolling ground over the floor, coloured by its own map picture */
    const geo = new THREE.PlaneGeometry(Wm, Hm, ter.cols - 1, ter.rows - 1); geo.rotateX(-Math.PI / 2); geo.translate(Wm / 2, 0, Hm / 2);
    const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, ter.h[i] * (L.terrain.relief ?? 1.5) + .01); geo.computeVertexNormals();
    const map = (L.terrain.map && TERRAIN[L.terrain.map]) || null;
    const o = new THREE.Mesh(geo, M(map ? 0xffffff : 0x55704a, map ? { map, roughness: .95 } : { roughness: .95 })); add(o, false);
  }
  if (out) S.background = new THREE.Color({ day: 0x6f8f6a, dim: 0x3a4a44, night: 0x0a0e14 }[mood] || 0x3a4a44);
  /* walls: default is the room's outline */
  const walls = (L.walls && L.walls.length) ? L.walls : [{ a: [0, 0], b: [Wm, 0] }, { a: [Wm, 0], b: [Wm, Hm] }, { a: [0, Hm], b: [Wm, Hm] }, { a: [0, 0], b: [0, Hm] }];
  const cuts = []; const collide = []; const exits = [];
  for (const w of walls) {
    const horiz = Math.abs(w.a[1] - w.b[1]) < .01, len = horiz ? Math.abs(w.b[0] - w.a[0]) : Math.abs(w.b[1] - w.a[1]), c0 = horiz ? Math.min(w.a[0], w.b[0]) : Math.min(w.a[1], w.b[1]), fix = horiz ? w.a[1] : w.a[0];
    const near = horiz && fix > Hm / 2 + .01;   // walls on the near side are cut down so the camera can see over them
    const hh = opt.firstPerson ? WH : (horiz && fix > .01) ? (near ? .5 : 1.2) : WH;   // first person: every wall is full height, you are inside the room
    const ops = [...(L.doors || []).map((d) => ({ ...d, door: true })), ...(L.windows || []).map((d) => ({ ...d }))].filter((o) => (horiz ? o.axis === "h" && Math.abs(o.z - fix) < .2 && o.x >= c0 - .01 && o.x <= c0 + len + .01 : o.axis === "v" && Math.abs(o.x - fix) < .2 && o.z >= c0 - .01 && o.z <= c0 + len + .01)).sort((p, q) => (horiz ? p.x - q.x : p.z - q.z));
    if (KIT && !near) { /* modular wall: pieces along this wall, door and window pieces in their openings */
      const rot = horiz ? (fix < Hm / 2 ? 0 : 180) : (fix < Wm / 2 ? 270 : 90), grid = KIT.grid || 2; let q0 = c0;
      const fillWall = (a, b, id) => { const n = Math.max(1, Math.round((b - a) / grid)), sx = (b - a) / (n * grid); if (b - a < .05) return; for (let i = 0; i < n; i++) { const c = a + (i + .5) * (b - a) / n; kitJobs.push([id, horiz ? c : fix, horiz ? fix : c, rot, sx]); } };
      for (const o of ops) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; fillWall(q0, a, KIT.wall); const id = o.door ? (KIT.door || null) : (KIT.window || KIT.wall); if (id) kitJobs.push([id, horiz ? c : fix, horiz ? fix : c, rot, (b - a) / grid]); q0 = b; }
      fillWall(q0, c0 + len, KIT.wall);
    }
    let p = c0;
    const solid = (a, b, h, y0, mat = m.wall) => { if (b - a < .02 || !draw) return; if (horiz) box(b - a, h, T, mat, (a + b) / 2, y0 + h / 2, fix); else box(T, h, b - a, mat, fix, y0 + h / 2, (a + b) / 2); };
    for (const o of ops) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; solid(p, a, hh, 0); if (o.door) { solid(a, b, Math.max(0, hh - 2.1), 2.1); exits.push({ x: horiz ? o.x : fix, z: horiz ? fix : o.z, w: o.w || 1.4, axis: o.axis }); cuts.push([a, b, horiz, fix]); if (opt.firstPerson && draw) { const dw = Math.max(.6, b - a - .12), rc = .22, sg = horiz ? (fix < Hm / 2 ? -1 : 1) : (fix < Wm / 2 ? -1 : 1), cx = (a + b) / 2; /* the door sits 22 cm back in the wall, inside a thick frame, so it shows in a depth picture */ if (horiz) { box(.12, 2.15, .3, m.dark, a + .06, 1.07, fix - sg * .1); box(.12, 2.15, .3, m.dark, b - .06, 1.07, fix - sg * .1); box(b - a, .14, .3, m.dark, cx, 2.14, fix - sg * .1); } else { box(.3, 2.15, .12, m.dark, fix - sg * .1, 1.07, a + .06); box(.3, 2.15, .12, m.dark, fix - sg * .1, 1.07, b - .06); box(.3, .14, b - a, m.dark, fix - sg * .1, 2.14, cx); } if (horiz) { box(dw, 2.08, .1, m.dark, (a + b) / 2, 1.04, fix + sg * rc); box(.1, .14, .16, m.brass, (a + b) / 2 + dw / 2 - .15, 1.0, fix + sg * rc + (fix < Hm / 2 ? .08 : -.08)); } else { box(.1, 2.08, dw, m.dark, fix + sg * rc, 1.04, (a + b) / 2); box(.16, .14, .1, m.brass, fix + sg * rc + (fix < Wm / 2 ? .08 : -.08), 1.0, (a + b) / 2 + dw / 2 - .15); } } } else { solid(a, b, Math.min(.9, hh), 0); if (hh > 1.1) solid(a, b, Math.max(0, hh - 1.9), 1.9); if (hh > 1.1 && draw) { if (horiz) box(b - a - .1, 1.0, .06, m.win, (a + b) / 2, 1.4, fix); else box(.06, 1.0, b - a - .1, m.win, fix, 1.4, (a + b) / 2); } } p = b; }
    solid(p, c0 + len, hh, 0);
    /* collision: the wall's solid spans (doors are gaps; windows block) */
    let q = c0; for (const o of ops) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; if (!o.door) continue; if (a > q) collide.push(horiz ? [q, fix, a, fix] : [fix, q, fix, a]); q = b; }
    if (q < c0 + len) collide.push(horiz ? [q, fix, c0 + len, fix] : [fix, q, fix, c0 + len]);
    for (const o of ops) if (!o.door) { const c = horiz ? o.x : o.z, a = c - (o.w || 1.3) / 2, b = c + (o.w || 1.3) / 2; collide.push(horiz ? [a, fix, b, fix] : [fix, a, fix, b]); }
  }
  /* baseboards on the back and side walls */
  if (draw) { box(Wm, .2, .08, m.trim, Wm / 2, .1, .04, false); box(.08, .2, Hm, m.trim, .04, .1, Hm / 2, false); box(.08, .2, Hm, m.trim, Wm - .04, .1, Hm / 2, false); }
  /* props */
  const lights = [], foot = [];
  const k = { fp: !!opt.firstPerson, m, group: () => new THREE.Group(), book: () => M(new THREE.Color().setHSL(rnd(), .35, .3 + rnd() * .15)),
    box: (g, w, h, d, mat, x, y, z, cast = true) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); o.castShadow = cast; o.receiveShadow = true; g.add(o); return o; },
    cyl: (g, r, h, mat, x, y, z) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), mat); o.position.set(x, y, z || 0); o.castShadow = o.receiveShadow = true; g.add(o); return o; } };
  for (const p of L.props || []) {
    const def = CATALOG[p.t]; if (!def) continue;
    const g = def.make(k); g.position.set(p.x, ter ? groundAt(L, p.x, p.z) : 0, p.z); g.rotation.y = -(p.rot || 0) * Math.PI / 180; S.add(g);
    const sw = (p.rot || 0) % 180 ? def.size[1] : def.size[0], sd = (p.rot || 0) % 180 ? def.size[0] : def.size[1];
    if (def.block) foot.push({ x: p.x - sw / 2, z: p.z - sd / 2, w: sw, h: sd, t: p.t });
    if (def.light) { const l = new THREE.PointLight(def.light.c, def.light.i * (mood === "night" ? 1.3 : 1), def.light.r, 1.5); l.position.set(p.x, def.light.y, p.z + (def.light.dz || 0)); l.castShadow = true; l.shadow.mapSize.set(512, 512); l.shadow.bias = -.002; S.add(l); lights.push({ x: p.x, z: p.z, r: def.light.r, c: def.light.c }); }
  }
  if (KIT) {
    const put = (id, x, z, rot, sx = 1, fix = true) => { const def = CATALOG[id]; if (!def) return; const inner = def.make(k); if (fix) { inner.position.set(...(KIT.offset || [0, 0, 0])); inner.rotation.y = -(KIT.rot || 0) * Math.PI / 180; } const g = new THREE.Group(); g.add(inner); g.position.set(x, 0, z); g.rotation.y = -(rot || 0) * Math.PI / 180; g.scale.x = sx; S.add(g); };   // kit.rot / kit.offset line a pack's pivots up with the convention
    for (const j of kitJobs) put(...j);
    if (KIT.corner) for (const [x, z] of [[0, 0], [Wm, 0], [0, Hm], [Wm, Hm]]) if (z < Hm / 2) put(KIT.corner, x, z, x < Wm / 2 ? 0 : 90);
    if (KIT.floor) { const g2 = KIT.floorGrid || KIT.grid || 2; for (let x = g2 / 2; x < Wm; x += g2) for (let z = g2 / 2; z < Hm; z += g2) put(KIT.floor, x, z, 0, 1, false); }
  }
  if (opt.firstPerson && draw) { box(Wm + .2, .12, Hm + .2, m.wall, Wm / 2, WH + .06, Hm / 2, false); }   // a ceiling
  /* daylight */
  const day = (out ? { day: [1.7, 2.4], dim: [1.0, 1.1], night: [.3, .35] } : { day: [1.4, 2.0], dim: [1.0, 1.0], night: [.35, .25] })[mood] || [1.2, 1.5];
  S.add(new THREE.HemisphereLight(0xb4c4dc, 0x4a3a2c, opt.firstPerson && !out ? day[0] * 1.6 : day[0]));
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
