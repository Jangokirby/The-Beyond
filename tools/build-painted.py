#!/usr/bin/env python3
"""Installs the supplied painted art into public/assets/painted and regenerates
js/art/painted/lib.js and picks.js.   usage: build-painted.py <staging dir with in-* folders>
Keeps assets/painted/h (hideouts) and u (seals); everything else is rebuilt."""
import sys, os, re, json, csv, glob, shutil, subprocess
from PIL import Image
S = sys.argv[1]; ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f"{ROOT}/public/assets/painted"; WEB = "assets/painted"
cases = json.loads(subprocess.check_output(["node", f"{ROOT}/tools/dump-cases.js"]))
cases["death-of-a-bloodline"] = {"year": 1976, "npcs": {}, "enemies": [], "scenes": [], "fights": []}
def era_of(y): return "medieval" if y <= 1852 else "victorian" if y <= 1909 else "wars" if y <= 1948 else "atomic" if y <= 1989 else "modern" if y <= 2021 else "now"
for d in "anmsi":
    shutil.rmtree(f"{OUT}/{d}", ignore_errors=True); os.makedirs(f"{OUT}/{d}")
def put(src, d, name, box, q):
    im = Image.open(src).convert("RGB"); im.thumbnail(box, Image.LANCZOS)
    im.save(f"{OUT}/{d}/{name}.jpg", "JPEG", quality=q, optimize=True, progressive=True); return f"{WEB}/{d}/{name}.jpg"
def case_of(name):
    for c in sorted(cases, key=len, reverse=True):
        if name.startswith(c + "-"): return c, name[len(c) + 1:]
    return None, name
HER = [("Maori|Pacific", ["southeast-asian"]), ("Turkish", ["middle-eastern", "mediterranean"]), ("Arab", ["middle-eastern"]), ("Italian", ["mediterranean", "european"]),
       ("Filipino", ["southeast-asian"]), ("Korean|Chinese|Japanese", ["east-asian"]), ("Indian", ["south-asian"]), ("West African|Black American", ["african"]),
       ("Afro-Caribbean", ["afro-caribbean"]), ("Mexican|Brazilian", ["latin-american"]), ("white|Russian|Polish|Irish|Scandinavian|French|British|American", ["european"])]
rows = {r["file"]: r for r in csv.DictReader(open(f"{ROOT}/art/asset-list-v6.csv"))}
lib = {"portraits": [], "monsters": [], "scenes": [], "items": {}}; picks = {}; miss = []
def pk(c): return picks.setdefault(c, {"npcs": {}, "enemies": {}, "scenes": {}, "fights": {}})
# agents
for f in sorted(glob.glob(f"{S}/in-portraits/portraits/agents/*.jpg")):
    n = os.path.basename(f)[:-4]; era, sx, nn = n.split("-")
    r = rows.get(f"portraits/agents/{n}.png"); p = r["prompt"] if r else ""
    m = re.search(r"portrait of \((?:an? )?(.*?)(?::1|\))", p); desc = m.group(1) if m else ""
    tags = next((t for k, t in HER if re.search(k, desc)), ["european"] if int(nn) > 20 else [])
    age = "young" if re.search(r"young|early twenties|twenties", desc) else "old" if re.search(r"fifties|sixties", desc) else "adult"
    lib["portraits"].append({"id": f"a:{n}", "f": put(f, "a", n, (512, 512), 80), "era": [era], "sex": sx, "age": age, "tags": tags})
# npcs
for f in sorted(glob.glob(f"{S}/in-portraits/portraits/npc/*.jpg")):
    n = os.path.basename(f)[:-4]; c, k = case_of(n)
    lib["portraits"].append({"id": f"n:{n}", "f": put(f, "n", n, (512, 512), 80), "era": [era_of(cases[c]["year"]) if c else "modern"], "sex": "", "age": "adult", "tags": [], "npcOnly": True, "pin": True})
    if c == "death-of-a-bloodline": picks.setdefault("_dob", {}).setdefault("portraits", {})[k] = f"n:{n}"
    elif c and k in cases[c]["npcs"]: pk(c)["npcs"][k] = f"n:{n}"
    elif n.startswith("recurring-"): picks.setdefault("_recurring", {})[n[10:]] = f"n:{n}"
    else: miss.append(("npc", n))
