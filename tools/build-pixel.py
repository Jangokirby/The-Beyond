#!/usr/bin/env python3
"""Makes the Pixel edition from the Painted one: every picture in assets/painted is shrunk,
colour-reduced and dithered into assets/pixel (PNG), and js/art/pixel/{lib,picks}.js are
copies of the painted ones that point there.   usage: tools/build-pixel.py"""
import os, re, shutil
from PIL import Image, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DST = f"{ROOT}/public/assets/painted", f"{ROOT}/public/assets/pixel"
import sys
import numpy as np
import cv2
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
CUT = ("a", "n")   # portraits become cut-out busts (transparent background) so they can stand in the scene
def cutout(path, box):
    img = cv2.resize(cv2.imread(path), (256, 256), interpolation=cv2.INTER_AREA); h, w = img.shape[:2]
    mask = np.zeros((h, w), np.uint8); bgd = np.zeros((1, 65)); fgd = np.zeros((1, 65))
    cv2.grabCut(img, mask, (int(w * .06), int(h * .06), int(w * .88), int(h * .94)), bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
    m = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
    m = cv2.morphologyEx(cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    k, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if k > 1: m = np.where(lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
    return Image.fromarray(m).resize(box, Image.NEAREST).point(lambda v: 255 if v > 127 else 0)
only = sys.argv[1:] or list(SIZE)
if not sys.argv[1:]: shutil.rmtree(DST, ignore_errors=True)
n = 0
for d, box in SIZE.items():
    if d not in only: continue
    os.makedirs(f"{DST}/{d}", exist_ok=True)
    for f in sorted(os.listdir(f"{SRC}/{d}")):
        if not f.endswith(".jpg"): continue
        im = pixelate(Image.open(f"{SRC}/{d}/{f}").convert("RGB"), box, COLORS[d])
        if d in CUT: im = im.convert("RGB"); im.putalpha(cutout(f"{SRC}/{d}/{f}", box))
        im.save(f"{DST}/{d}/{f[:-4]}.png", optimize=True); n += 1
os.makedirs(f"{ROOT}/public/js/art/pixel", exist_ok=True)
for js in ("lib.js", "picks.js"):
    t = open(f"{ROOT}/public/js/art/painted/{js}").read()
    t = re.sub(r"assets/painted/([a-z])/([^\"']+?)\.jpg", r"assets/pixel/\1/\2.png", t)
    open(f"{ROOT}/public/js/art/pixel/{js}", "w").write(t.replace("PAINTED EDITION", "PIXEL EDITION"))
print(n, "pictures")
