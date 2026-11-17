/* BUSTS: portrait mannequins. A smooth, blank head and shoulders; everything that makes a person is an add-on you can swap:
   brows, eyes, mouth, nose, moustache, beard, hair, hat, glasses, outfit (collar and shoulders). Skin and cloth colours are free.
   Every add-on is a function in a table below; add one = add one line. Units are metres, head centre is (0,0,0), the face looks along +z.
   spec: { skin, hairColor, clothColor, trimColor, hair, brows, eyes, mouth, nose, moustache, beard, hat, glasses, outfit, lips, yaw } */
import * as THREE from "./lib/three.module.js";

const A = .112, B = .145, C = .122;                               // head radii: width, height, depth
const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: .72, metalness: 0, ...o });
const add = (g, geo, mat, x, y, z, sc = [1, 1, 1], rot = [0, 0, 0]) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(...sc); m.rotation.set(...rot.map((d) => d * Math.PI / 180)); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
const sph = (r = 1) => new THREE.SphereGeometry(r, 40, 28), cap = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 20), box = (w, h, d) => new THREE.BoxGeometry(w, h, d), tor = (r, t, arc) => new THREE.TorusGeometry(r, t, 10, 40, arc);
const front = (x, y) => C * Math.sqrt(Math.max(0, 1 - (x / A) ** 2 - (y / B) ** 2));   // how far the face surface is in front of the centre at (x, y)
const sym = (g, fn) => { fn(1); fn(-1); };

function headGeo() { const g = new THREE.SphereGeometry(1, 48, 36), p = g.attributes.position; for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); if (y < 0) { const t = -y; x *= 1 - .2 * t * t; z *= 1 - .08 * t; } if (y < -.7) z += .04 * (-y - .7) * 3; p.setXYZ(i, x * A, y * B, z * C); } g.computeVertexNormals(); return g; }

