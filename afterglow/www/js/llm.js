// Talks to a local OpenAI-compatible chat server (AI Box "Local API Server",
// KoboldCpp, LM Studio, llama.cpp server, Ollama...). One request at a time,
// because a phone-sized model can only think about one girl at once.
import { S } from "./state.js";

let chain = Promise.resolve();
export let busy = 0;

function base() {
  let u = (S.settings.llmUrl || "http://127.0.0.1:8080/v1").trim().replace(/\/+$/, "");
  if (!/\/v1$/.test(u)) u += "/v1";
  return u;
}

export function chat(messages, opts = {}) {
  const job = chain.then(() => run(messages, opts));
  chain = job.catch(() => {});
  return job;
}

async function run(messages, opts) {
  busy++;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), (S.settings.llmTimeout || 180) * 1000);
    const body = {
      model: S.settings.llmModel || "local",
      messages,
      max_tokens: opts.max_tokens || S.settings.maxTokens || 180,
      temperature: opts.temperature ?? S.settings.temperature ?? 0.9,
      top_p: 0.95,
      stream: false,
      stop: opts.stop || ["\n" + (S.profile.name || "User") + ":", "\nUser:", "\nHim:", "<|im_end|>", "<end_of_turn>", "<|eot_id|>"],
    };
    const res = await fetch(base() + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + (S.settings.llmKey || "local") },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error("AI server said " + res.status + ": " + (await res.text()).slice(0, 200));
    const j = await res.json();
    const c = j.choices && j.choices[0];
    const text = (c && (c.message?.content ?? c.text)) || "";
    return text;
  } finally { busy--; }
}

export async function ping(url) {
  let u = (url || base()).trim().replace(/\/+$/, "");
  if (!/\/v1$/.test(u)) u += "/v1";
  const res = await fetch(u + "/models", { headers: { Authorization: "Bearer " + (S.settings.llmKey || "local") } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const j = await res.json().catch(() => ({}));
  return (j.data || []).map((m) => m.id);
}

// Try the usual ports for local servers on this device.
export async function discover() {
  const ports = [8080, 8000, 5001, 1234, 11434, 8081, 5000];
  for (const p of ports) {
    const u = `http://127.0.0.1:${p}/v1`;
    try {
      const ctl = new AbortController(); setTimeout(() => ctl.abort(), 1500);
      const r = await fetch(u + "/models", { signal: ctl.signal, headers: { Authorization: "Bearer local" } });
      if (r.ok) return u;
    } catch {}
  }
  return null;
}
