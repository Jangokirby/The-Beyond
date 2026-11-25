/* TOY-STYLE FIGURES (reference: smooth rounded low-poly character packs). Big round head, thick capsule limbs, soft shapes, simple painted face.
   Same idea as figure.js (a small spec; swappable parts as data) but a different build: capsules, lathes and smooth shading instead of boxes.
   spec: { skin, hairColor, hair, hat, outfit, eyes (iris colour), brows, mouth, h, w } */
import * as THREE from "./lib/three.module.js";

const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: .55, metalness: 0, ...o });
const cap = (g, mat, r, len, x, y, z, rot = [0, 0, 0], sc = [1, 1, 1]) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 18), mat); m.position.set(x, y, z); m.rotation.set(...rot.map((d) => d * Math.PI / 180)); m.scale.set(...sc); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
const ball = (g, mat, r, x, y, z, sc = [1, 1, 1]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), mat); m.position.set(x, y, z); m.scale.set(...sc); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
const lathe = (g, mat, pts, x, y, z, sc = [1, 1, 1], phi = [0, Math.PI * 2]) => { const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), 32, phi[0], phi[1]), mat); m.position.set(x, y, z); m.scale.set(...sc); m.castShadow = m.receiveShadow = true; m.material.side = THREE.DoubleSide; g.add(m); return m; };
const box = (g, mat, w, h, d, x, y, z, rot = [0, 0, 0]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.set(...rot.map((q) => q * Math.PI / 180)); m.castShadow = true; g.add(m); return m; };

export const OUTFITS = {
  nurse_ww1: (g, S) => { S.top = M("#7d8794"); const dress = S.top, white = M("#f3f1ea"), red = M("#c0392b"), shoe = M("#2a2423");
    lathe(g, dress, [[.12, 1.1], [.16, .98], [.2, .86], [.2, .62], [.3, .34], [.34, .06], [.34, .02]], 0, 0, 0, [1, 1, .85]);       // dress: smooth flared shape
    lathe(g, white, [[.135, 1.03], [.175, .9], [.195, .72], [.265, .46], [.3, .2]], 0, 0, .03, [1.045, 1, 1.07], [-.75, 1.5]); // apron: front arc only
    box(g, white, .22, .06, .05, 0, 1.06, .2); ball(g, white, .03, -.0, 1.0, .22);
    box(g, red, .06, .018, .01, 0, .9, .245); box(g, red, .018, .06, .01, 0, .9, .245);
    box(g, M("#2e2a28"), .3, .035, .2, 0, .72, 0);
    for (const s of [1, -1]) { cap(g, dress, .052, .3, .27 * s, 1.1, 0, [0, 0, 14 * s]); cap(g, white, .047, .12, .29 * s, .76, .02, [-8, 0, 6 * s]); ball(g, S.skin, .05, .3 * s, .66, .04); ball(g, S.skin, .022, .27 * s, .68, .08); cap(g, shoe, .05, .1, .1 * s, .04, .05, [90, 0, 0], [1, 1, 1.2]); } },
  coat_1920s: (g, S) => { S.top = M("#5a4a3c"); const coat = S.top, trim = M("#d8d0c0"), pants = M("#2e2a28"), shoe = M("#18181a");
    cap(g, coat, .17, .34, 0, 1.0, 0, [0, 0, 0], [1.1, 1, .8]); lathe(g, coat, [[.17, .88], [.2, .6], [.22, .42], [.21, .38]], 0, 0, 0, [1.05, 1, .8]);
    box(g, trim, .12, .05, .06, 0, 1.28, .12); for (const s of [1, -1]) { cap(g, pants, .062, .48, .095 * s, .34, 0); cap(g, coat, .055, .32, .27 * s, 1.05, 0, [0, 0, 12 * s]); cap(g, coat, .05, .26, .3 * s, .78, .02, [-6, 0, 5 * s]); ball(g, S.skin, .05, .31 * s, .62, .04); cap(g, shoe, .055, .1, .1 * s, .045, .05, [90, 0, 0], [1, 1, 1.2]); } },
  suit_modern: (g, S) => { S.top = M("#2f4a8a"); const suit = S.top, shirt = M("#f0f0ec"), tie = M("#c0392b"), shoe = M("#18181a");
    cap(g, suit, .16, .34, 0, 1.02, 0, [0, 0, 0], [1.15, 1, .78]); box(g, shirt, .1, .26, .02, 0, 1.12, .125); box(g, tie, .04, .22, .015, 0, 1.1, .135);
    for (const s of [1, -1]) { cap(g, suit, .068, .5, .09 * s, .34, 0); cap(g, suit, .055, .32, .27 * s, 1.08, 0, [0, 0, 13 * s]); cap(g, suit, .05, .26, .3 * s, .8, .02, [-6, 0, 5 * s]); ball(g, S.skin, .05, .31 * s, .64, .04); cap(g, shoe, .055, .1, .1 * s, .045, .05, [90, 0, 0], [1, 1, 1.25]); } }
};
export const HAIR = {
  none: () => {}, bald: () => {},
  bun: (g, c) => { ball(g, c, .206, 0, 1.485, -.035, [1, .88, 1.04]); ball(g, c, .07, 0, 1.68, -.14); },
  short: (g, c) => { ball(g, c, .203, 0, 1.485, -.03, [1, .86, 1.04]); },
  long: (g, c) => { ball(g, c, .206, 0, 1.485, -.035, [1, .88, 1.04]); cap(g, c, .16, .26, 0, 1.25, -.12, [0, 0, 0], [1, 1, .6]); },
  pony: (g, c) => { ball(g, c, .206, 0, 1.485, -.035, [1, .88, 1.04]); cap(g, c, .055, .34, 0, 1.3, -.24, [-18, 0, 0]); }
};
export const HATS = {
  none: () => {},
  nurse_veil: (g) => { const w = M("#f3f1ea"), r = M("#c0392b"); ball(g, w, .19, 0, 1.52, -.01, [1, .62, 1.02]); lathe(g, w, [[.0, .0], [.2, -.02], [.2, -.3], [.06, -.34]], 0, 1.5, -.15, [1, 1, .35]); box(g, r, .06, .018, .01, 0, 1.6, .185); box(g, r, .018, .06, .01, 0, 1.6, .185); },
  flat_cap: (g, c) => { ball(g, M("#4a4038"), .19, 0, 1.54, -.01, [1, .5, 1.05]); box(g, M("#4a4038"), .24, .02, .12, 0, 1.5, .17, [10, 0, 0]); },
  top_hat: (g) => { lathe(g, M("#1c1c1e"), [[.2, 0], [.2, .02], [.12, .03], [.12, .26], [.0, .26]], 0, 1.58, 0); }
};
export const EXPR = { // brows tilt (deg, + lifts inner end), mouth: line|smile|frown|open
  neutral: { tilt: 0, mouth: "line", eye: 1 }, worried: { tilt: 20, mouth: "frown", eye: 1.25 }, stern: { tilt: -22, mouth: "line", eye: .8 }, happy: { tilt: 6, mouth: "smile", eye: 1 }, shocked: { tilt: 12, mouth: "open", eye: 1.35 }
};

