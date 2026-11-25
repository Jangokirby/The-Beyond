/* CHARACTERS FROM 3D MODELS (.glb). A character is one BASE model plus swappable PARTS (hair, hat, beard, eyes, brows, mouth, nose, glasses, outfit, ...),
   attached at named anchor points and tinted by material name. The kit file is characters/kit.json; the rules for making models are in CHARACTER-IMPORT.md.
   spec: { base:"<base id>", parts:{ hair:"<part id>", hat:"<part id>", outfit:"<part id>", ... }, colors:{ skin, hair, cloth, trim, cloth2 }, morphs:{ name: 0..1 }, yaw }
   Models should be STATIC meshes (no skeleton): clones of rigged models are not supported. */
import * as THREE from "./lib/three.module.js"; import { GLTFLoader } from "./lib/GLTFLoader.js";

const cache = {};
const load = (file) => (cache[file] = cache[file] || new Promise((res, rej) => new GLTFLoader().load(new URL("./characters/models/" + file, import.meta.url).href, res, undefined, (e) => rej(new Error("cannot load " + file + ": " + (e && e.message || e))))));
export const SLOT_ANCHOR = { hair: "head", hat: "head", glasses: "face", brows: "face", eyes: "face", nose: "face", mouth: "face", moustache: "face", beard: "face", outfit: "origin", accessory: "origin", hands: "origin" };
export const TINTS = ["skin", "hair", "cloth", "cloth2", "trim"];   // material names that take a colour

export async function loadKit() { return (await fetch(new URL("./characters/kit.json", import.meta.url))).json(); }

/* what is inside a model: size, anchors (nodes named anchor_*), material names, morph target names, meshes, problems */
export async function inspectModel(file) {
  const g = await load(file), root = g.scene; root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), size = new THREE.Vector3(); box.getSize(size);
  const anchors = {}, meshes = [], mats = new Set(), morphs = new Set(); let skinned = false, tris = 0;
  root.traverse((o) => {
    if (/^anchor_/i.test(o.name)) { const p = new THREE.Vector3(); o.getWorldPosition(p); anchors[o.name.toLowerCase().slice(7)] = [+p.x.toFixed(4), +p.y.toFixed(4), +p.z.toFixed(4)]; }
    if (o.isMesh) { meshes.push(o.name); if (o.isSkinnedMesh) skinned = true; const gm = o.geometry; tris += gm.index ? gm.index.count / 3 : gm.attributes.position.count / 3; (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m && mats.add(m.name || "(unnamed)")); if (o.morphTargetDictionary) Object.keys(o.morphTargetDictionary).forEach((k) => morphs.add(k)); }
  });
  const problems = [];
  if (!meshes.length) problems.push("no meshes");
  if (skinned) problems.push("has a skeleton (skinned mesh): export as a static mesh, apply modifiers and delete the armature");
  if (size.y > 0 && (size.y > 4 || size.y < .02)) problems.push(`odd size ${size.y.toFixed(3)} m tall: models must be in metres`);
  if (mats.has("(unnamed)")) problems.push("some materials have no name: name them skin, hair, cloth, cloth2 or trim to make them tintable");
  return { size: { w: +size.x.toFixed(3), h: +size.y.toFixed(3), d: +size.z.toFixed(3) }, min: [box.min.x, box.min.y, box.min.z].map((v) => +v.toFixed(3)), anchors, meshes, materials: [...mats], morphs: [...morphs], triangles: Math.round(tris), skinned, problems };
}

const tint = (obj, colors) => obj.traverse((o) => { if (!o.isMesh) return; const arr = Array.isArray(o.material) ? o.material : [o.material]; const out = arr.map((m) => { const c = m.clone(), n = (m.name || "").toLowerCase(); const key = TINTS.find((t) => n === t || n.startsWith(t + ".") || n.startsWith(t + "_")); if (key && colors && colors[key]) c.color = new THREE.Color(colors[key]); return c; }); o.material = Array.isArray(o.material) ? out : out[0]; o.castShadow = o.receiveShadow = true; });
const anchorOf = (base, name, root) => { if (name === "origin") return new THREE.Vector3(0, 0, 0); const k = base.anchors && base.anchors[name]; if (k) return new THREE.Vector3(...k); const n = root.getObjectByName("anchor_" + name) || root.getObjectByName("Anchor_" + name); if (n) { const p = new THREE.Vector3(); n.getWorldPosition(p); return p; } return new THREE.Vector3(0, base.height ? base.height * ({ head: .93, face: .93, torso: .72 }[name] || .5) : 1, 0); };

