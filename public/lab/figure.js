/* FIGURES: a person built from simple swappable parts. The face can be nearly blank; hair, hat, clothes, build and colour give the impression.
   A figure is a small description (spec). Every part is DATA: a list of shapes. Add a part = add an entry to HAIR, HATS, OUTFITS, EYES, BROWS, MOUTHS.
   Shape: { s:"box"|"cyl"|"sphere"|"cone", size:[w,h,d] | r, r2 (cyl bottom radius), h, pos:[x,y,z], rot:[deg,deg,deg], sc:[x,y,z], c:"#hex" or "$skin|$hair|$c1|$c2|$c3|$dark" }
   Units are metres, y is up, the figure faces +z and stands on y = 0.  x is mirrored for left and right where a part has "mirror: true". */
import * as THREE from "./lib/three.module.js";

export const EYES = {
  dot: [{ s: "box", size: [.024, .02, .012], pos: [.042, 1.565, .108], c: "$dark", mirror: true }],
  wide: [{ s: "box", size: [.036, .034, .012], pos: [.042, 1.565, .106], c: "#f2f0e8", mirror: true }, { s: "box", size: [.016, .02, .012], pos: [.042, 1.565, .114], c: "$dark", mirror: true }],
  narrow: [{ s: "box", size: [.034, .009, .012], pos: [.042, 1.565, .11], c: "$dark", mirror: true }]
};
/* brow tilt is in degrees; positive lifts the inner end (worried), negative lowers it (stern) */
export const BROWS = {
  flat: { tilt: 0, y: 1.608 }, worried: { tilt: 18, y: 1.612 }, stern: { tilt: -20, y: 1.6 }, raised: { tilt: 6, y: 1.625 }
};
export const MOUTHS = {
  line: [{ s: "box", size: [.05, .008, .01], pos: [0, 1.5, .112], c: "$lip" }],
  frown: [{ s: "box", size: [.032, .008, .01], pos: [0, 1.497, .112], c: "$lip" }, { s: "box", size: [.016, .008, .01], pos: [.03, 1.489, .108], rot: [0, 0, -35], c: "$lip" }, { s: "box", size: [.016, .008, .01], pos: [-.03, 1.489, .108], rot: [0, 0, 35], c: "$lip" }],
  smile: [{ s: "box", size: [.032, .008, .01], pos: [0, 1.495, .112], c: "$lip" }, { s: "box", size: [.016, .008, .01], pos: [.03, 1.503, .108], rot: [0, 0, 35], c: "$lip" }, { s: "box", size: [.016, .008, .01], pos: [-.03, 1.503, .108], rot: [0, 0, -35], c: "$lip" }],
  open: [{ s: "box", size: [.034, .026, .012], pos: [0, 1.495, .108], c: "#3a1618" }]
};
export const HAIR = {
  none: [],
  bun: [{ s: "sphere", r: .142, d: 1, pos: [0, 1.595, -.035], sc: [1, .9, 1.05], c: "$hair" }, { s: "sphere", r: .05, pos: [0, 1.69, -.12], c: "$hair" },
    { s: "box", size: [.09, .035, .07], pos: [.06, 1.64, .1], rot: [0, 0, -18], c: "$hair" }, { s: "box", size: [.09, .035, .07], pos: [-.06, 1.64, .1], rot: [0, 0, 18], c: "$hair" }],
  short: [{ s: "sphere", r: .142, d: 1, pos: [0, 1.6, -.03], sc: [1, .88, 1.05], c: "$hair" }, { s: "box", size: [.1, .04, .08], pos: [.04, 1.655, .095], rot: [0, 0, -14], c: "$hair" }, { s: "box", size: [.1, .04, .08], pos: [-.05, 1.655, .095], rot: [0, 0, 20], c: "$hair" }],
  long: [{ s: "sphere", r: .142, d: 1, pos: [0, 1.6, -.035], sc: [1, .9, 1.05], c: "$hair" }, { s: "box", size: [.27, .34, .09], pos: [0, 1.45, -.1], rot: [4, 0, 0], c: "$hair" }, { s: "box", size: [.07, .26, .1], pos: [.125, 1.48, -.02], c: "$hair" }, { s: "box", size: [.07, .26, .1], pos: [-.125, 1.48, -.02], c: "$hair" }, { s: "box", size: [.1, .04, .08], pos: [.045, 1.655, .095], rot: [0, 0, -16], c: "$hair" }, { s: "box", size: [.1, .04, .08], pos: [-.05, 1.655, .095], rot: [0, 0, 22], c: "$hair" }],
  bald: []
};
export const HATS = {
  none: [],
  nurse_veil: [{ s: "box", size: [.28, .06, .26], pos: [0, 1.675, -.01], c: "#f0eee6" }, { s: "box", size: [.28, .22, .03], pos: [0, 1.55, -.15], rot: [-10, 0, 0], c: "#f0eee6" }, { s: "box", size: [.03, .24, .16], pos: [.14, 1.56, -.06], rot: [0, 0, -6], c: "#e4e1d8" }, { s: "box", size: [.03, .24, .16], pos: [-.14, 1.56, -.06], rot: [0, 0, 6], c: "#e4e1d8" }, { s: "box", size: [.04, .012, .012], pos: [0, 1.68, .13], c: "#b02a2a" }, { s: "box", size: [.012, .04, .012], pos: [0, 1.68, .13], c: "#b02a2a" }],
  flat_cap: [{ s: "cyl", r: .16, h: .05, seg: 8, pos: [0, 1.67, -.005], c: "$c3" }, { s: "box", size: [.2, .014, .1], pos: [0, 1.645, .14], rot: [8, 0, 0], c: "$c3" }],
  top_hat: [{ s: "cyl", r: .18, h: .014, seg: 8, pos: [0, 1.65, 0], c: "#18181a" }, { s: "cyl", r: .11, h: .22, seg: 8, pos: [0, 1.76, 0], c: "#18181a" }],
  helmet: [{ s: "sphere", r: .155, d: 1, pos: [0, 1.62, -.005], sc: [1, .9, 1.08], c: "#6b6f55" }, { s: "cyl", r: .19, h: .014, seg: 8, pos: [0, 1.6, 0], c: "#6b6f55" }]
};
/* an outfit gives the body its colours and extra pieces. c1 = main cloth, c2 = trim, c3 = accessory, legs/shoes colour */
export const OUTFITS = {
  nurse_ww1: { c1: "#6d7683", c2: "#f0eee6", c3: "#b02a2a", legs: "#d8d4cc", shoe: "#1c1a1a", skirt: true, extra: [
    { s: "box", size: [.27, .42, .02], pos: [0, 1.14, .183], c: "#f0eee6" },
    { s: "box", size: [.3, .62, .02], pos: [0, .5, .262], rot: [-8, 0, 0], c: "#f0eee6" },
    { s: "box", size: [.05, .014, .01], pos: [0, 1.2, .196], c: "#b02a2a" }, { s: "box", size: [.014, .05, .01], pos: [0, 1.2, .196], c: "#b02a2a" },
    { s: "box", size: [.12, .03, .1], pos: [0, 1.36, .13], c: "#f0eee6" },
    { s: "box", size: [.32, .035, .2], pos: [0, .93, 0], c: "#2e2a28" }] },
  coat_1920s: { c1: "#4a4038", c2: "#d8d0c0", c3: "#2e2824", legs: "#2e2a28", shoe: "#18181a", skirt: false, extra: [{ s: "box", size: [.12, .05, .08], pos: [0, 1.36, .12], c: "#d8d0c0" }] },
  tunic_medieval: { c1: "#7a5a3a", c2: "#c9b27a", c3: "#3a2a1a", legs: "#4a3a2a", shoe: "#2a1e14", skirt: true, extra: [{ s: "box", size: [.34, .04, .22], pos: [0, .95, 0], c: "#3a2a1a" }] },
  suit_modern: { c1: "#2e3440", c2: "#e8e8e4", c3: "#9a2a2a", legs: "#2a2e38", shoe: "#18181a", skirt: false, extra: [{ s: "box", size: [.04, .26, .01], pos: [0, 1.2, .192], c: "#9a2a2a" }] },
  jumpsuit_future: { c1: "#3a4a58", c2: "#66e0ff", c3: "#222a32", legs: "#3a4a58", shoe: "#222a32", skirt: false, extra: [{ s: "box", size: [.34, .02, .21], pos: [0, 1.2, 0], c: "#66e0ff" }] }
};
export const SKINS = ["#f1cfb0", "#e0b090", "#c08a62", "#8a5a3c", "#5a3a28"];

