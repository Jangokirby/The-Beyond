/* A tiny .glb writer for tests and examples: boxes with named materials and empty named nodes (anchors).
   makeGlb([{ name, pos:[x,y,z], box:[w,h,d], material:"skin", color:"#rrggbb" }, { name:"anchor_head", pos:[0,1.6,0] }]) -> Buffer */
const hexf = (c) => [1, 3, 5].map((i) => Math.pow(parseInt((c || "#cccccc").slice(i, i + 2), 16) / 255, 2.2)).concat(1);
function boxGeo(w, h, d) { const x = w / 2, y = h / 2, z = d / 2, P = [], N = [], I = []; const faces = [[[1, 0, 0], [[x, -y, -z], [x, y, -z], [x, y, z], [x, -y, z]]], [[-1, 0, 0], [[-x, -y, z], [-x, y, z], [-x, y, -z], [-x, -y, -z]]], [[0, 1, 0], [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]]], [[0, -1, 0], [[-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z]]], [[0, 0, 1], [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]]], [[0, 0, -1], [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]]]];
  faces.forEach(([n, vs], f) => { vs.forEach((v) => { P.push(...v); N.push(...n); }); I.push(f * 4, f * 4 + 1, f * 4 + 2, f * 4, f * 4 + 2, f * 4 + 3); }); return { P: new Float32Array(P), N: new Float32Array(N), I: new Uint16Array(I), min: [-x, -y, -z], max: [x, y, z] }; }
module.exports = function makeGlb(items) {
  const bufs = [], views = [], acc = [], meshes = [], mats = [], matIdx = {}, nodes = []; let off = 0;
  const push = (arr, target) => { const b = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength), pad = (4 - (b.length % 4)) % 4; bufs.push(b, Buffer.alloc(pad)); views.push({ buffer: 0, byteOffset: off, byteLength: b.length, target }); off += b.length + pad; return views.length - 1; };
  for (const it of items) {
    const node = { name: it.name, translation: it.pos || [0, 0, 0] };
    if (it.box) { const g = boxGeo(...it.box), key = it.material || "default"; if (!(key in matIdx)) { matIdx[key] = mats.length; mats.push({ name: key, pbrMetallicRoughness: { baseColorFactor: hexf(it.color), metallicFactor: 0, roughnessFactor: .8 } }); }
      const pv = push(g.P, 34962), nv = push(g.N, 34962), iv = push(g.I, 34963); const a0 = acc.length; acc.push({ bufferView: pv, componentType: 5126, count: 24, type: "VEC3", min: g.min, max: g.max }, { bufferView: nv, componentType: 5126, count: 24, type: "VEC3" }, { bufferView: iv, componentType: 5123, count: 36, type: "SCALAR" });
      meshes.push({ name: it.name, primitives: [{ attributes: { POSITION: a0, NORMAL: a0 + 1 }, indices: a0 + 2, material: matIdx[key] }] }); node.mesh = meshes.length - 1; }
    nodes.push(node);
  }
  const root = { name: "Root", children: nodes.map((_, i) => i + 1) }, json = { asset: { version: "2.0", generator: "beyond-test" }, scene: 0, scenes: [{ nodes: [0] }], nodes: [root, ...nodes], meshes, materials: mats, accessors: acc, bufferViews: views, buffers: [{ byteLength: off }] };
  let js = Buffer.from(JSON.stringify(json)); js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)]); const bin = Buffer.concat(bufs), total = 12 + 8 + js.length + 8 + bin.length;
  const h = Buffer.alloc(12); h.writeUInt32LE(0x46546c67, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(total, 8); const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length, 0); c1.writeUInt32LE(0x4e4f534a, 4); const c2 = Buffer.alloc(8); c2.writeUInt32LE(bin.length, 0); c2.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([h, c1, js, c2, bin]);
};