export async function buildCharacter(spec, kit) {
  const base = (kit.bases || []).find((b) => b.id === spec.base); if (!base) throw new Error("no base model " + spec.base);
  const g = new THREE.Group(), gl = await load(base.file), body = gl.scene.clone(true); body.scale.setScalar(base.scale || 1); body.updateMatrixWorld(true); tint(body, spec.colors); g.add(body);
  const hide = new Set(); const used = [];
  for (const [slot, id] of Object.entries(spec.parts || {})) { if (!id) continue; const p = (kit.parts || []).find((x) => x.id === id && (!x.slot || x.slot === slot)); if (!p) throw new Error(`no part ${id} for slot ${slot}`); used.push([slot, p]); (p.hides || []).forEach((h) => hide.add(h)); }
  body.traverse((o) => { if (hide.has(o.name)) o.visible = false; });
  for (const [slot, p] of used) {
    const pg = (await load(p.file)).scene.clone(true); pg.scale.setScalar((base.scale || 1) * (p.scale || 1)); tint(pg, spec.colors);
    const a = anchorOf(base, SLOT_ANCHOR[slot] || "torso", body); const holder = new THREE.Group(); holder.position.copy(a).add(new THREE.Vector3(...(p.offset || [0, 0, 0]))); if (p.rot) holder.rotation.set(...p.rot.map((d) => d * Math.PI / 180)); holder.add(pg); g.add(holder);
  }
  g.traverse((o) => { if (o.isMesh && o.morphTargetDictionary && spec.morphs) for (const [k, v] of Object.entries(spec.morphs)) if (k in o.morphTargetDictionary) o.morphTargetInfluences[o.morphTargetDictionary[k]] = v; });
  g.rotation.y = (spec.yaw || 0) * Math.PI / 180; g.userData.base = base; g.userData.head = anchorOf(base, "head", body); return g;
}

const RENDERERS = new WeakMap();
/* view: "portrait" (head and shoulders, default) or "full" */
export async function renderCharacter(spec, kit, canvas, opt = {}) {
  let r = RENDERERS.get(canvas); if (!r) { r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; RENDERERS.set(canvas, r); }
  const bg = opt.bg === undefined ? 0x2b303a : opt.bg; r.setSize(canvas.width, canvas.height, false); r.setClearColor(bg);
  const sc = new THREE.Scene(); sc.background = new THREE.Color(bg); const fig = await buildCharacter(spec, kit); sc.add(fig);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a8076, 1.25)); const d = new THREE.DirectionalLight(0xfff0dc, 2.2); d.position.set(-1.2, 2.2, 2.4); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 }); sc.add(d);
  const back = new THREE.DirectionalLight(0x9ab8ff, .7); back.position.set(1.5, 1.5, -1.5); sc.add(back);
  const base = fig.userData.base, H = base.height || 1.7, head = fig.userData.head, pt = base.portrait || {}, full = opt.view === "full";
  /* portrait: head and shoulders with room for a tall hat. A base can override with portrait:{fov, extent (metres of height shown), dist, ty} */
  const fov = full ? 28 : (pt.fov || 24), ext = full ? H * 1.15 : (pt.extent || H * .46), dist = pt.dist && !full ? pt.dist : (ext / 2) / Math.tan(fov * Math.PI / 360);
  const ty = full ? H * .5 : (pt.ty !== undefined ? pt.ty : head.y - ext * .1); const cam = new THREE.PerspectiveCamera(fov, canvas.width / canvas.height, .05, 50); cam.position.set(0, ty + (full ? .3 : .02), dist); cam.lookAt(0, ty, 0); r.render(sc, cam);
  const url = canvas.toDataURL("image/png"); return url;
}
