#!/usr/bin/env node
/* A minimal agent loop: a model with function calling uses Map Studio's tools. Works with any OpenAI-compatible server
   (Ollama, LM Studio, llama.cpp server, vLLM, OpenAI). This is the whole "how does the model know it can" mechanism:
     1. read the tool list from Studio and give it to the model as `tools`
     2. when the model asks for a tool, POST it to Studio and give the result back
     3. repeat until the model answers in plain text
   Usage:  node studio/examples/agent-loop.js "Build a 14x9 medieval tavern and render it" [--model qwen2.5:14b] [--base http://localhost:11434/v1] [--studio http://127.0.0.1:47330] [--steps 20]
   Env: STUDIO_TOKEN / GOBLIN_TOKEN (sent as X-Token), OPENAI_API_KEY (if the model server needs one). Needs Node 18+ (built-in fetch). */
const fs = require("fs"), path = require("path");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > 0 ? process.argv[i + 1] : d; };
const task = process.argv.slice(2).filter((x, i, a) => !x.startsWith("--") && !(i > 0 && a[i - 1].startsWith("--")))[0];
const MODEL = arg("model", "qwen2.5:14b"), BASE = arg("base", "http://localhost:11434/v1"), STUDIO = arg("studio", "http://127.0.0.1:47330"), MAX = +arg("steps", 20);
const TOKEN = process.env.STUDIO_TOKEN || process.env.GOBLIN_TOKEN || "";
const sh = (extra = {}) => ({ "Content-Type": "application/json", ...(TOKEN ? { "X-Token": TOKEN } : {}), ...extra });
/* big results (map packs, images) are summarised before they go back to the model, so they do not fill its context */
const shrink = (r) => JSON.stringify(r, (k, v) => (typeof v === "string" && v.length > 400 ? v.slice(0, 200) + `…(${v.length} chars)` : Array.isArray(v) && v.length > 60 ? [...v.slice(0, 60), `…(${v.length} items)`] : v)).slice(0, 6000);
(async () => {
  if (!task) { console.error("give the task as the first argument"); process.exit(1); }
  const tools = await (await fetch(STUDIO + "/api/tools", { headers: sh() })).json();
  const oa = tools.map((t) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }));
  const brief = fs.readFileSync(path.join(__dirname, "..", "AGENT-BRIEF.md"), "utf8");
  const messages = [{ role: "system", content: brief }, { role: "user", content: task }];
  for (let step = 1; step <= MAX; step++) {
    const res = await fetch(BASE + "/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + (process.env.OPENAI_API_KEY || "none") }, body: JSON.stringify({ model: MODEL, messages, tools: oa, tool_choice: "auto" }) });
    if (!res.ok) { console.error("model server said", res.status, (await res.text()).slice(0, 300)); process.exit(1); }
    const msg = (await res.json()).choices[0].message; messages.push(msg);
    if (!msg.tool_calls || !msg.tool_calls.length) { console.log("\n" + (msg.content || "(no answer)")); return; }
    for (const c of msg.tool_calls) {
      let args = {}; try { args = JSON.parse(c.function.arguments || "{}"); } catch (e) { messages.push({ role: "tool", tool_call_id: c.id, content: "the arguments were not valid JSON: " + e.message }); continue; }
      console.log(`[${step}] ${c.function.name}(${JSON.stringify(args).slice(0, 120)})`);
      const r = await (await fetch(STUDIO + "/api/tool/" + c.function.name, { method: "POST", headers: sh(), body: JSON.stringify(args) })).json();
      messages.push({ role: "tool", tool_call_id: c.id, content: shrink(r) });
    }
  }
  console.log("\nstopped after " + MAX + " steps");
})().catch((e) => { console.error(e.message); process.exit(1); });