# monsters
for f in sorted(glob.glob(f"{S}/in-monsters/monsters/*.jpg")):
    n = os.path.basename(f)[:-4]; c, k = case_of(n)
    lib["monsters"].append({"id": f"m:{n}", "f": put(f, "m", n, (512, 512), 80), "kinds": [], "names": [], "pin": True})
    if c == "death-of-a-bloodline": picks.setdefault("_dob", {}).setdefault("sprites", {})[k] = f"m:{n}"
    elif c and k in cases[c]["enemies"]: pk(c)["enemies"][k] = f"m:{n}"
    else: miss.append(("monster", n))
for f in sorted(glob.glob(f"{S}/in-monsters/monsters/generic/*.jpg")):
    n = os.path.basename(f)[:-4]; era, kind = n.split("-")
    lib["monsters"].append({"id": f"m:g-{n}", "f": put(f, "m", "g-" + n, (512, 512), 80), "kinds": [kind], "names": [], "era": [era]})
# scenes: parts + generic
for f in sorted(glob.glob(f"{S}/in-s[123]/*/*.jpg")):
    n = os.path.basename(f)[:-4]; c, k = case_of(n)
    lib["scenes"].append({"id": f"s:{n}", "f": put(f, "s", n, (1344, 768), 76), "themes": [], "eras": [], "pin": True})
    if c == "death-of-a-bloodline": picks.setdefault("_dob", {}).setdefault("scenes", {})[k] = f"s:{n}"
    elif c and k.startswith("fight-") and k[6:] in cases[c]["fights"]: pk(c)["fights"][k[6:]] = f"s:{n}"
    elif c and k in cases[c]["scenes"]: pk(c)["scenes"][k] = f"s:{n}"
    else: miss.append(("scene", n))
for f in sorted(glob.glob(f"{S}/in-gen/generic/*.jpg")):
    n = os.path.basename(f)[:-4]; theme, era = n.rsplit("-", 1)
    lib["scenes"].append({"id": f"s:g-{n}", "f": put(f, "s", "g-" + n, (1344, 768), 76), "themes": [theme], "eras": [era]})
for f in sorted(glob.glob(f"{S}/in-items/items/*.jpg")):
    k = os.path.basename(f)[:-4]; lib["items"][k] = put(f, "i", k, (256, 256), 82)
dob = picks.pop("_dob", {}); rec = picks.pop("_recurring", {})
open(f"{ROOT}/public/js/art/painted/lib.js", "w").write("/* Generated by tools/build-painted.py: the painted edition's pictures (assets/painted). See js/dossier.js for the fields. */\nwindow.DOSSIER_LIB = " + json.dumps(lib, separators=(",", ":")) + ";\n")
hdr = open(f"{ROOT}/public/js/art/painted/picks.js").read().split("window.DOSSIER_PICKS")[0]
body = {"_recurring": {"npcs": rec}} if False else {}
body.update({c: {k: dict(sorted(v.items())) for k, v in p.items() if v} for c, p in sorted(picks.items())})
body["_recurring"] = rec
open(f"{ROOT}/public/js/art/painted/picks.js", "w").write(hdr + "window.DOSSIER_PICKS = " + json.dumps(body, indent=1) + ";\nwindow.DOSSIER_FIXED = " + json.dumps(dob, indent=1) + ";\n")
miss = [m for m in miss if not m[1].startswith("recurring-")]
print({k: len(v) for k, v in lib.items()}, "unmatched:", miss)
miss_pin = [(c, kind, k) for c, v in cases.items() if c in picks for kind, ks in (("npcs", v["npcs"]), ("enemies", v["enemies"]), ("scenes", v["scenes"]), ("fights", v["fights"])) for k in ks if k not in picks[c][kind]]
print("case entries with no pinned art:", len(miss_pin)); print(miss_pin[:60])