export const BROWS = { flat: [0, .055], worried: [18, .058], stern: [-20, .05], raised: [8, .068], arched: [10, .06] };
export const EYES = {
  dot: (g, s, k) => sym(g, (q) => add(g, sph(.011), k.dark, .045 * q, .02, front(.045 * q, .02) + .002, [1, 1.2, .6])),
  closed: (g, s, k) => sym(g, (q) => add(g, tor(.02, .0045, Math.PI * .8), k.dark, .045 * q, .022, front(.045 * q, .022) + .002, [1, 1, .4], [0, 0, 180 + 18])),
  wide: (g, s, k) => sym(g, (q) => { add(g, sph(.021), k.white, .045 * q, .02, front(.045 * q, .02) + .003, [1, 1, .5]); add(g, sph(.011), k.dark, .045 * q, .02, front(.045 * q, .02) + .014, [1, 1, .4]); }),
  slit: (g, s, k) => sym(g, (q) => add(g, box(.036, .006, .01), k.dark, .045 * q, .02, front(.045 * q, .02) + .002)),
  visor: (g, s, k) => add(g, box(.2, .034, .03), M("#66e0ff", { emissive: 0x33b8e0, emissiveIntensity: 1.2, roughness: .3 }), 0, .02, front(0, .02) + .012, [1, 1, 1])
};
export const MOUTHS = {
  line: (g, s, k) => add(g, cap(.005, .045), k.lip, 0, -.062, front(0, -.062) + .002, [1, 1, .6], [0, 0, 90]),
  smile: (g, s, k) => add(g, tor(.03, .0055, Math.PI * .7), k.lip, 0, -.045, front(0, -.06) + .002, [1, 1, .5], [0, 0, -90 - 63]),
  frown: (g, s, k) => add(g, tor(.026, .0055, Math.PI * .65), k.lip, 0, -.088, front(0, -.06) + .002, [1, 1, .5], [0, 0, 90 - 58]),
  open: (g, s, k) => add(g, sph(.02), M("#3a1618"), 0, -.066, front(0, -.066) + .001, [1.3, 1.1, .4]),
  full: (g, s, k) => { add(g, cap(.008, .04), k.lip, 0, -.058, front(0, -.058) + .004, [1, 1, .7], [0, 0, 90]); add(g, cap(.007, .036), k.lip, 0, -.07, front(0, -.07) + .004, [1, 1, .7], [0, 0, 90]); }
};
export const NOSES = { small: (g, s, k) => add(g, sph(.017), k.skin, 0, -.012, front(0, -.012) + .004, [1, 1.35, 1.1]), long: (g, s, k) => add(g, sph(.019), k.skin, 0, -.02, front(0, -.02) + .006, [.9, 1.8, 1.3]), button: (g, s, k) => add(g, sph(.016), k.skin, 0, -.025, front(0, -.025) + .004, [1.1, 1, 1]), none: () => {} };
export const MOUSTACHES = {
  none: () => {}, thin: (g, s, k) => sym(g, (q) => add(g, cap(.006, .04), k.hair, .022 * q, -.045, front(.022 * q, -.045) + .006, [1, 1, .7], [0, 0, 90 - 14 * q])),
  full: (g, s, k) => sym(g, (q) => add(g, cap(.014, .05), k.hair, .028 * q, -.046, front(.028 * q, -.046) + .01, [1, 1, .8], [0, 0, 90 - 18 * q])),
  handlebar: (g, s, k) => sym(g, (q) => { add(g, cap(.011, .045), k.hair, .03 * q, -.048, front(.03 * q, -.048) + .01, [1, 1, .8], [0, 0, 90 + 8 * q]); add(g, sph(.012), k.hair, .066 * q, -.04, front(.066 * q, -.04) + .004); })
};
export const BEARDS = {
  none: () => {}, stubble: (g, s, k) => add(g, sph(1), M(s.hairColor, { roughness: .95, transparent: true, opacity: .45 }), 0, -.062, -.003, [A * 1.015, .098, C * 1.03]),
  goatee: (g, s, k) => add(g, sph(.034), k.hair, 0, -.116, front(0, -.116) + .002, [1, 1.5, .9]),
  full: (g, s, k) => { add(g, sph(1), k.hair, 0, -.092, .006, [A * 1.07, .088, C * 1.07]); add(g, sph(1), k.skin, 0, -.052, .024, [.05, .02, .09]).visible = false; },
  long: (g, s, k) => { add(g, sph(1), k.hair, 0, -.1, .008, [A * 1.07, .09, C * 1.07]); add(g, cap(.06, .1), k.hair, 0, -.2, .04, [1, 1, .65]); }
};
export const HAIR = {
  none: () => {}, bald: () => {},
  short: (g, s, k) => add(g, new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, Math.PI * .47), k.hair, 0, .016, -.016, [A * 1.1, B * 1.1, C * 1.12], [-24, 0, 0]),
  bun: (g, s, k) => { HAIR.short(g, s, k); add(g, sph(.06), k.hair, 0, .125, -.1); },
  long: (g, s, k) => { HAIR.short(g, s, k); add(g, cap(.1, .22), k.hair, 0, -.1, -.065, [1.05, 1, .7]); },
  bob: (g, s, k) => { HAIR.short(g, s, k); sym(g, (q) => add(g, cap(.04, .12), k.hair, .118 * q, -.045, -.02, [1, 1, 1.2])); add(g, sph(1), k.hair, 0, -.03, -.085, [A * 1.05, .1, .07]); },
  pony: (g, s, k) => { HAIR.short(g, s, k); add(g, cap(.04, .2), k.hair, 0, -.04, -.165, [1, 1, 1], [-18, 0, 0]); },
  curly: (g, s, k) => { for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r = .12 + (i % 3) * .01; add(g, sph(.045), k.hair, Math.cos(a) * r, .06 + (i % 4) * .035, Math.sin(a) * r * .9 - .02); } add(g, sph(1), k.hair, 0, .075, -.02, [A * 1.05, B * .9, C * 1.05]); },
  parted: (g, s, k) => { HAIR.short(g, s, k); add(g, cap(.05, .1), k.hair, .09, .07, .05, [.8, 1, .9], [0, 0, -30]); }
};
export const HATS = {
  none: () => {},
  nurse_veil: (g, s, k) => { const w = M("#f3f1ea"); add(g, sph(1), w, 0, .1, -.01, [A * 1.1, .07, C * 1.12]); add(g, box(.03, .02, .01), k.red, 0, .1, front(0, .1) + .045); add(g, box(.01, .03, .01), k.red, 0, .1, front(0, .1) + .045); add(g, box(.25, .2, .02), w, 0, -.02, -.135, [1, 1, 1], [-8, 0, 0]); sym(g, (q) => add(g, box(.02, .18, .12), M("#e8e6de"), .125 * q, .0, -.07)); },
  flat_cap: (g, s, k) => { const c = M(s.hatColor || "#4a4038"); add(g, sph(1), c, 0, .09, -.005, [A * 1.18, .06, C * 1.2]); add(g, box(.15, .012, .08), c, 0, .075, front(0, .075) + .045, [1, 1, 1], [10, 0, 0]); },
  top_hat: (g) => { const c = M("#1c1c1e"); add(g, new THREE.CylinderGeometry(.2, .2, .012, 32), c, 0, .1, 0); add(g, new THREE.CylinderGeometry(.115, .122, .2, 32), c, 0, .2, 0); add(g, new THREE.CylinderGeometry(.123, .123, .03, 32), M("#7a1e1e"), 0, .125, 0); },
  helmet: (g, s, k) => { const c = M("#6b6f55", { roughness: .5 }); add(g, new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, Math.PI * .5), c, 0, .035, 0, [A * 1.28, B * 1.1, C * 1.3]); add(g, new THREE.CylinderGeometry(.19, .19, .01, 40), c, 0, .045, 0, [1, 1, 1.05]); },
  cloche: (g, s, k) => add(g, new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, Math.PI * .5), M(s.hatColor || "#7a4a5a"), 0, .045, -.005, [A * 1.2, B * 1.12, C * 1.22], [-12, 0, 0]),
  wool_cap: (g, s, k) => { const c = M(s.hatColor || "#5a5a50"); add(g, new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, Math.PI * .5), c, 0, .035, -.005, [A * 1.14, B * 1.1, C * 1.16]); add(g, tor(.1, .016, Math.PI * 2), c, 0, .035, 0, [1.1, 1.15, 1], [90, 0, 0]); }
};
export const GLASSES = {
  none: () => {},
  round: (g, s, k) => { sym(g, (q) => add(g, tor(.032, .0045, Math.PI * 2), k.dark, .048 * q, .02, front(.048 * q, .02) + .008, [1, 1, .6])); add(g, box(.03, .005, .006), k.dark, 0, .028, front(0, .028) + .012); },
  square: (g, s, k) => { sym(g, (q) => { add(g, box(.07, .004, .006), k.dark, .048 * q, .052, front(.048 * q, .05) + .01); add(g, box(.07, .004, .006), k.dark, .048 * q, -.012, front(.048 * q, 0) + .01); add(g, box(.004, .066, .006), k.dark, .084 * q, .02, front(.08 * q, 0) + .008); add(g, box(.004, .066, .006), k.dark, .013 * q, .02, front(.013 * q, .02) + .01); }); }
};
/* an outfit gives the shoulders, chest and neckline. cloth = main colour, trim = collar/shirt colour */
export const OUTFITS = {
  plain: () => {},
  nurse: (g, s, k) => { const white = M("#f3f1ea"); add(g, sph(1), white, 0, -.37, .075, [.1, .11, .045]); add(g, tor(.058, .014, Math.PI * 2), white, 0, -.2, 0, [1.15, 1, 1], [90, 0, 0]); add(g, box(.012, .04, .008), k.red, 0, -.37, .12); add(g, box(.04, .012, .008), k.red, 0, -.37, .12); },
  coat: (g, s, k) => { add(g, box(.1, .1, .03), M(s.trimColor || "#d8d0c0"), 0, -.255, .1, [1, 1, 1], [-20, 0, 0]); sym(g, (q) => add(g, box(.08, .17, .02), k.cloth, .06 * q, -.28, .135, [1, 1, 1], [-14, 0, -24 * q])); add(g, tor(.07, .022, Math.PI * 2), k.cloth, 0, -.21, -.01, [1.1, 1, 1], [90, 0, 0]); },
  suit: (g, s, k) => { add(g, box(.1, .14, .012), M("#f2f2ee"), 0, -.29, .135, [1, 1, 1], [-14, 0, 0]); add(g, box(.032, .17, .01), k.red, 0, -.31, .14, [1, 1, 1], [-14, 0, 0]); sym(g, (q) => add(g, box(.07, .2, .015), k.cloth, .068 * q, -.3, .127, [1, 1, 1], [-14, 0, -22 * q])); },
  uniform: (g, s, k) => { add(g, tor(.062, .02, Math.PI * 2), k.cloth, 0, -.205, 0, [1.05, 1, 1], [90, 0, 0]); sym(g, (q) => add(g, box(.045, .025, .01), k.red, .075 * q, -.255, .125, [1, 1, 1], [-10, 0, -12 * q])); add(g, box(.18, .01, .01), M("#3a2a1c"), 0, -.46, .14, [1, 1, 1], [0, 0, 0]); },
  tunic: (g, s, k) => { add(g, tor(.06, .018, Math.PI * 2), M(s.trimColor || "#c9b27a"), 0, -.203, 0, [1, 1, 1], [90, 0, 0]); for (let i = 0; i < 4; i++) add(g, box(.05, .006, .006), M("#3a2a1a"), 0, -.25 - i * .03, .128 + i * .0, [1, 1, 1]); },
  jumpsuit: (g, s, k) => { add(g, tor(.065, .012, Math.PI * 2), M("#66e0ff", { emissive: 0x33b8e0, emissiveIntensity: 1.2 }), 0, -.205, 0, [1, 1, 1], [90, 0, 0]); sym(g, (q) => add(g, box(.012, .2, .008), M("#66e0ff", { emissive: 0x33b8e0, emissiveIntensity: 1 }), .07 * q, -.3, .12)); },
  shawl: (g, s, k) => { add(g, tor(.1, .04, Math.PI * 2), k.cloth, 0, -.25, .01, [1.2, 1.05, 1], [78, 0, 0]); }
};

