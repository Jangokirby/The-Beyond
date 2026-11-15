#!/usr/bin/env python3
"""Makes the Pixel edition from the Painted one: every picture in assets/painted is shrunk,
colour-reduced and dithered into assets/pixel (PNG), and js/art/pixel/{lib,picks}.js are
copies of the painted ones that point there.   usage: tools/build-pixel.py"""
import os, re, shutil
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DST = f"{ROOT}/public/assets/painted", f"{ROOT}/public/assets/pixel"
SIZE = {"s": (280, 160), "h": (280, 160), "a": (72, 72), "n": (72, 72), "m": (96, 96), "i": (40, 40), "u": (64, 64)}
COLORS = {"s": 40, "h": 40, "a": 32, "n": 32, "m": 32, "i": 24, "u": 24}
shutil.rmtree(DST, ignore_errors=True)
n = 0
for d, box in SIZE.items():
    os.makedirs(f"{DST}/{d}", exist_ok=True)
    for f in sorted(os.listdir(f"{SRC}/{d}")):
        if not f.endswith(".jpg"): continue
        im = Image.open(f"{SRC}/{d}/{f}").convert("RGB").resize(box, Image.BOX)
        im = ImageEnhance.Color(ImageEnhance.Contrast(im).enhance(1.12)).enhance(1.18)
        im = im.quantize(COLORS[d], method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
        im.save(f"{DST}/{d}/{f[:-4]}.png", optimize=True); n += 1
os.makedirs(f"{ROOT}/public/js/art/pixel", exist_ok=True)
for js in ("lib.js", "picks.js"):
    t = open(f"{ROOT}/public/js/art/painted/{js}").read()
    t = re.sub(r"assets/painted/([a-z])/([^\"']+?)\.jpg", r"assets/pixel/\1/\2.png", t)
    open(f"{ROOT}/public/js/art/pixel/{js}", "w").write(t.replace("PAINTED EDITION", "PIXEL EDITION"))
print(n, "pictures")