export function buildToy(spec) {
  const S = { skin: M(spec.skin || "#f0c9a8", { roughness: .6 }) }, hairM = M(spec.hairColor || "#6a4a2e", { roughness: .5 }), g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  (OUTFITS[spec.outfit] || OUTFITS.suit_modern)(body, S);
  cap(body, S.top || S.skin, .062, .34, 0, 1.2, 0, [0, 0, 90], [1, 1, .85]);       // shoulders
  cap(body, S.skin, .045, .06, 0, 1.28, 0);                                   // neck
  ball(body, S.skin, .19, 0, 1.46, 0, [1, 1.02, 1.02]);                        // big round head
  ball(body, S.skin, .02, 0, 1.425, .185, [1, 1.1, 1.2]);                      // nose
  for (const s of [1, -1]) ball(body, S.skin, .035, .19 * s, 1.44, 0, [.5, 1, .8]);   // ears
  const ex = EXPR[spec.expr || "neutral"] || EXPR.neutral, iris = M(spec.eyes || "#4a8ac0", { roughness: .3 }), white = M("#f6f6f2", { roughness: .3 }), dark = M("#2a1c18");
  for (const s of [1, -1]) {
    ball(body, white, .033 * ex.eye, .072 * s, 1.47, .165, [1, 1.15, .6]); ball(body, iris, .02 * ex.eye, .072 * s, 1.47, .183, [1, 1.1, .5]); ball(body, dark, .01, .072 * s, 1.47, .19, [1, 1, .5]);
    const b = box(body, hairM, .07, .016, .02, .075 * s, 1.535 + (ex.tilt > 10 ? .012 : 0), .16, [0, 0, -ex.tilt * s * -1]); b.rotation.y = -.25 * s;
  }
  const lip = M("#a8523f", { roughness: .4 });
  if (ex.mouth === "open") ball(body, M("#4a1a1a"), .026, 0, 1.36, .172, [1.2, 1, .45]);
  else if (ex.mouth === "smile") { for (const s of [1, -1]) box(body, lip, .03, .012, .014, .02 * s, 1.358, .177, [0, 0, -s * 14]); box(body, lip, .03, .012, .014, 0, 1.352, .18); }
  else if (ex.mouth === "frown") { box(body, lip, .04, .012, .014, 0, 1.352, .18); for (const s of [1, -1]) box(body, lip, .022, .012, .014, .032 * s, 1.345, .172, [0, 0, s * 30]); }
  else box(body, lip, .05, .012, .014, 0, 1.355, .18);
  (HAIR[spec.hair || "none"] || HAIR.none)(body, hairM); (HATS[spec.hat || "none"] || HATS.none)(body, hairM);
  const s = (spec.h || 1.6) / 1.6; body.scale.set(s * (spec.w || 1), s, s * (spec.w || 1)); return g;
}

export function renderToy(spec, canvas, views) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); r.setSize(canvas.width, canvas.height, false); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.setScissorTest(true);
  const sc = new THREE.Scene(); const fig = buildToy(spec); sc.add(fig);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.3, 40), new THREE.MeshStandardMaterial({ color: 0x8a92a0, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x9aa0ac, 1.5)); const d = new THREE.DirectionalLight(0xfff4e6, 2.2); d.position.set(2, 3.5, 3); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 }); sc.add(d);
  for (const v of views) {
    r.setViewport(v.x, canvas.height - v.y - v.h, v.w, v.h); r.setScissor(v.x, canvas.height - v.y - v.h, v.w, v.h); r.setClearColor(0x6b7384); r.clear();
    const cam = new THREE.PerspectiveCamera(v.cam === "head" ? 20 : 28, v.w / v.h, .1, 20), yaw = (v.yaw || 0) * Math.PI / 180, dist = v.cam === "head" ? 1.9 : 5.4, ty = v.cam === "head" ? 1.46 : .82;
    cam.position.set(Math.sin(yaw) * dist, ty + .1, Math.cos(yaw) * dist); cam.lookAt(0, ty, 0); r.render(sc, cam);
  }
}