export function buildBust(spec) {
  const k = { skin: M(spec.skin || "#e8c4a4"), hair: M(spec.hairColor || "#4a3322", { roughness: .55 }), cloth: M(spec.clothColor || "#6d7683", { roughness: .8 }), dark: M("#2a2020"), white: M("#f4f4ef", { roughness: .3 }), lip: M(spec.lips || shade(spec.skin || "#e8c4a4", .62)), red: M("#c0392b") }, g = new THREE.Group();
  const s = spec;
  add(g, headGeo(), k.skin, 0, 0, 0);
  add(g, cap(.048, .08), k.skin, 0, -.16, -.005);                                                    // neck
  add(g, cap(.085, .3), k.cloth, 0, -.27, 0, [1, 1, .75], [0, 0, 90]);                                // shoulders
  add(g, sph(1), k.cloth, 0, -.5, 0, [.17, .27, .1]);                                                 // chest
  sym(g, (q) => { add(g, cap(.055, .3), k.cloth, .205 * q, -.42, 0, [1, 1, .9], [0, 0, 6 * q]); add(g, sph(.034), k.skin, .105 * q, .0, 0.0, [.5, 1.2, .7]).position.set(.108 * q, -.005, -.005); });  // upper arms and ears
  const br = BROWS[s.brows || "flat"]; sym(g, (q) => add(g, cap(.0065, .042), k.hair, .045 * q, br[1], front(.045 * q, br[1]) + .004, [1, 1, .6], [0, 0, 90 - br[0] * q]));
  (EYES[s.eyes || "dot"])(g, s, k); (NOSES[s.nose || "small"])(g, s, k); (MOUTHS[s.mouth || "line"])(g, s, k); (MOUSTACHES[s.moustache || "none"])(g, s, k); (BEARDS[s.beard || "none"])(g, s, k);
  (OUTFITS[s.outfit || "plain"])(g, s, k); (HAIR[s.hair || "none"])(g, s, k); (HATS[s.hat || "none"])(g, s, k); (GLASSES[s.glasses || "none"])(g, s, k);
  g.rotation.y = (s.yaw || 0) * Math.PI / 180; return g;
}
function shade(hex, f) { return "#" + new THREE.Color(hex).multiplyScalar(f).getHexString(); }

/* draw one bust into a canvas (portrait framing) */
export function renderBust(spec, canvas, bg = 0x2b303a) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); r.setSize(canvas.width, canvas.height, false); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.setClearColor(bg);
  const sc = new THREE.Scene(); sc.background = new THREE.Color(bg); sc.add(buildBust(spec));
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a8076, 1.25)); const d = new THREE.DirectionalLight(0xfff0dc, 2.2); d.position.set(-1.2, 1.4, 2.2); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -1, right: 1, top: 1, bottom: -1 }); sc.add(d);
  const back = new THREE.DirectionalLight(0x9ab8ff, .7); back.position.set(1.5, 1, -1.5); sc.add(back);
  const cam = new THREE.PerspectiveCamera(24, canvas.width / canvas.height, .1, 20); cam.position.set(0, -.05, 1.9); cam.lookAt(0, -.1, 0); r.render(sc, cam); return canvas.toDataURL("image/png");
}
