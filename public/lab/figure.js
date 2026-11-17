/* FIGURES: a person built from simple swappable parts. The face can be nearly blank; hair, hat, clothes, build and colour give the impression.
   A figure is a small description (spec). Every part is DATA: a list of shapes. Add a part = add an entry to HAIR, HATS, OUTFITS, EYES, BROWS, MOUTHS.
   Shape: { s:"box"|"cyl"|"sphere"|"cone", size:[w,h,d] | r, r2 (cyl bottom radius), h, pos:[x,y,z], rot:[deg,deg,deg], sc:[x,y,z], c:"#hex" or "$skin|$hair|$c1|$c2|$c3|$dark" }
   Units are metres, y is up, the figure faces +z and stands on y = 0.  x is mirrored for left and right where a part has "mirror: true". */
import * as THREE from "./lib/three.module.js";

export const EYES = {
  dot: [{ s: "sphere", r: .014, pos: [.04, 1.57, .108], c: "$dark", mirror: true }],
  wide: [{ s: "sphere", r: .02, pos: [.04, 1.57, .106], c: "#f2f0e8", mirror: true }, { s: "sphere", r: .01, pos: [.04, 1.57, .122], c: "$dark", mirror: true }],
  narrow: [{ s: "box", size: [.03, .008, .01], pos: [.04, 1.57, .112], c: "$dark", mirror: true }]
};
/* brow tilt is in degrees; positive lifts the inner end (worried), negative lowers it (stern) */
export const BROWS = {
  flat: { tilt: 0, y: 1.608 }, worried: { tilt: 18, y: 1.612 }, stern: { tilt: -20, y: 1.6 }, raised: { tilt: 6, y: 1.625 }
};
export const MOUTHS = {
  line: [{ s: "box", size: [.05, .008, .01], pos: [0, 1.5, .112], c: "$dark" }],
  frown: [{ s: "box", size: [.032, .008, .01], pos: [0, 1.497, .112], c: "$dark" }, { s: "box", size: [.016, .008, .01], pos: [.03, 1.489, .108], rot: [0, 0, -35], c: "$dark" }, { s: "box", size: [.016, .008, .01], pos: [-.03, 1.489, .108], rot: [0, 0, 35], c: "$dark" }],
  smile: [{ s: "box", size: [.032, .008, .01], pos: [0, 1.495, .112], c: "$dark" }, { s: "box", size: [.016, .008, .01], pos: [.03, 1.503, .108], rot: [0, 0, 35], c: "$dark" }, { s: "box", size: [.016, .008, .01], pos: [-.03, 1.503, .108], rot: [0, 0, -35], c: "$dark" }],
  open: [{ s: "sphere", r: .017, pos: [0, 1.498, .108], sc: [1.3, 1, .5], c: "#3a1618" }]
};
export const HAIR = {
  none: [],
  bun: [{ s: "sphere", r: .126, pos: [0, 1.6, -.03], sc: [1, .92, 1], c: "$hair" }, { s: "sphere", r: .05, pos: [0, 1.66, -.115], c: "$hair" }],
  short: [{ s: "sphere", r: .128, pos: [0, 1.6, -.025], sc: [1, .9, 1], c: "$hair" }],
  long: [{ s: "sphere", r: .128, pos: [0, 1.6, -.03], sc: [1, .92, 1], c: "$hair" }, { s: "box", size: [.25, .3, .08], pos: [0, 1.46, -.1], c: "$hair" }],
  bald: []
};
export const HATS = {
  none: [],
  nurse_veil: [{ s: "cyl", r: .135, h: .05, pos: [0, 1.655, -.01], c: "#f0eee6" }, { s: "box", size: [.26, .22, .02], pos: [0, 1.52, -.135], rot: [-8, 0, 0], c: "#f0eee6" }, { s: "box", size: [.034, .01, .01], pos: [0, 1.66, .125], c: "#b02a2a" }, { s: "box", size: [.01, .034, .01], pos: [0, 1.66, .125], c: "#b02a2a" }],
  flat_cap: [{ s: "cyl", r: .14, h: .045, pos: [0, 1.65, -.005], c: "$c3" }, { s: "box", size: [.2, .012, .09], pos: [0, 1.632, .13], c: "$c3" }],
  top_hat: [{ s: "cyl", r: .16, h: .012, pos: [0, 1.64, 0], c: "#18181a" }, { s: "cyl", r: .1, h: .2, pos: [0, 1.74, 0], c: "#18181a" }],
  helmet: [{ s: "sphere", r: .14, pos: [0, 1.62, -.005], sc: [1, .85, 1.05], c: "#6b6f55" }, { s: "cyl", r: .17, h: .012, pos: [0, 1.6, 0], c: "#6b6f55" }]
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

const mat = (c, spec, o) => new THREE.MeshStandardMaterial({ color: new THREE.Color(({ $skin: spec.skin, $hair: spec.hairColor, $c1: o.c1, $c2: o.c2, $c3: o.c3, $dark: "#241c18" })[c] || c), roughness: .85, metalness: 0 });
function geo(p) {
  if (p.s === "cyl") return new THREE.CylinderGeometry(p.r2 ? p.r : p.r, p.r2 || p.r, p.h, 20);
  if (p.s === "cone") return new THREE.ConeGeometry(p.r, p.h, 16);
  if (p.s === "sphere") return new THREE.SphereGeometry(p.r, 20, 14);
  return new THREE.BoxGeometry(...p.size);
}
function put(g, p, spec, o, flip) {
  const m = new THREE.Mesh(geo(p), mat(p.c, spec, o)); const x = p.pos[0] * (flip ? -1 : 1);
  m.position.set(x, p.pos[1], p.pos[2]); if (p.rot) m.rotation.set(...p.rot.map((d, i) => d * Math.PI / 180 * (flip && i === 2 ? -1 : 1))); if (p.sc) m.scale.set(...p.sc);
  m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function addList(g, list, spec, o) { for (const p of list || []) { put(g, p, spec, o, false); if (p.mirror) put(g, p, spec, o, true); } }

/* build a figure from a spec: { skin, hairColor, hair, hat, outfit, eyes, brows, mouth, h (height m), w (width scale) } */
export function buildFigure(spec) {
  const o = OUTFITS[spec.outfit] || OUTFITS.suit_modern, g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const sk = { ...spec, skin: spec.skin || SKINS[1], hairColor: spec.hairColor || "#3a2a1e" };
  const parts = [
    { s: "cyl", r: .07, h: .8, pos: [.09, .4, 0], c: o.legs }, { s: "cyl", r: .07, h: .8, pos: [-.09, .4, 0], c: o.legs },
    { s: "box", size: [.11, .06, .22], pos: [.09, .03, .04], c: o.shoe }, { s: "box", size: [.11, .06, .22], pos: [-.09, .03, .04], c: o.shoe },
    ...(o.skirt ? [{ s: "cyl", r: .2, r2: .31, h: .82, pos: [0, .5, 0], c: o.c1 }] : []),
    { s: "cyl", r: .17, r2: .19, h: .52, pos: [0, 1.12, 0], sc: [1.05, 1, .8], c: o.c1 },
    { s: "cyl", r: .052, h: .12, pos: [0, 1.4, 0], c: "$skin" },
    { s: "cyl", r: .052, h: .55, pos: [.235, 1.09, 0], rot: [0, 0, 7], c: o.c1 }, { s: "cyl", r: .052, h: .55, pos: [-.235, 1.09, 0], rot: [0, 0, -7], c: o.c1 },
    { s: "sphere", r: .05, pos: [.265, .8, 0], c: "$skin" }, { s: "sphere", r: .05, pos: [-.265, .8, 0], c: "$skin" },
    { s: "sphere", r: .12, pos: [0, 1.55, 0], sc: [.92, 1.08, 1], c: "$skin" },
    { s: "sphere", r: .016, pos: [0, 1.545, .118], sc: [1, 1.2, 1], c: "$skin" }];
  addList(body, parts, sk, o); addList(body, o.extra, sk, o);
  addList(body, EYES[spec.eyes || "dot"], sk, o); addList(body, MOUTHS[spec.mouth || "line"], sk, o); addList(body, HAIR[spec.hair || "none"], sk, o); addList(body, HATS[spec.hat || "none"], sk, o);
  const br = BROWS[spec.brows || "flat"];
  for (const side of [1, -1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(.05, .009, .01), mat("$hair", sk, o)); m.position.set(.042 * side, br.y, .108); m.rotation.z = -br.tilt * side * Math.PI / 180 * -1; m.castShadow = true; body.add(m); }
  const s = (spec.h || 1.68) / 1.68; body.scale.set(s * (spec.w || 1), s, s * (spec.w || 1)); return g;
}

/* draw a figure (or several views of it) onto a canvas.  views: [{ x, y, w, h (pixels), cam:"full"|"head", yaw (deg) }] */
export function renderFigure(spec, canvas, views) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); r.setSize(canvas.width, canvas.height, false); r.shadowMap.enabled = true; r.setScissorTest(true); r.setClearColor(0x1b2028);
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0x1b2028); const fig = buildFigure(spec); sc.add(fig);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.2, 40), new THREE.MeshStandardMaterial({ color: 0x2a303a, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
  sc.add(new THREE.HemisphereLight(0xdfe8ff, 0x403830, 1.15)); const d = new THREE.DirectionalLight(0xfff0dc, 2.1); d.position.set(1.5, 3, 2.5); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 }); sc.add(d);
  for (const v of views) {
    r.setViewport(v.x, canvas.height - v.y - v.h, v.w, v.h); r.setScissor(v.x, canvas.height - v.y - v.h, v.w, v.h); r.setClearColor(0x1b2028); r.clear();
    const cam = new THREE.PerspectiveCamera(v.cam === "head" ? 22 : 30, v.w / v.h, .1, 20), yaw = (v.yaw || 0) * Math.PI / 180, dist = v.cam === "head" ? 1.55 : 5.2, ty = v.cam === "head" ? 1.55 : .86;
    cam.position.set(Math.sin(yaw) * dist, ty + (v.cam === "head" ? .02 : .5), Math.cos(yaw) * dist); cam.lookAt(0, ty, 0); r.render(sc, cam);
  }
  return canvas.toDataURL("image/png");
}
