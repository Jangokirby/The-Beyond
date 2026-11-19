// Image generation through a local backend. Supported:
//  - a1111: AUTOMATIC1111 / Forge / SD.Next / KoboldCpp (/sdapi/v1/txt2img)
//  - comfy: ComfyUI (/prompt + /history + /view), with a built-in or pasted workflow
//  - openai: OpenAI-style /v1/images/generations (LocalAI, stable-diffusion.cpp server...)
//  - none: drawn placeholder portraits
// Images are stored as blobs in IndexedDB and referenced by id.
import { S } from "./state.js";
import * as db from "./store.js";

let chain = Promise.resolve();
export let queued = 0;
const listeners = new Set();
export const onImage = (fn) => listeners.add(fn);

export const NEGATIVE = "child, teen, underage, minor, young-looking, childlike, school uniform, loli, cartoon, anime, illustration, 3d render, cgi, painting, deformed, disfigured, bad anatomy, extra fingers, extra limbs, mutated hands, blurry face, watermark, text, logo, multiple people, duplicate, plus-size, obese";

export function enabled() { return S.settings.imgBackend && S.settings.imgBackend !== "none"; }

// Queue an image; returns a promise for the image id. `key` makes it idempotent.
export function generate({ key, prompt, seed, kind = "photo" }) {
  queued++;
  const job = chain.then(async () => {
    try {
      const existing = await db.get("images", key);
      if (existing) return key;
      const blob = await render(prompt, seed, kind);
      await db.put("images", key, { blob, prompt, seed, at: Date.now() });
      listeners.forEach((f) => f(key));
      return key;
    } finally { queued--; }
  });
  chain = job.catch(() => {});
  return job;
}

const urlCache = new Map();
export async function url(key) {
  if (!key) return null;
  if (urlCache.has(key)) return urlCache.get(key);
  const rec = await db.get("images", key);
  if (!rec) return null;
  const u = URL.createObjectURL(rec.blob);
  urlCache.set(key, u);
  return u;
}

