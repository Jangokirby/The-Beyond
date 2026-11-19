// Map Studio for the goblins. Copy this file and mapstudio-tools.json into Overlord's src/main/, then see INSTALL.md (three small edits).
// Each Map Studio tool becomes a goblin tool named studio_<tool>. The goblin only sends small arguments (a room name, a list of changes);
// Map Studio keeps the rooms and does the drawing. Paths a goblin gives (a folder of models, a .glb) must be inside the project, like every other tool.
// Map Studio is started from the project folder if it is not already running, so its files land inside the project. Or point it at one that is
// already running with MAPSTUDIO_URL (and MAPSTUDIO_TOKEN): then files are wherever that Studio runs.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { resolveInside } = require('./sandbox');
const settings = require('./settings');
let secrets = null; try { secrets = require('./secrets'); } catch {}
const SPEC = require('./mapstudio-tools.json');

const PATH_ARGS = ['file', 'dir', 'pack'];          // arguments that name files or folders: resolved inside the project
let child = null, startedAt = 0;

function baseUrl() { let s = null; try { s = settings.get && settings.get(); } catch {} return String(process.env.MAPSTUDIO_URL || (s && s.mapStudioUrl) || 'http://127.0.0.1:47330').replace(/\/+$/, ''); }
function token() { if (process.env.MAPSTUDIO_TOKEN) return process.env.MAPSTUDIO_TOKEN; try { return (secrets && secrets.get && secrets.get('mapStudioToken')) || ''; } catch { return ''; } }
const headers = () => ({ 'Content-Type': 'application/json', ...(token() ? { 'X-Token': token() } : {}) });
async function healthy() { try { const r = await fetch(baseUrl() + '/api/health', { headers: headers(), signal: AbortSignal.timeout(1500) }); return r.ok; } catch { return false; } }

async function ensureRunning(ctx) {
  if (await healthy()) return;
  const entry = path.join(ctx.root, 'studio', 'studio.js');
  if (process.env.MAPSTUDIO_URL || !fs.existsSync(entry)) throw new Error(`Map Studio is not running at ${baseUrl()} and this project has no studio/studio.js to start. Open the project folder that holds The Beyond, or start Map Studio yourself (node studio/studio.js).`);
  const u = new URL(baseUrl());
  if (!child || child.exitCode !== null) { child = spawn(process.execPath, [entry], { cwd: ctx.root, env: { ...process.env, STUDIO_PORT: u.port || '47330', STUDIO_HOST: '127.0.0.1' }, stdio: 'ignore', windowsHide: true }); startedAt = Date.now(); child.unref(); }
  for (let i = 0; i < 40; i++) { if (await healthy()) return; await new Promise(r => setTimeout(r, 500)); }
  throw new Error('Map Studio did not start in 20 seconds. Run "node studio/setup.js" once in the project folder, then try again.');
}

// big strings (map packs, pictures) never go back to the model
function shrink(r) { return JSON.stringify(r, (k, v) => (typeof v === 'string' && v.length > 600 ? v.slice(0, 200) + `…(${v.length} chars)` : Array.isArray(v) && v.length > 80 ? [...v.slice(0, 80), `…(${v.length} items)`] : v), 1).slice(0, 7000); }

async function runTool(spec, a, ctx) {
  await ensureRunning(ctx);
  const args = { ...a };
  for (const k of PATH_ARGS) if (typeof args[k] === 'string' && args[k]) args[k] = resolveInside(ctx.root, args[k]);   // throws if outside the project
  const res = await fetch(baseUrl() + '/api/tool/' + spec.studio, { method: 'POST', headers: headers(), body: JSON.stringify(args), signal: ctx.signal });
  let r; try { r = await res.json(); } catch { throw new Error(`Map Studio answered ${res.status} with something that is not JSON.`); }
  if (!res.ok || r.ok === false || r.error) throw new Error(r.error || `Map Studio said ${res.status}.`);
  // show pictures to the Overlord (and to the goblin if its model can see), and report files that changed
  const files = ['picture', 'pack', 'layout', 'spec'].map(k => r[k]).filter(x => typeof x === 'string' && !path.isAbsolute(x));
  let seen = 0;
  for (const f of files) { const abs = path.join(ctx.root, f); if (fs.existsSync(abs)) { ctx.changed && ctx.changed(f); if (/\.(png|jpg)$/i.test(f) && ctx.image) { ctx.image(abs, f); seen++; } } }
  if (spec.studio === 'render' && !seen) { const jpg = files.map(f => f.replace(/\.beyondmap$|\.layout\.json$|\.json$/, '.jpg')).find(f => fs.existsSync(path.join(ctx.root, f))); if (jpg && ctx.image) { ctx.image(path.join(ctx.root, jpg), jpg); seen++; } }
  return shrink(r) + (seen ? '\n\n' + (ctx.vision ? 'The picture follows in the next message: LOOK at it and check it.' : 'The picture was shown to the Overlord (your model cannot see images).') : '');
}

const tools = SPEC.tools.map(s => ({ name: s.name, risk: s.risk, description: s.description, parameters: s.parameters, run: (a, ctx) => runTool(s, a || {}, ctx) }));
const roleTools = SPEC.roles;                  // { mapper: [names], sculptor: [...], ... } for roles.js
function stop() { try { if (child && child.exitCode === null) child.kill(); } catch {} child = null; }
module.exports = { tools, roleTools, stop, baseUrl };
