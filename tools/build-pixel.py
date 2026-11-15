#!/usr/bin/env python3
"""Makes the Pixel edition from the Painted one: every picture in assets/painted is shrunk,
colour-reduced and dithered into assets/pixel (PNG), and js/art/pixel/{lib,picks}.js are
copies of the painted ones that point there.   usage: tools/build-pixel.py"""
import os, re, shutil
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DST = f"{ROOT}/public/assets/painted", f"{ROOT}/public/assets/pixel"
import numpy as np
from PIL import ImageFilter
SIZE = {"s": (224, 128), "h": (224, 128), "a": (64, 64), "n": (64, 64), "m": (80, 80), "i": (32, 32), "u": (48, 48)}
COLORS = {"s": 20, "h": 20, "a": 18, "n": 18, "m": 18, "i": 14, "u": 14}
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0 - 0.5
def pixelate(im, box, ncol):
    im = im.resize((box[0] * 3, box[1] * 3), Image.BOX).filter(ImageFilter.MedianFilter(5))   # flatten brush texture, then shrink
    im = im.resize(box, Image.BOX)
    im = ImageEnhance.Color(ImageEnhance.Contrast(im).enhance(1.2)).enhance(1.25)
    a = np.asarray(im).astype(float)
    lum = a @ np.array([0.299, 0.587, 0.114])
    gy, gx = np.gradient(lum)
    edge = np.hypot(gx, gy) > 24                                       # dark outline where the picture changes sharply
    a[edge] *= 0.68
    h, w = lum.shape; thr = np.tile(BAYER, (h // 4 + 1, w // 4 + 1))[:h, :w, None] * 26   # ordered (Bayer) dither
    base = Image.fromarray(np.clip(a, 0, 255).astype("uint8")).quantize(ncol, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal = base.convert("RGB")
    out = Image.fromarray(np.clip(a + thr, 0, 255).astype("uint8")).quantize(palette=base, dither=Image.Dither.NONE)
    return out
shutil.rmtree(DST, ignore_errors=True)
n = 0
for d, box in SIZE.items():
    os.makedirs(f"{DST}/{d}", exist_ok=True)
    for f in sorted(os.listdir(f"{SRC}/{d}")):
        if not f.endswith(".jpg"): continue
        pixelate(Image.open(f"{SRC}/{d}/{f}").convert("RGB"), box, COLORS[d]).save(f"{DST}/{d}/{f[:-4]}.png", optimize=True); n += 1
os.makedirs(f"{ROOT}/public/js/art/pixel", exist_ok=True)
for js in ("lib.js", "picks.js"):
    t = open(f"{ROOT}/public/js/art/painted/{js}").read()
    t = re.sub(r"assets/painted/([a-z])/([^\"']+?)\.jpg", r"assets/pixel/\1/\2.png", t)
    open(f"{ROOT}/public/js/art/pixel/{js}", "w").write(t.replace("PAINTED EDITION", "PIXEL EDITION"))
print(n, "pictures")