async function render(prompt, seed, kind) {
  const st = S.settings;
  const [w, h] = (st.imgSize || "512x768").split("x").map(Number);
  const neg = (st.imgNegative || NEGATIVE);
  const pos = (st.imgPrefix ? st.imgPrefix + ", " : "") + prompt;
  const base = (st.imgUrl || "").trim().replace(/\/+$/, "");
  if (st.imgBackend === "a1111") {
    const body = { prompt: pos, negative_prompt: neg, steps: +st.imgSteps || 24, width: w, height: h, cfg_scale: +st.imgCfg || 6, seed, sampler_name: st.imgSampler || "DPM++ 2M", batch_size: 1, n_iter: 1 };
    if (st.imgFaceRestore) body.restore_faces = true;
    const res = await fetch(base + "/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error("Image server said " + res.status);
    const j = await res.json();
    return b64ToBlob(j.images[0]);
  }
  if (st.imgBackend === "openai") {
    const u = /\/v1$/.test(base) ? base : base + "/v1";
    const res = await fetch(u + "/images/generations", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + (st.llmKey || "local") }, body: JSON.stringify({ prompt: pos + " | negative: " + neg, negative_prompt: neg, size: `${w}x${h}`, n: 1, response_format: "b64_json", seed, steps: +st.imgSteps || 24, model: st.imgModel || undefined }) });
    if (!res.ok) throw new Error("Image server said " + res.status);
    const j = await res.json();
    const d = j.data[0];
    if (d.b64_json) return b64ToBlob(d.b64_json);
    return await (await fetch(d.url)).blob();
  }
  if (st.imgBackend === "comfy") {
    let wf;
    const vars = { "%prompt%": pos, "%negative%": neg, "%seed%": seed, "%width%": w, "%height%": h, "%steps%": +st.imgSteps || 24, "%cfg%": +st.imgCfg || 6, "%ckpt%": st.imgModel || "model.safetensors" };
    const tpl = st.comfyWorkflow && st.comfyWorkflow.trim() ? st.comfyWorkflow : JSON.stringify(DEFAULT_COMFY);
    let txt = tpl;
    for (const [k, v] of Object.entries(vars)) txt = txt.split(JSON.stringify(k)).join(JSON.stringify(v)).split(k).join(String(v).replace(/"/g, '\\"'));
    wf = JSON.parse(txt);
    const res = await fetch(base + "/prompt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: wf, client_id: "afterglow" }) });
    if (!res.ok) throw new Error("ComfyUI said " + res.status + " " + (await res.text()).slice(0, 200));
    const { prompt_id } = await res.json();
    for (let i = 0; i < 600; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const hr = await fetch(base + "/history/" + prompt_id);
      const hj = await hr.json();
      const entry = hj[prompt_id];
      if (!entry) continue;
      for (const node of Object.values(entry.outputs || {})) {
        if (node.images && node.images.length) {
          const im = node.images[0];
          const v = await fetch(`${base}/view?filename=${encodeURIComponent(im.filename)}&subfolder=${encodeURIComponent(im.subfolder || "")}&type=${im.type || "output"}`);
          return await v.blob();
        }
      }
      if (entry.status && entry.status.status_str === "error") throw new Error("ComfyUI workflow failed");
    }
    throw new Error("ComfyUI timed out");
  }
  throw new Error("No image generator set");
}

function b64ToBlob(b64) {
  const s = atob(b64.replace(/^data:image\/\w+;base64,/, ""));
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return new Blob([a], { type: "image/png" });
}

export async function test() {
  const blob = await render("Vertical portrait, realistic phone selfie of an adult woman, 25 years old, smiling, natural light", 1234, "test");
  return URL.createObjectURL(blob);
}

// ---------- prompts (framework v9 template) ----------
export function lockedDescription(w) {
  return `a ${w.age}-year-old adult ${w.ethnicity} woman, ${w.height}, ${w.bodyDesc} body, ${w.athletic}, ${w.breasts} breasts, ${w.hips}, ${w.skin} skin, ${w.hair.color} ${w.hair.texture} ${w.hair.length} hair ${w.hair.style}${w.marks.length ? ", " + w.marks.join(", ") : ""}`;
}

// spec: { top, bottom, underwear, location, pose, expression, level, anchor }
export function photoPrompt(w, spec) {
  const time = new Date().getHours();
  const tod = time < 6 ? "night" : time < 11 ? "morning" : time < 17 ? "afternoon" : time < 21 ? "evening" : "night";
  const wearing = spec.level >= 4 ? `She is completely nude${w.pubic ? ", " + w.pubic + " pubic hair" : ""}` :
    spec.level === 3 ? `She is topless, wearing only ${spec.bottomOnly || "panties"}` :
    spec.level === 2 ? `She is wearing only ${spec.underwear}` :
    `She is currently wearing: ${spec.top}${spec.bottom && !/nothing/.test(spec.bottom) ? ", " + spec.bottom : ""}`;
  return [
    "Vertical portrait orientation, realistic phone selfie photo-dump style.",
    `A realistic vertical phone selfie of ${lockedDescription(w)}.`,
    `FACE: ${w.face.join(", ")}. The face must be clearly the same person as the anchor photo.`,
    wearing + ".",
    `Location: ${spec.location}, ${tod}.`,
    `Pose and expression: ${spec.pose || "arm's-length front camera selfie"}, ${spec.expression || "relaxed natural smile"}.`,
    spec.level >= 5 ? "Explicit, intimate pose." : "",
    "Style: natural phone camera look, realistic skin texture, casual lighting, no heavy filters, slightly imperfect framing. Same face, facial structure, eye shape, nose, lips, jawline, body proportions, hair and skin tone as the anchor photo.",
  ].filter(Boolean).join(" ");
}

const DEFAULT_COMFY = {
  "4": { class_type: "CheckpointLoaderSimple", inputs: { ckpt_name: "%ckpt%" } },
  "5": { class_type: "EmptyLatentImage", inputs: { width: "%width%", height: "%height%", batch_size: 1 } },
  "6": { class_type: "CLIPTextEncode", inputs: { text: "%prompt%", clip: ["4", 1] } },
  "7": { class_type: "CLIPTextEncode", inputs: { text: "%negative%", clip: ["4", 1] } },
  "3": { class_type: "KSampler", inputs: { seed: "%seed%", steps: "%steps%", cfg: "%cfg%", sampler_name: "dpmpp_2m", scheduler: "karras", denoise: 1, model: ["4", 0], positive: ["6", 0], negative: ["7", 0], latent_image: ["5", 0] } },
  "8": { class_type: "VAEDecode", inputs: { samples: ["3", 0], vae: ["4", 2] } },
  "9": { class_type: "SaveImage", inputs: { filename_prefix: "afterglow", images: ["8", 0] } },
};