const shade = (hex, k) => new THREE.Color(hex).multiplyScalar(k);
const mat = (c, spec, o) => { const base = ({ $skin: spec.skin, $hair: spec.hairColor, $c1: o.c1, $c2: o.c2, $c3: o.c3, $dark: "#2a2020" })[c]; const col = c === "$lip" ? shade(spec.skin, .5) : new THREE.Color(base || c); return new THREE.MeshStandardMaterial({ color: col, roughness: .9, metalness: 0, flatShading: true }); };
/* a head is a low-poly ball with a narrowed jaw and a little chin: blank, but it reads as a face */
function headGeo(r) { const g = new THREE.IcosahedronGeometry(r, 1), pos = g.attributes.position; for (let i = 0; i < pos.count; i++) { let x = pos.getX(i) / r, y = pos.getY(i) / r, z = pos.getZ(i) / r; if (y < -.05) { const k = Math.min(1, (-y - .05) / .95); x *= 1 - .3 * k; z *= 1 - .12 * k; z += .06 * k * Math.max(0, z); } pos.setXYZ(i, x * r * .95, y * r * 1.12, z * r * 1.02); } g.computeVertexNormals(); return g; }
function geo(p) {
  if (p.s === "cyl") return new THREE.CylinderGeometry(p.r, p.r2 || p.r, p.h, p.seg || 7);
  if (p.s === "cone") return new THREE.ConeGeometry(p.r, p.h, p.seg || 4);
  if (p.s === "head") return headGeo(p.r);
  if (p.s === "sphere") return new THREE.IcosahedronGeometry(p.r, p.d === undefined ? 0 : p.d);
  return new THREE.BoxGeometry(...p.size);
}
function put(g, p, spec, o, flip) {
  const m = new THREE.Mesh(geo(p), mat(p.c, spec, o)); const x = p.pos[0] * (flip ? -1 : 1);
  m.position.set(x, p.pos[1], p.pos[2]); if (p.rot) m.rotation.set(...p.rot.map((d, i) => d * Math.PI / 180 * (flip && i === 2 ? -1 : 1))); if (p.sc) m.scale.set(...p.sc);
  m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function addList(g, list, spec, o, dz = 0) { for (const p of list || []) { const q = dz ? { ...p, pos: [p.pos[0], p.pos[1], p.pos[2] + dz] } : p; put(g, q, spec, o, false); if (p.mirror) put(g, q, spec, o, true); } }

/* build a figure from a spec: { skin, hairColor, hair, hat, outfit, eyes, brows, mouth, h (height m), w (width scale) } */
export function buildFigure(spec) {
  const o = OUTFITS[spec.outfit] || OUTFITS.suit_modern, g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const sk = { ...spec, skin: spec.skin || SKINS[1], hairColor: spec.hairColor || "#3a2a1e" };
  const parts = [
    { s: "cyl", r: .078, r2: .062, h: .46, pos: [.095, .64, 0], c: o.legs }, { s: "cyl", r: .078, r2: .062, h: .46, pos: [-.095, .64, 0], c: o.legs },
    { s: "cyl", r: .062, r2: .046, h: .42, pos: [.095, .22, 0], c: o.legs }, { s: "cyl", r: .062, r2: .046, h: .42, pos: [-.095, .22, 0], c: o.legs },
    { s: "box", size: [.1, .07, .24], pos: [.095, .035, .05], rot: [-6, 0, 0], c: o.shoe }, { s: "box", size: [.1, .07, .24], pos: [-.095, .035, .05], rot: [-6, 0, 0], c: o.shoe },
    ...(o.skirt ? [{ s: "cyl", r: .2, r2: .31, h: .8, seg: 8, pos: [0, .5, 0], c: o.c1 }] : []),
    { s: "cyl", r: .205, r2: .15, h: .46, seg: 6, pos: [0, 1.1, 0], sc: [1.12, 1, .78], c: o.c1 },
    { s: "box", size: [.46, .09, .22], pos: [0, 1.31, 0], rot: [0, 0, 0], c: o.c1 },
    { s: "cyl", r: .05, r2: .056, h: .12, seg: 6, pos: [0, 1.4, 0], c: "$skin" },
    { s: "cyl", r: .06, r2: .05, h: .3, pos: [.27, 1.15, 0], rot: [0, 0, 8], c: o.c1 }, { s: "cyl", r: .06, r2: .05, h: .3, pos: [-.27, 1.15, 0], rot: [0, 0, -8], c: o.c1 },
    { s: "cyl", r: .05, r2: .042, h: .28, pos: [.3, .89, .02], rot: [-6, 0, 4], c: o.c1 }, { s: "cyl", r: .05, r2: .042, h: .28, pos: [-.3, .89, .02], rot: [-6, 0, -4], c: o.c1 },
    { s: "box", size: [.075, .09, .05], pos: [.305, .72, .03], c: "$skin" }, { s: "box", size: [.075, .09, .05], pos: [-.305, .72, .03], c: "$skin" },
    { s: "head", r: .13, pos: [0, 1.55, 0], c: "$skin" },
    { s: "cone", r: .024, h: .06, seg: 4, pos: [0, 1.52, .125], rot: [90, 45, 0], c: "$skin" }];
  addList(body, parts, sk, o); addList(body, o.extra, sk, o);
  addList(body, EYES[spec.eyes || "dot"], sk, o, .014); addList(body, MOUTHS[spec.mouth || "line"], sk, o, .034); addList(body, HAIR[spec.hair || "none"], sk, o); addList(body, HATS[spec.hat || "none"], sk, o);
  const br = BROWS[spec.brows || "flat"];
  for (const side of [1, -1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(.058, .014, .014), mat("$hair", sk, o)); m.position.set(.044 * side, br.y + .004, .126); m.rotation.z = -br.tilt * side * Math.PI / 180 * -1; m.castShadow = true; body.add(m); }
  const s = (spec.h || 1.68) / 1.68; body.scale.set(s * (spec.w || 1), s, s * (spec.w || 1)); return g;
}

/* draw a figure (or several views of it) onto a canvas.  views: [{ x, y, w, h (pixels), cam:"full"|"head", yaw (deg) }] */
export function renderFigure(spec, canvas, views) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); r.setSize(canvas.width, canvas.height, false); r.shadowMap.enabled = true; r.setScissorTest(true); r.setClearColor(0x1b2028);
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0x1b2028); const fig = buildFigure(spec); sc.add(fig);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.2, 40), new THREE.MeshStandardMaterial({ color: 0x2a303a, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
  sc.add(new THREE.HemisphereLight(0xe8eeff, 0x7a6a5a, 1.6)); const d = new THREE.DirectionalLight(0xfff0dc, 2.1); d.position.set(1.5, 3, 2.5); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 }); sc.add(d);
  for (const v of views) {
    r.setViewport(v.x, canvas.height - v.y - v.h, v.w, v.h); r.setScissor(v.x, canvas.height - v.y - v.h, v.w, v.h); r.setClearColor(0x1b2028); r.clear();
    const cam = new THREE.PerspectiveCamera(v.cam === "head" ? 22 : 30, v.w / v.h, .1, 20), yaw = (v.yaw || 0) * Math.PI / 180, dist = v.cam === "head" ? 1.55 : 5.2, ty = v.cam === "head" ? 1.55 : .86;
    cam.position.set(Math.sin(yaw) * dist, ty + (v.cam === "head" ? .02 : .5), Math.cos(yaw) * dist); cam.lookAt(0, ty, 0); r.render(sc, cam);
  }
  return canvas.toDataURL("image/png");
}
